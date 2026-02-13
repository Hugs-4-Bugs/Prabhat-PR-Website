import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Star field on canvas - always animating
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.4,
        vx: (Math.random() - 0.3) * 8,
        vy: Math.random() * 4 + 2,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      });
    };

    let lastShoot = 0;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 240, ${0.3 + twinkle * 0.7})`;
        ctx.fill();

        // Glow for bigger stars
        if (star.r > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
          g.addColorStop(0, `rgba(200, 180, 255, ${twinkle * 0.15})`);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Slow drift
        star.y += star.speed;
        if (star.y > h + 5) {
          star.y = -5;
          star.x = Math.random() * w;
        }
      }

      // Shooting stars
      if (time - lastShoot > 4000 + Math.random() * 6000) {
        spawnShootingStar();
        lastShoot = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const alpha = 1 - s.life / s.maxLife;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
        ctx.strokeStyle = `rgba(255, 240, 220, ${alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Nebula clouds - CSS animated, always moving
  const nebulae = useMemo(() => [
    { left: '10%', top: '20%', size: 600, color: 'hsl(350 80% 30%)', dur: 25, delay: 0 },
    { left: '60%', top: '10%', size: 500, color: 'hsl(280 60% 25%)', dur: 30, delay: 5 },
    { left: '30%', top: '60%', size: 700, color: 'hsl(250 50% 20%)', dur: 35, delay: 2 },
    { left: '80%', top: '50%', size: 400, color: 'hsl(220 70% 30%)', dur: 28, delay: 8 },
    { left: '5%', top: '70%', size: 550, color: 'hsl(340 70% 25%)', dur: 32, delay: 4 },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep space gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, hsl(280 40% 8%) 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, hsl(350 50% 6%) 0%, transparent 50%),
                       radial-gradient(ellipse at 50% 50%, hsl(250 30% 4%) 0%, hsl(240 15% 3%) 100%)`,
        }}
      />

      {/* Animated nebula clouds */}
      {nebulae.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: n.left,
            top: n.top,
            width: n.size,
            height: n.size,
            background: `radial-gradient(circle, ${n.color} / 0.12 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 80, -40, 60, 0],
            y: [0, -50, 30, -70, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
          }}
          transition={{
            duration: n.dur,
            delay: n.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Canvas star field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Milky Way band */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background: `linear-gradient(135deg, 
            transparent 30%, 
            hsl(280 40% 40%) 45%, 
            hsl(350 30% 30%) 55%, 
            transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
};

export default CosmicBackground;
