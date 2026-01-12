import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { motion, useSpring } from 'framer-motion';

const LiquidCursor = () => {
  const mousePosition = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    x.set(mousePosition.x);
    y.set(mousePosition.y);
  }, [mousePosition.x, mousePosition.y, x, y]);

  useEffect(() => {
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
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
  }, []);

  return (
    <>
      {/* Main cursor glow */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] mix-blend-screen"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 150 : 80,
            height: isHovering ? 150 : 80,
            opacity: isHovering ? 0.4 : 0.2,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(205 60% 60% / 0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      {/* Secondary trailing cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9998]"
        style={{
          x: useSpring(mousePosition.x, { damping: 40, stiffness: 200 }),
          y: useSpring(mousePosition.y, { damping: 40, stiffness: 200 }),
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 200 : 120,
            height: isHovering ? 200 : 120,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(205 52% 36% / 0.15) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />
      </motion.div>
    </>
  );
};

export default LiquidCursor;
