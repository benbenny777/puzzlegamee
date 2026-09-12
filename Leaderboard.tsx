import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, LeaderboardEntry, Difficulty, PuzzlePiece } from '@/store/useGameStore';
import { playClickSound, playSwapSound } from '@/utils/synth';
import { generateProceduralImage } from './GameContainer'; // Sibling import
import { Award, Zap, Clock, ShieldAlert, Play, Pause, RotateCcw, X, Volume2, Film } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard, resetGame } = useGameStore();
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [activeReplay, setActiveReplay] = useState<LeaderboardEntry | null>(null);

  const filteredEntries = leaderboard
    .filter(entry => filter === 'all' || entry.difficulty === filter)
    .sort((a, b) => b.score - a.score);

  const handleBack = () => {
    playClickSound();
    resetGame();
  };

  return (
    <div className="w-full max-w-4xl text-white font-mono flex flex-col items-center px-4 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2 mb-8 text-center"
      >
        <div className="flex items-center gap-3">
          <Award className="w-10 h-10 text-[#D7FF2F] filter drop-shadow-[0_0_8px_#D7FF2F]" />
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#D7FF2F]">
            LEADERBOARD
          </h1>
        </div>
        <p className="text-xs text-gray-500 tracking-widest mt-1">CYBERNETIC HIGH SCORE REGISTRY</p>
      </motion.div>

      {/* Difficulty Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-6 w-full max-w-2xl bg-white/5 p-1.5 rounded-full border border-white/10">
        {(['all', 'easy', 'insane'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => {
              playClickSound();
              setFilter(diff);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all tracking-wider ${
              filter === diff
                ? 'bg-[#D7FF2F] text-black shadow-[0_0_15px_rgba(215,255,47,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Leaderboard Table Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0c0c0e]/90 border border-white/10 rounded-2xl w-full max-w-3xl flex flex-col p-6 shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D7FF2F]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Live HUD Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs text-emerald-400 font-bold tracking-widest">REGISTRY LIVE</span>
          </div>
          <div className="text-xs text-gray-500">
            TOTAL RECORDS: {filteredEntries.length}
          </div>
        </div>

        {/* Headers */}
        <div className="grid grid-cols-12 text-[10px] text-gray-500 pb-3 font-bold tracking-wider px-3 border-b border-white/5">
          <div className="col-span-1 text-center">RANK</div>
          <div className="col-span-4 pl-4">PLAYER</div>
          <div className="col-span-2 text-center">DIFFICULTY</div>
          <div className="col-span-2 text-center">TIME</div>
          <div className="col-span-2 text-right pr-4">SCORE</div>
          <div className="col-span-1 text-center">REPLAY</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1 mt-2 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar min-h-[150px]">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-2">
              <ShieldAlert className="w-8 h-8 text-white/20" />
              <p className="text-sm">NO DATA LOGGED IN THIS MATRIX</p>
            </div>
          ) : (
            filteredEntries.map((entry, idx) => {
              const rankColor = 
                idx === 0 ? 'text-[#D7FF2F]' :
                idx === 1 ? 'text-cyan-400' :
                idx === 2 ? 'text-purple-400' : 'text-gray-400';

              const rankGlow =
                idx === 0 ? 'drop-shadow-[0_0_6px_rgba(215,255,47,0.5)]' :
                idx === 1 ? 'drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]' :
                idx === 2 ? 'drop-shadow-[0_0_6px_rgba(192,132,252,0.5)]' : '';

              const formatTime = (seconds: number) => {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins}:${secs.toString().padStart(2, '0')}`;
              };

              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={entry.id}
                  className="grid grid-cols-12 items-center py-3.5 px-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5"
                >
                  <div className={`col-span-1 text-center font-black text-sm ${rankColor} ${rankGlow}`}>
                    #{idx + 1}
                  </div>
                  
                  <div className="col-span-4 pl-4 font-bold tracking-widest text-white/90 truncate flex items-center gap-1.5">
                    {entry.playerName}
                    {idx === 0 && <span className="text-[9px] bg-[#D7FF2F]/10 border border-[#D7FF2F]/30 text-[#D7FF2F] px-1 rounded">GOAT</span>}
                  </div>
                  
                  <div className="col-span-2 text-center text-xs">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                      entry.difficulty === 'easy' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      entry.difficulty === 'insane' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                    }`}>
                      {entry.difficulty}
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-center font-bold text-xs text-gray-300 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    {formatTime(entry.completionTime)}
                  </div>
                  
                  <div className="col-span-2 text-right pr-4 text-[#D7FF2F] font-black text-sm tracking-wider flex items-center justify-end gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    {entry.score}
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => {
                        playClickSound();
                        setActiveReplay(entry);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#D7FF2F] hover:border-[#D7FF2F]/40 hover:bg-[#D7FF2F]/5 transition-all"
                      title="Watch Replay Run"
                    >
                      <Film className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center border-t border-white/10 pt-6">
          <button
            onClick={handleBack}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D7FF2F] to-[#c2e62a] text-black font-black tracking-widest hover:shadow-[0_0_25px_rgba(215,255,47,0.5)] active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            RETURN TO BASE
          </button>
        </div>
      </motion.div>

      {/* Replay Overlay Modal */}
      <AnimatePresence>
        {activeReplay && (
          <ReplayModal
            entry={activeReplay}
            onClose={() => {
              playClickSound();
              setActiveReplay(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- REPLAY MODAL COMPONENT --- */
interface ReplayModalProps {
  entry: LeaderboardEntry;
  onClose: () => void;
}

const ReplayModal: React.FC<ReplayModalProps> = ({ entry, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(0);
  const [speed, setSpeed] = useState<0.5 | 1 | 2 | 4>(2); // 2x default
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Pieces for Replay
  useEffect(() => {
    let baseImage = '';
    
    // Generate/fetch the source image
    if (entry.imageType === 'webcam') {
      // Procedural fallback colored grid for webcam replay
      // (so we don't save massive webcam base64 in localstorage)
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 480, 360);
        grad.addColorStop(0, '#7928CA');
        grad.addColorStop(1, '#FF0080');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 480, 360);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 460, 340);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WEBCAM REPLAY', 240, 160);
        ctx.font = '16px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`SOLVER: ${entry.playerName}`, 240, 200);
      }
      baseImage = canvas.toDataURL('image/jpeg');
    } else {
      // Regenerate procedural vector art
      baseImage = generateProceduralImage(entry.imageType, 480, 360);
    }

    // Slicing logic
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = baseImage;
    img.onload = () => {
      const pieceWidth = 480 / entry.gridSize;
      const pieceHeight = 360 / entry.gridSize;
      const initialPieces: PuzzlePiece[] = [];

      for (let y = 0; y < entry.gridSize; y++) {
        for (let x = 0; x < entry.gridSize; x++) {
          const canvas = document.createElement('canvas');
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              img,
              x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight,
              0, 0, pieceWidth, pieceHeight
            );
          }
          const id = y * entry.gridSize + x;
          initialPieces.push({
            id,
            currentIdx: id, // will override with startingOrder
            correctIdx: id,
            imageUrl: canvas.toDataURL('image/jpeg'),
          });
        }
      }

      // Map pieces to their initial shuffled indices
      const shuffledPieces = initialPieces.map((piece) => {
        // find starting index
        const originalIndex = entry.startingOrder.indexOf(piece.correctIdx);
        return {
          ...piece,
          currentIdx: originalIndex !== -1 ? originalIndex : piece.correctIdx,
        };
      });

      setPieces(shuffledPieces);
      setCurrentMoveIdx(0);
    };
  }, [entry]);

  // Replay timeline driver
  useEffect(() => {
    if (!isPlaying || pieces.length === 0) return;

    // Check if replay is complete
    if (currentMoveIdx >= entry.moveHistory.length) {
      setIsPlaying(false);
      return;
    }

    // Determine delay based on recorded timestamps and speed
    const currentMove = entry.moveHistory[currentMoveIdx];
    const prevMove = currentMoveIdx > 0 ? entry.moveHistory[currentMoveIdx - 1] : null;
    const recordedDelta = prevMove ? currentMove.timestamp - prevMove.timestamp : currentMove.timestamp;
    
    // Scale duration, clamp to prevent insanely long wait times
    const duration = Math.min(2500, Math.max(150, recordedDelta)) / speed;

    timeoutRef.current = setTimeout(() => {
      // Execute the swap
      const { indexA, indexB } = currentMove;
      playSwapSound();
      
      setPieces((prev) => {
        const nextPieces = [...prev];
        const p1Idx = nextPieces.findIndex(p => p.currentIdx === indexA);
        const p2Idx = nextPieces.findIndex(p => p.currentIdx === indexB);
        if (p1Idx !== -1 && p2Idx !== -1) {
          nextPieces[p1Idx].currentIdx = indexB;
          nextPieces[p2Idx].currentIdx = indexA;
        }
        return nextPieces;
      });

      setCurrentMoveIdx((prev) => prev + 1);
    }, duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentMoveIdx, pieces, entry, speed]);

  const handleRestart = () => {
    playClickSound();
    setIsPlaying(false);
    
    // Reset to starting order
    setPieces((prev) => {
      return prev.map((piece) => {
        const originalIndex = entry.startingOrder.indexOf(piece.correctIdx);
        return {
          ...piece,
          currentIdx: originalIndex !== -1 ? originalIndex : piece.correctIdx,
        };
      });
    });
    
    setCurrentMoveIdx(0);
    setTimeout(() => setIsPlaying(true), 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0e0e11] border border-white/10 p-6 rounded-2xl flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] font-mono text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            REPLAY DECRYPTOR ONLINE
          </div>
          <h2 className="text-xl font-bold tracking-wider">
            RUN FOR PLAYER: <span className="text-[#D7FF2F]">{entry.playerName}</span>
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase">
            Difficulty: {entry.difficulty} • Move count: {entry.moveHistory.length} • Time: {entry.completionTime}s
          </p>
        </div>

        {/* Puzzle Board Viewer */}
        <div className="w-full flex items-center justify-center bg-black/40 border border-white/5 rounded-xl p-4 aspect-[4/3] max-w-[480px] mx-auto relative overflow-hidden">
          {pieces.length === 0 ? (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-t-transparent border-[#D7FF2F] rounded-full animate-spin" />
              CONSTRUCTING MATRIX SLICES...
            </div>
          ) : (
            <div
              className="relative w-full h-full border border-white/10 rounded-lg overflow-hidden bg-neutral-950"
              style={{ aspectRatio: '4/3' }}
            >
              {pieces.map((piece) => {
                const row = Math.floor(piece.currentIdx / entry.gridSize);
                const col = piece.currentIdx % entry.gridSize;
                const widthPct = 100 / entry.gridSize;
                const heightPct = 100 / entry.gridSize;

                return (
                  <motion.div
                    layout
                    key={piece.id}
                    className="absolute border border-black/80 overflow-hidden"
                    style={{
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                      left: `${col * widthPct}%`,
                      top: `${row * heightPct}%`,
                      padding: '1px',
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  >
                    <img
                      src={piece.imageUrl}
                      alt={`piece-${piece.id}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline Slider / Progress */}
        <div className="mt-5 w-full">
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
            <span>PROGRESS: {currentMoveIdx} / {entry.moveHistory.length} MOVES</span>
            <span>{Math.round((currentMoveIdx / entry.moveHistory.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="bg-emerald-400 h-full shadow-[0_0_10px_#10B981]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentMoveIdx / entry.moveHistory.length) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="mt-5 flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                playClickSound();
                setIsPlaying(!isPlaying);
              }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-orange-400" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#D7FF2F]" />
                  PLAY
                </>
              )}
            </button>
            
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
              title="Reset Timeline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Speed choice */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">SPEED:</span>
            {([0.5, 1, 2, 4] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  playClickSound();
                  setSpeed(s);
                }}
                className={`w-8 py-1 rounded text-[10px] font-black tracking-wider transition-all ${
                  speed === s
                    ? 'bg-[#D7FF2F] text-black'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
