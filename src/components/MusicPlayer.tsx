import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUnmutedRef = useRef(false);

  const musicUrl = "/Whisper.mp3";

  // Create audio and start muted autoplay immediately
  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.volume = 0.1;
    audio.loop = true;
    audio.preload = "auto";
    audio.muted = true;
    audioRef.current = audio;

    // Start muted playback immediately
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Unmute on first user interaction
  useEffect(() => {
    const onInteraction = () => {
      const audio = audioRef.current;
      if (!audio || hasUnmutedRef.current) return;
      hasUnmutedRef.current = true;
      audio.muted = false;
      audio.volume = 0.1;
      setIsMuted(false);
      // If not playing yet, start
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      removeListeners();
    };

    const events = ["click", "touchstart", "keydown", "scroll"];
    events.forEach(e => document.addEventListener(e, onInteraction, { once: false, passive: true }));
    const removeListeners = () => {
      events.forEach(e => document.removeEventListener(e, onInteraction));
    };

    return removeListeners;
  }, []);

  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio.volume = 0.1;
      hasUnmutedRef.current = true;
      setIsMuted(false);
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
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
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="font-body text-xs tracking-wider text-foreground bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border"
          >
            {isPlaying ? "Mute" : "Play Music"}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={handleToggle}
          className="w-12 h-12 rounded-full bg-card/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors duration-300 relative"
          data-cursor-hover
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <motion.div
            initial={false}
            animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
          >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.div>
        </button>
      </motion.div>

      {isPlaying && (
        <motion.div
          className="absolute -top-1 -right-1 flex gap-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 bg-accent rounded-full"
              animate={{ height: ["4px", "8px", "4px"] }}
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
