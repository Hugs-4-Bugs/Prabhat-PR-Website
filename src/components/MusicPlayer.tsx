import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioInitialized = useRef(false);
  const userToggledMute = useRef(false);

  // Change the filename below to switch music (place your .mp3 file in the public/ folder)
  const musicUrl = '/background-music.mp3';

  // Create and configure audio element once (not in JSX to avoid React re-render issues)
  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.volume = 0.1;
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [musicUrl]);

  // Auto-play after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio || audioInitialized.current || userToggledMute.current) return;
      audioInitialized.current = true;

      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser blocked auto-play; try on first user interaction
          audioInitialized.current = false;
          const playOnInteraction = () => {
            if (audioInitialized.current || userToggledMute.current) return;
            audioInitialized.current = true;
            audio.play()
              .then(() => {
                setIsPlaying(true);
                cleanup();
              })
              .catch(() => { audioInitialized.current = false; });
          };
          const cleanup = () => {
            document.removeEventListener('click', playOnInteraction, true);
            document.removeEventListener('keydown', playOnInteraction, true);
            document.removeEventListener('touchstart', playOnInteraction, true);
          };
          document.addEventListener('click', playOnInteraction, true);
          document.addEventListener('keydown', playOnInteraction, true);
          document.addEventListener('touchstart', playOnInteraction, true);
        });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Toggle mute - directly controls audio, no effects involved
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    userToggledMute.current = true;

    if (!isMuted) {
      // Muting: pause the audio
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      // Unmuting: resume the audio
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          setIsMuted(false);
        });
    }
  }, [isMuted]);

  return (
    <>
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
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onPointerDown={(e) => {
              // Stop this click from reaching any document-level listeners
              e.stopPropagation();
              e.preventDefault();
              toggleMute();
            }}
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
    </>
  );
};

export default MusicPlayer;