import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMutedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Change the filename below to switch music (place your .mp3 file in the public/ folder)
  const musicUrl = '/background-music.mp3';

  // Keep ref in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Start music 3 seconds after first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      // Wait 3 seconds before playing
      setTimeout(() => {
        const audio = audioRef.current;
        if (!audio || isMutedRef.current) return;
        audio.volume = 0.1;
        audio.loop = true;
        audio.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log('Play failed:', err));
      }, 3000);

      // Remove all listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Handle mute/unmute toggle
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsMuted(prev => {
      const newMuted = !prev;
      isMutedRef.current = newMuted;

      if (newMuted) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }

      return newMuted;
    });
  }, []);

  return (
    <>
      <audio ref={audioRef} src={musicUrl} preload="auto" />
      
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="font-body text-xs tracking-wider text-foreground bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border"
            >
              {isMuted ? 'Play Music' : 'Mute'}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Music button - using native button inside motion.div to avoid event issues */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="w-12 h-12 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors duration-300 relative"
            data-cursor-hover
            aria-label={isMuted ? 'Play music' : 'Mute music'}
          >
            {/* Sound waves animation when playing */}
            {!isMuted && isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent/30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            <motion.div
              initial={false}
              animate={{ scale: isMuted ? 1 : [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: isMuted ? 0 : Infinity }}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </motion.div>
          </button>
        </motion.div>

        {/* Music visualizer bars */}
        {!isMuted && isPlaying && (
          <motion.div
            className="absolute -top-1 -right-1 flex gap-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-accent rounded-full"
                animate={{ height: ['4px', '8px', '4px'] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default MusicPlayer;
