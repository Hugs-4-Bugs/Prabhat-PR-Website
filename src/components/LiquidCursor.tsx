import { useEffect, useRef, useState, useMemo } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { motion, useSpring } from 'framer-motion';

const LiquidCursor = () => {
  const mousePosition = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 25, stiffness: 300 };
  const trailConfig = { damping: 40, stiffness: 200 };
  
  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);
  const trailX = useSpring(mousePosition.x, trailConfig);
  const trailY = useSpring(mousePosition.y, trailConfig);

  useEffect(() => {
    x.set(mousePosition.x);
    y.set(mousePosition.y);
    trailX.set(mousePosition.x);
    trailY.set(mousePosition.y);
    
    // Show cursor once mouse moves
    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      setIsVisible(true);
    }
  }, [mousePosition.x, mousePosition.y, x, y, trailX, trailY]);

  useEffect(() => {
    const updateInteractiveElements = () => {
      const handleHoverStart = () => setIsHovering(true);
      const handleHoverEnd = () => setIsHovering(false);

      const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });

      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', handleHoverStart);
          el.removeEventListener('mouseleave', handleHoverEnd);
        });
      };
    };

    const cleanup = updateInteractiveElements();
    
    // Re-attach listeners when DOM changes
    const observer = new MutationObserver(() => {
      cleanup();
      updateInteractiveElements();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  // Hide on mobile/touch devices
  const isTouchDevice = useMemo(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main liquid cursor glow */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] mix-blend-screen"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 180 : 100,
            height: isHovering ? 180 : 100,
            opacity: isHovering ? 0.5 : 0.25,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, hsl(var(--accent) / 0.2) 40%, transparent 70%)',
            filter: 'blur(25px)',
          }}
        />
      </motion.div>

      {/* Secondary morphing trail */}
      <motion.div
        className="pointer-events-none fixed z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 250 : 150,
            height: isHovering ? 250 : 150,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 60%)',
            filter: 'blur(35px)',
          }}
        />
      </motion.div>

      {/* Inner dot cursor */}
      <motion.div
        className="pointer-events-none fixed z-[10000]"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full bg-accent"
          animate={{
            width: isHovering ? 12 : 6,
            height: isHovering ? 12 : 6,
            opacity: isHovering ? 0.9 : 0.7,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </motion.div>
    </>
  );
};

export default LiquidCursor;
