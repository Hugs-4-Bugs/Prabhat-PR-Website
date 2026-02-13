import { useEffect, useRef } from 'react';

const CosmicBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure autoplay on all browsers
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const tryPlay = () => {
      video.play().catch(() => {
        // Retry on user interaction if autoplay blocked
        const playOnce = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', playOnce);
          document.removeEventListener('scroll', playOnce);
        };
        document.addEventListener('click', playOnce, { once: true });
        document.addEventListener('scroll', playOnce, { once: true });
      });
    };

    tryPlay();
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Video background - always playing like a movie */}
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover"
        src="/cosmic-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          filter: 'brightness(0.55) saturate(1.4)',
        }}
      />

      {/* Overlay to blend with content */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(280 40% 8% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(350 50% 6% / 0.5) 0%, transparent 50%),
            linear-gradient(180deg, hsl(250 25% 4% / 0.3) 0%, transparent 40%, hsl(250 25% 4% / 0.3) 100%)
          `,
        }}
      />
    </div>
  );
};

export default CosmicBackground;
