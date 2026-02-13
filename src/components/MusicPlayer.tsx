import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoPlayed = useRef(false);

  // Change the filename below to switch music (place your .mp3 file in the public/ folder)
  const musicUrl = '/background-music.mp3';

  // Create audio element once
  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.volume = 0.1;
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Auto-play after 3 seconds
    const timer = setTimeout(() => {
      if (hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Auto-play blocked — use a one-time interaction listener
          // We use { once: true } so it auto-removes and can never conflict
          const playOnce = () => {
            audio.play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          };
          document.addEventListener('click', playOnce, { once: true });
          document.addEventListener('keydown', playOnce, { once: true });
        });
    }, 3000);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [musicUrl]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Currently playing → pause it
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      // Currently paused → play it
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {});
    }
  }, [isPlaying]);

  return (
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
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors duration-300 relative"
          data-cursor-hover
          aria-label={isMuted ? 'Play music' : 'Mute music'}
        >
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
  );
};

export default MusicPlayer;