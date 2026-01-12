import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  scale: number;
  rotation: number;
}

const MouseTrail = () => {
  const mousePosition = useMousePosition();
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const trailIdRef = useRef(0);

  // Spring-based main cursor
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    cursorX.set(mousePosition.x);
    cursorY.set(mousePosition.y);

    // Add new trail point
    const newPoint: TrailPoint = {
      x: mousePosition.x,
      y: mousePosition.y,
      id: trailIdRef.current++,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    };

    setTrail((prev) => [...prev.slice(-12), newPoint]);
  }, [mousePosition.x, mousePosition.y, cursorX, cursorY]);

  // Remove old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 80);
    return () => clearInterval(interval);
  }, []);

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
      {/* Trail morphing shapes */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="pointer-events-none fixed z-[9997]"
          initial={{ opacity: 0.6, scale: 0 }}
          animate={{
            opacity: 0,
            scale: point.scale * (isHovering ? 1.5 : 1),
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            left: point.x,
            top: point.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          <motion.div
            className="w-4 h-4"
            animate={{ rotate: point.rotation + 180 }}
            transition={{ duration: 1, ease: 'linear' }}
            style={{
              background: `radial-gradient(circle, hsl(${180 + index * 8} 70% 60% / ${0.4 - index * 0.03}) 0%, transparent 70%)`,
              borderRadius: index % 3 === 0 ? '50%' : index % 3 === 1 ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '70% 30% 30% 70% / 70% 70% 30% 30%',
              filter: 'blur(3px)',
              transform: `scale(${1 + (12 - index) * 0.1})`,
            }}
          />
        </motion.div>
      ))}

      {/* Main cursor glow */}
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 120 : 60,
            height: isHovering ? 120 : 60,
            opacity: isHovering ? 0.5 : 0.3,
            rotate: [0, 360],
          }}
          transition={{
            width: { duration: 0.3 },
            height: { duration: 0.3 },
            opacity: { duration: 0.3 },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          }}
          style={{
            background: 'radial-gradient(circle, hsl(205 60% 60% / 0.5) 0%, hsl(180 60% 50% / 0.2) 50%, transparent 70%)',
            filter: 'blur(15px)',
          }}
        />
      </motion.div>

      {/* Secondary morphing cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9998]"
        style={{
          x: useSpring(mousePosition.x, { damping: 35, stiffness: 250 }),
          y: useSpring(mousePosition.y, { damping: 35, stiffness: 250 }),
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 180 : 100,
            height: isHovering ? 180 : 100,
            borderRadius: isHovering 
              ? '60% 40% 30% 70% / 60% 30% 70% 40%'
              : '30% 70% 70% 30% / 30% 30% 70% 70%',
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(205 52% 36% / 0.2) 0%, hsl(180 40% 40% / 0.1) 50%, transparent 60%)',
            filter: 'blur(25px)',
          }}
        />
      </motion.div>
    </>
  );
};

export default MouseTrail;
