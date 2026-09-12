import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GamePhase = 'idle' | 'capture' | 'solve' | 'leaderboard';
export type Difficulty = 'easy' | 'insane';

export interface PuzzlePiece {
  id: number;
  currentIdx: number;
  correctIdx: number;
  imageUrl: string; // Base64 sliced image
}

export interface ReplayMove {
  indexA: number;
  indexB: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  completionTime: number;
  difficulty: Difficulty;
  gridSize: number;
  score: number;
  date: string;
  moveHistory: ReplayMove[];
  startingOrder: number[];
  imageType: 'sunset' | 'matrix' | 'neon-grid' | 'webcam';
}

interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  gridSize: number;
  pieces: PuzzlePiece[];
  timer: number;
  isTimerRunning: boolean;
  leaderboard: LeaderboardEntry[];
  moveHistory: ReplayMove[];
  selectedPieceIdx: number | null; // For tracking puzzle piece selection in both Mouse and Gesture mode
  gameStartTime: number | null;
  score: number;

  setPhase: (phase: GamePhase) => void;
  setDifficulty: (diff: Difficulty) => void;
  setPieces: (pieces: PuzzlePiece[]) => void;
  selectPiece: (idx: number | null) => void;
  swapPieces: (idx1: number, idx2: number) => void;
  startTimer: () => void;
  tickTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  addLeaderboardEntry: (entry: LeaderboardEntry) => void;
  resetGame: () => void;
  checkVictory: () => boolean;
  calculateScore: () => number;
}

const getGridSize = (diff: Difficulty) => {
  switch (diff) {
    case 'easy': return 3;
    case 'insane': return 6;
    default: return 3;
  }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      difficulty: 'easy',
      gridSize: 3,
      pieces: [],
      timer: 0,
      isTimerRunning: false,
      leaderboard: [],
      moveHistory: [],
      selectedPieceIdx: null,
      gameStartTime: null,
      score: 0,

      setPhase: (phase) => {
        if (phase === 'solve') {
          set({ 
            phase, 
            timer: 0, 
            isTimerRunning: true, 
            moveHistory: [], 
            selectedPieceIdx: null, 
            gameStartTime: Date.now(),
            score: 10000
          });
        } else if (phase === 'idle') {
          set({ phase, isTimerRunning: false, pieces: [], selectedPieceIdx: null });
        } else {
          set({ phase, isTimerRunning: false });
        }
      },
      setDifficulty: (diff) => set({ difficulty: diff, gridSize: getGridSize(diff) }),
      setPieces: (pieces) => set({ pieces }),
      selectPiece: (idx) => set({ selectedPieceIdx: idx }),
      swapPieces: (idx1, idx2) => set((state) => {
        if (idx1 === idx2) return { selectedPieceIdx: null };

        const newPieces = [...state.pieces];
        
        // Find the pieces currently at index idx1 and idx2
        const p1Idx = newPieces.findIndex(p => p.currentIdx === idx1);
        const p2Idx = newPieces.findIndex(p => p.currentIdx === idx2);
        
        if (p1Idx !== -1 && p2Idx !== -1) {
          newPieces[p1Idx].currentIdx = idx2;
          newPieces[p2Idx].currentIdx = idx1;
          
          const timestamp = state.gameStartTime ? Date.now() - state.gameStartTime : 0;
          const newHistory = [...state.moveHistory, { indexA: idx1, indexB: idx2, timestamp }];
          
          return { 
            pieces: newPieces, 
            moveHistory: newHistory,
            selectedPieceIdx: null
          };
        }
        return { selectedPieceIdx: null };
      }),
      startTimer: () => set({ isTimerRunning: true }),
      tickTimer: () => set((state) => ({ timer: state.timer + 1 })),
      stopTimer: () => set({ isTimerRunning: false }),
      resetTimer: () => set({ timer: 0 }),
      addLeaderboardEntry: (entry) => set((state) => ({ 
        leaderboard: [...state.leaderboard, entry].sort((a, b) => b.score - a.score) 
      })),
      resetGame: () => set({
        phase: 'idle',
        pieces: [],
        timer: 0,
        isTimerRunning: false,
        moveHistory: [],
        selectedPieceIdx: null,
        gameStartTime: null,
        score: 0
      }),
      checkVictory: () => {
        const { pieces } = get();
        if (pieces.length === 0) return false;
        // Verify every piece is in its correct grid position
        return pieces.every(p => p.currentIdx === p.correctIdx);
      },
      calculateScore: () => {
        const { timer, difficulty } = get();
        const baseScore = 10000;
        const timePenalty = timer * 50;
        const difficultyMultiplier = { easy: 1, insane: 3 }[difficulty];
        const finalScore = Math.max(0, Math.round((baseScore - timePenalty) * difficultyMultiplier));
        set({ score: finalScore });
        return finalScore;
      }
    }),
    {
      name: 'ai-puzzle-storage',
      partialize: (state) => ({ leaderboard: state.leaderboard }),
    }
  )
);
