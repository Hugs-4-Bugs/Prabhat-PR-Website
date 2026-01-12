import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calm ambient background music URL (royalty-free) - soft piano/ambient
  const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15; // Softer volume
    audio.loop = true;

    // Handle user interaction to start audio
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Don't auto-play, wait for user to unmute
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isMuted && hasInteracted) {
      audio.play().catch(console.log);
    } else {
      audio.pause();
    }
  }, [isMuted, hasInteracted]);

  const toggleMute = () => {
    setHasInteracted(true);
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
              className="font-body text-xs tracking-wider text-primary-foreground/80 bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary-foreground/20"
            >
              {isMuted ? 'Play Music' : 'Mute'}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Music button */}
        <motion.button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-md border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary transition-colors duration-300 relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          data-cursor-hover
          aria-label={isMuted ? 'Play music' : 'Mute music'}
        >
          {/* Sound waves animation when playing */}
          {!isMuted && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary-foreground/30"
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
        {!isMuted && (
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
