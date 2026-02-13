import { useState, useEffect, useRef, useCallback } from 'react';

export interface HandState {
  isTracking: boolean;
  position: { x: number; y: number; z: number } | null;
  isOpen: boolean;
  isPinching: boolean;
}

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });

export const useHandTracking = () => {
  const [handState, setHandState] = useState<HandState>({
    isTracking: false, position: null, isOpen: false, isPinching: false,
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);

  const startTracking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.min.js');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      setStream(mediaStream);

      const video = document.createElement('video');
      video.srcObject = mediaStream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.style.position = 'fixed';
      video.style.top = '-9999px';
      document.body.appendChild(video);
      videoRef.current = video;

      const Hands = (window as any).Hands;
      if (!Hands) throw new Error('MediaPipe Hands failed to load');

      const hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks?.length > 0) {
          const lm = results.multiHandLandmarks[0];
          const wrist = lm[0];
          const thumbTip = lm[4];
          const indexTip = lm[8];
          const middleTip = lm[12];
          const ringTip = lm[16];

          const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
          const spread = Math.hypot(indexTip.x - ringTip.x, indexTip.y - ringTip.y);

          setHandState({
            isTracking: true,
            position: { x: 1 - wrist.x, y: wrist.y, z: wrist.z || 0 },
            isOpen: spread > 0.12,
            isPinching: pinchDist < 0.06,
          });
        } else {
          setHandState(prev => ({ ...prev, isTracking: false, position: null }));
        }
      });

      handsRef.current = hands;
      await video.play();

      const processFrame = async () => {
        frameCount.current++;
        if (frameCount.current % 3 === 0 && video.readyState >= 2 && handsRef.current) {
          try { await handsRef.current.send({ image: video }); } catch {}
        }
        rafRef.current = requestAnimationFrame(processFrame);
      };
      processFrame();

      setIsEnabled(true);
    } catch (err: any) {
      console.error('Hand tracking error:', err);
      setError(err.message || 'Failed to start hand tracking');
    }
    setIsLoading(false);
  }, []);

  const stopTracking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (videoRef.current) {
      const s = videoRef.current.srcObject as MediaStream;
      s?.getTracks().forEach(t => t.stop());
      videoRef.current.remove();
      videoRef.current = null;
    }
    if (handsRef.current) { try { handsRef.current.close(); } catch {} handsRef.current = null; }
    setStream(null);
    setIsEnabled(false);
    setHandState({ isTracking: false, position: null, isOpen: false, isPinching: false });
  }, []);

  useEffect(() => () => { stopTracking(); }, [stopTracking]);

  return { handState, isEnabled, isLoading, error, stream, startTracking, stopTracking };
};
