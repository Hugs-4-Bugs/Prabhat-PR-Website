import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(false); // Start unmuted for auto-play
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calm ambient background music URL (royalty-free) - soft piano/ambient
  const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3';

  // Auto-play on first user interaction (required by browsers)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.1; // Very soft volume
    audio.loop = true;

    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Auto-play blocked, wait for user interaction
        console.log('Auto-play blocked, waiting for user interaction');
      }
    };

    // Try to auto-play immediately
    tryAutoPlay();

    // Also try on any user interaction
    const handleInteraction = async () => {
      if (!isPlaying && !isMuted) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.log('Play failed:', err);
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [isPlaying, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else if (!isPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(console.log);
    }
  }, [isMuted, isPlaying]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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

        {/* Music button */}
        <motion.button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors duration-300 relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button>

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
