import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { motion, useSpring } from 'framer-motion';

const LiquidCursor = () => {
  const mousePosition = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const springConfig = { damping: 20, stiffness: 350 };
  const trailConfig = { damping: 35, stiffness: 180 };
  const outerConfig = { damping: 50, stiffness: 120 };

  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);
  const trailX = useSpring(mousePosition.x, trailConfig);
  const trailY = useSpring(mousePosition.y, trailConfig);
  const outerX = useSpring(mousePosition.x, outerConfig);
  const outerY = useSpring(mousePosition.y, outerConfig);

  useEffect(() => {
    x.set(mousePosition.x);
    y.set(mousePosition.y);
    trailX.set(mousePosition.x);
    trailY.set(mousePosition.y);
    outerX.set(mousePosition.x);
    outerY.set(mousePosition.y);

    if (mousePosition.x !== 0 || mousePosition.y !== 0) {
      setIsVisible(true);
    }
  }, [mousePosition.x, mousePosition.y, x, y, trailX, trailY, outerX, outerY]);

  // Aurora canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    const drawAurora = () => {
      timeRef.current += 0.02;
      const t = timeRef.current;

      ctx.clearRect(0, 0, 200, 200);

      const cx = 100;
      const cy = 100;

      // Multiple aurora layers with OLED-vibrant colors
      for (let i = 0; i < 5; i++) {
        const angle = t * (0.5 + i * 0.15) + i * 1.2;
        const radius = 30 + Math.sin(t * 0.8 + i) * 15;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle * 0.7) * radius;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 60 + i * 10);

        if (i === 0) {
          grad.addColorStop(0, `hsla(140, 100%, 55%, ${isHovering ? 0.6 : 0.3})`);
          grad.addColorStop(0.4, `hsla(160, 90%, 45%, ${isHovering ? 0.3 : 0.15})`);
          grad.addColorStop(1, 'transparent');
        } else if (i === 1) {
          grad.addColorStop(0, `hsla(280, 80%, 60%, ${isHovering ? 0.5 : 0.25})`);
          grad.addColorStop(0.5, `hsla(300, 70%, 45%, ${isHovering ? 0.2 : 0.1})`);
          grad.addColorStop(1, 'transparent');
        } else if (i === 2) {
          grad.addColorStop(0, `hsla(200, 100%, 60%, ${isHovering ? 0.45 : 0.2})`);
          grad.addColorStop(0.4, `hsla(220, 90%, 50%, ${isHovering ? 0.2 : 0.1})`);
          grad.addColorStop(1, 'transparent');
        } else if (i === 3) {
          grad.addColorStop(0, `hsla(350, 90%, 55%, ${isHovering ? 0.35 : 0.15})`);
          grad.addColorStop(0.5, `hsla(10, 80%, 45%, ${isHovering ? 0.15 : 0.07})`);
          grad.addColorStop(1, 'transparent');
        } else {
          grad.addColorStop(0, `hsla(60, 100%, 65%, ${isHovering ? 0.3 : 0.12})`);
          grad.addColorStop(0.4, `hsla(45, 90%, 50%, ${isHovering ? 0.15 : 0.06})`);
          grad.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 200, 200);
      }

      animFrameRef.current = requestAnimationFrame(drawAurora);
    };

    drawAurora();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isHovering]);

  useEffect(() => {
    const updateInteractiveElements = () => {
      const handleHoverStart = () => setIsHovering(true);
      const handleHoverEnd = () => setIsHovering(false);

      const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select, .liquid-btn, .liquid-card');
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

  // Add liquid tracking to buttons/cards on mousemove
  useEffect(() => {
    const handleLiquidTrack = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.liquid-btn, .liquid-card');
      if (target) {
        const rect = (target as HTMLElement).getBoundingClientRect();
        const lx = ((e.clientX - rect.left) / rect.width) * 100;
        const ly = ((e.clientY - rect.top) / rect.height) * 100;
        (target as HTMLElement).style.setProperty('--liquid-x', `${lx}%`);
        (target as HTMLElement).style.setProperty('--liquid-y', `${ly}%`);
        (target as HTMLElement).style.setProperty('--card-x', `${lx}%`);
        (target as HTMLElement).style.setProperty('--card-y', `${ly}%`);
      }
    };
    window.addEventListener('mousemove', handleLiquidTrack);
    return () => window.removeEventListener('mousemove', handleLiquidTrack);
  }, []);

  const isTouchDevice = useMemo(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* OLED Aurora canvas cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.canvas
          ref={canvasRef}
          animate={{
            width: isHovering ? 220 : 140,
            height: isHovering ? 220 : 140,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* Secondary nebula trail */}
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
            width: isHovering ? 280 : 180,
            height: isHovering ? 280 : 180,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsla(140, 90%, 50%, 0.08) 0%, hsla(280, 70%, 50%, 0.05) 40%, transparent 70%)',
            filter: 'blur(30px)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* Outer glow ring */}
      <motion.div
        className="pointer-events-none fixed z-[9997]"
        style={{
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 0.6 : 0,
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 350 : 250,
            height: isHovering ? 350 : 250,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsla(200, 100%, 55%, 0.04) 0%, hsla(350, 80%, 50%, 0.03) 30%, transparent 60%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* Inner dot - pure white for OLED punch */}
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
          className="rounded-full"
          animate={{
            width: isHovering ? 14 : 6,
            height: isHovering ? 14 : 6,
            opacity: isHovering ? 1 : 0.85,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, #fff 0%, hsla(140, 100%, 70%, 0.8) 60%, transparent 100%)',
            boxShadow: '0 0 8px hsla(140, 100%, 60%, 0.6), 0 0 20px hsla(140, 100%, 50%, 0.3)',
          }}
        />
      </motion.div>
    </>
  );
};

export default LiquidCursor;
