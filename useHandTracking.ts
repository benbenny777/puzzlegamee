import { useEffect, useState, useRef } from 'react';

export const useHandTracking = (
  videoElement: React.RefObject<HTMLVideoElement | null>,
  canvasElement: React.RefObject<HTMLCanvasElement | null>,
  isActive: boolean
) => {
  const [isReady, setIsReady] = useState(false);
  const [pinchDetected, setPinchDetected] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !videoElement.current || !isActive) {
      setIsReady(false);
      return;
    }

    let active = true;

    const drawHandSkeleton = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Skeleton connections
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [5, 9], [9, 10], [10, 11], [11, 12], // Middle
        [9, 13], [13, 14], [14, 15], [15, 16], // Ring
        [13, 17], [17, 18], [18, 19], [19, 20], [0, 17] // Pinky
      ];

      // Draw lines
      ctx.strokeStyle = '#10B981'; // Neon emerald green
      ctx.lineWidth = 3;
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 6;
      
      connections.forEach(([p1, p2]) => {
        const pt1 = landmarks[p1];
        const pt2 = landmarks[p2];
        if (pt1 && pt2) {
          ctx.beginPath();
          ctx.moveTo((1 - pt1.x) * width, pt1.y * height); // mirrored
          ctx.lineTo((1 - pt2.x) * width, pt2.y * height); // mirrored
          ctx.stroke();
        }
      });

      // Draw joints
      ctx.fillStyle = '#D7FF2F'; // Neon yellow-green
      ctx.shadowColor = '#D7FF2F';
      ctx.shadowBlur = 8;
      landmarks.forEach((pt: any) => {
        ctx.beginPath();
        ctx.arc((1 - pt.x) * width, pt.y * height, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.shadowBlur = 0; // reset shadow glow
    };

    const initializeMediaPipe = async () => {
      try {
        // Dynamically import MediaPipe modules to prevent SSR issues during build
        const mpHands = await import('@mediapipe/hands');
        const mpCamera = await import('@mediapipe/camera_utils');

        if (!active || !videoElement.current) return;

        // Pin the CDN assets to the exact version of the package installed to prevent WASM structure mismatches
        const handsVersion = mpHands.VERSION || '0.4.1675469240';
        const hands = new mpHands.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${handsVersion}/${file}`,
        });

        // Guard against component being unmounted while Hands is initializing
        if (!active) {
          try { hands.close(); } catch {}
          return;
        }

        hands.setOptions({
          maxNumHands: 1, // Track single hand to optimize processing speed and reduce CPU usage
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results) => {
          if (!active) return;
          
          // Draw skeleton on PIP preview canvas
          if (canvasElement.current && results.multiHandLandmarks) {
            const ctx = canvasElement.current.getContext('2d');
            if (ctx) {
              if (results.multiHandLandmarks.length > 0) {
                drawHandSkeleton(ctx, results.multiHandLandmarks[0]);
              } else {
                ctx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
              }
            }
          }

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // Index finger tip (landmark 8) and Thumb tip (landmark 4)
            const indexTip = landmarks[8];
            const thumbTip = landmarks[4];

            // Calculate distance for pinch detection
            const distance = Math.sqrt(
              Math.pow(indexTip.x - thumbTip.x, 2) + Math.pow(indexTip.y - thumbTip.y, 2)
            );

            // Distance threshold for pinch gesture (thumb and index finger meeting)
            const isPinching = distance < 0.045;
            setPinchDetected(isPinching);

            setCursorPos((prev) => {
              // Mirror the x-coordinate because webcam input is mirrored
              const targetX = 1 - indexTip.x;
              const targetY = indexTip.y;
              
              // Exponential smoothing to filter out hand tremors and jitter
              const smoothX = prev.x + (targetX - prev.x) * 0.45;
              const smoothY = prev.y + (targetY - prev.y) * 0.45;
              
              return { x: smoothX, y: smoothY };
            });
          } else {
            setPinchDetected(false);
          }
        });

        handsRef.current = hands;

        const camera = new mpCamera.Camera(videoElement.current, {
          onFrame: async () => {
            if (videoElement.current && active) {
              const video = videoElement.current;
              // Guard: Only feed frames to MediaPipe if video is initialized and has valid dimensions
              if (
                video.readyState >= 2 && // HTMLMediaElement.HAVE_CURRENT_DATA or higher
                video.videoWidth > 0 &&
                video.videoHeight > 0
              ) {
                try {
                  await hands.send({ image: video });
                } catch (err) {
                  console.error('MediaPipe frame processing failed:', err);
                }
              }
            }
          },
          width: 640, // 640x480 resolution for high frame-rates and low latency
          height: 480,
        });

        // Guard before camera registration
        if (!active) {
          try { camera.stop(); } catch {}
          try { hands.close(); } catch {}
          handsRef.current = null;
          return;
        }

        cameraRef.current = camera;
        await camera.start();

        // Guard after camera start
        if (!active) {
          try { camera.stop(); } catch {}
          try { hands.close(); } catch {}
          cameraRef.current = null;
          handsRef.current = null;
          return;
        }

        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize MediaPipe Hands:', err);
      }
    };

    initializeMediaPipe();

    return () => {
      active = false;
      setIsReady(false);
      setPinchDetected(false);
      
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (e) {
          console.error('Failed to stop camera:', e);
        }
        cameraRef.current = null;
      }
      
      if (handsRef.current) {
        try {
          handsRef.current.close();
        } catch (e) {
          console.error('Failed to close Hands model:', e);
        }
        handsRef.current = null;
      }
    };
  }, [videoElement, canvasElement, isActive]);

  return { isReady, pinchDetected, cursorPos };
};
export type HandTrackingData = ReturnType<typeof useHandTracking>;
