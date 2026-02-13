import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import spaceVideo from '@/assets/space-nebula.mp4';
import natureVideo from '@/assets/nature-forest.mp4';

const useTheme = () => {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

// Shooting star with trail
const ShootingStar = ({ delay, top, left }: { delay: number; top: number; left: number }) => (
  <motion.div
    className="absolute"
    style={{ top: `${top}%`, left: `${left}%` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0], x: [0, 250], y: [0, 120] }}
    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 5 + Math.random() * 12, delay, ease: 'easeOut' }}
  >
    <div className="w-[2px] h-[2px] bg-white rounded-full" style={{ boxShadow: '0 0 6px 3px rgba(255,255,255,0.5)' }} />
    <div
      className="absolute top-0 right-full w-24 h-[1px]"
      style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.7), transparent)' }}
    />
  </motion.div>
);

// ===== SPACE THEME (Dark Mode) =====
const SpaceTheme = () => (
  <>
    {/* Video background layer */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-25"
      src={spaceVideo}
    />

    {/* Nebula gradient layer 1 - slow rotation */}
    <motion.div
      className="absolute w-[250%] h-[250%] -top-[75%] -left-[75%]"
      style={{
        background: `
          radial-gradient(ellipse at 25% 35%, rgba(139, 0, 30, 0.2) 0%, transparent 45%),
          radial-gradient(ellipse at 75% 60%, rgba(75, 0, 130, 0.18) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 50%, rgba(0, 15, 80, 0.22) 0%, transparent 55%)
        `,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
    />

    {/* Nebula gradient layer 2 - counter rotation */}
    <motion.div
      className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%]"
      style={{
        background: `
          radial-gradient(ellipse at 60% 25%, rgba(200, 0, 60, 0.12) 0%, transparent 40%),
          radial-gradient(ellipse at 30% 75%, rgba(0, 60, 160, 0.1) 0%, transparent 45%),
          radial-gradient(ellipse at 80% 80%, rgba(120, 0, 80, 0.08) 0%, transparent 35%)
        `,
      }}
      animate={{ rotate: -360 }}
      transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
    />

    {/* Milky way band */}
    <div
      className="absolute w-[350%] h-[20%] top-[40%] -left-[125%]"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(200, 180, 255, 0.06), rgba(255, 200, 180, 0.04), rgba(200, 180, 255, 0.06), transparent)',
        transform: 'rotate(-25deg)',
        filter: 'blur(50px)',
      }}
    />

    {/* Pulsing distant galaxies */}
    {[
      { top: '12%', left: '78%', size: 40, color: 'rgba(200, 100, 255, 0.15)' },
      { top: '72%', left: '85%', size: 30, color: 'rgba(100, 150, 255, 0.12)' },
      { top: '85%', left: '15%', size: 50, color: 'rgba(255, 100, 150, 0.1)' },
    ].map((g, i) => (
      <motion.div
        key={`galaxy-${i}`}
        className="absolute rounded-full"
        style={{
          top: g.top,
          left: g.left,
          width: g.size,
          height: g.size,
          background: `radial-gradient(circle, ${g.color}, transparent 70%)`,
          filter: 'blur(3px)',
        }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
      />
    ))}

    {/* Shooting stars */}
    {Array.from({ length: 7 }, (_, i) => (
      <ShootingStar key={i} delay={i * 2.5} top={5 + Math.random() * 40} left={Math.random() * 70} />
    ))}

    {/* Planet - Mars-like */}
    <motion.div
      className="absolute w-14 h-14 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #CD853F, #8B4513, #3a1500)',
        boxShadow: '0 0 30px rgba(205, 133, 63, 0.25), inset -5px -5px 12px rgba(0,0,0,0.6)',
        top: '15%',
        right: '10%',
        opacity: 0.5,
      }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Planet - Jupiter-like with bands */}
    <motion.div
      className="absolute w-24 h-24 rounded-full overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 40% 30%, #c4956a, #a0724e, #6e4b33)',
        boxShadow: '0 0 40px rgba(196, 149, 106, 0.15), inset -6px -6px 15px rgba(0,0,0,0.5)',
        bottom: '20%',
        left: '6%',
        opacity: 0.35,
      }}
      animate={{ y: [0, 20, 0], x: [0, -12, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Jupiter bands */}
      {[20, 35, 50, 65, 80].map((t, i) => (
        <div
          key={i}
          className="absolute w-full h-[3px]"
          style={{
            top: `${t}%`,
            background: `rgba(${i % 2 === 0 ? '80,50,30' : '160,120,80'}, 0.3)`,
          }}
        />
      ))}
    </motion.div>

    {/* Saturn with ring */}
    <motion.div
      className="absolute"
      style={{ top: '55%', right: '18%', opacity: 0.25 }}
      animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="w-12 h-12 rounded-full"
        style={{ background: 'radial-gradient(circle at 40% 35%, #F4A460, #B8860B, #4a3000)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-24 h-3 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(244, 164, 96, 0.5), rgba(218, 165, 32, 0.3), rgba(244, 164, 96, 0.5), transparent)',
          transform: 'translate(-50%, -50%) rotate(-20deg)',
        }}
      />
    </motion.div>

    {/* Earth-like planet */}
    <motion.div
      className="absolute w-8 h-8 rounded-full"
      style={{
        background: 'radial-gradient(circle at 40% 35%, #4169E1, #1a6b3a, #0a2e5e)',
        boxShadow: '0 0 20px rgba(65, 105, 225, 0.2), inset -3px -3px 8px rgba(0,0,0,0.5)',
        top: '35%',
        left: '75%',
        opacity: 0.4,
      }}
      animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Cosmic dust particles */}
    {Array.from({ length: 30 }, (_, i) => (
      <motion.div
        key={`dust-${i}`}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          background: ['#ff6b6b', '#a78bfa', '#60a5fa', '#f472b6', '#c084fc', '#fb923c'][i % 6],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -(15 + Math.random() * 35), 0],
          x: [0, (Math.random() - 0.5) * 50, 0],
          opacity: [0.05, 0.45, 0.05],
          scale: [0.7, 1.6, 0.7],
        }}
        transition={{
          duration: 6 + Math.random() * 14,
          repeat: Infinity,
          delay: Math.random() * 10,
          ease: 'easeInOut',
        }}
      />
    ))}

    {/* Star twinkle field */}
    {Array.from({ length: 40 }, (_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 0.5,
          height: Math.random() * 2 + 0.5,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.2, 0.8] }}
        transition={{
          duration: 2 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: 'easeInOut',
        }}
      />
    ))}
  </>
);

// ===== NATURE THEME (Light Mode) =====
const NatureTheme = () => (
  <>
    {/* Video background layer */}
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-15"
      src={natureVideo}
    />

    {/* Sun glow */}
    <motion.div
      className="absolute w-[700px] h-[700px] -top-[250px] -right-[250px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255, 200, 50, 0.18) 0%, rgba(255, 160, 50, 0.1) 30%, rgba(255, 120, 50, 0.04) 50%, transparent 65%)',
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.9, 0.7] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Secondary sun halo */}
    <motion.div
      className="absolute w-[500px] h-[500px] -top-[150px] -right-[150px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255, 220, 100, 0.08) 0%, transparent 60%)',
      }}
      animate={{ scale: [1.1, 1, 1.1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />

    {/* Aurora waves */}
    {[
      { color: 'rgba(34, 197, 94, 0.05)', top: '15%', dur: 18 },
      { color: 'rgba(59, 130, 246, 0.04)', top: '30%', dur: 22 },
      { color: 'rgba(168, 85, 247, 0.03)', top: '45%', dur: 26 },
      { color: 'rgba(251, 191, 36, 0.04)', top: '60%', dur: 20 },
    ].map((a, i) => (
      <motion.div
        key={`aurora-${i}`}
        className="absolute w-[250%] h-[35%]"
        style={{
          top: a.top,
          left: '-75%',
          background: `linear-gradient(90deg, transparent 0%, ${a.color} 30%, ${a.color} 70%, transparent 100%)`,
          filter: 'blur(50px)',
        }}
        animate={{
          x: ['-15%', '15%', '-15%'],
          scaleY: [1, 1.4, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: a.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
      />
    ))}

    {/* Drifting clouds */}
    {[
      { w: 280, h: 70, top: '8%', left: '5%', dur: 40, opacity: 0.25 },
      { w: 350, h: 80, top: '22%', left: '40%', dur: 50, opacity: 0.2 },
      { w: 220, h: 55, top: '38%', left: '15%', dur: 35, opacity: 0.18 },
      { w: 300, h: 65, top: '65%', left: '55%', dur: 45, opacity: 0.15 },
      { w: 180, h: 45, top: '80%', left: '30%', dur: 38, opacity: 0.2 },
    ].map((c, i) => (
      <motion.div
        key={`cloud-${i}`}
        className="absolute rounded-full"
        style={{
          width: c.w,
          height: c.h,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          top: c.top,
          left: c.left,
          filter: 'blur(25px)',
          opacity: c.opacity,
        }}
        animate={{ x: [0, 120 + i * 20, 0], opacity: [c.opacity, c.opacity * 1.5, c.opacity] }}
        transition={{ duration: c.dur, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}

    {/* Sunbeams */}
    {Array.from({ length: 6 }, (_, i) => (
      <motion.div
        key={`beam-${i}`}
        className="absolute origin-top-right"
        style={{
          top: 0,
          right: 0,
          width: '3px',
          height: '120vh',
          background: 'linear-gradient(to bottom, rgba(255, 200, 50, 0.1), rgba(255, 200, 50, 0.02), transparent)',
          transform: `rotate(${-25 + i * 9}deg)`,
        }}
        animate={{ opacity: [0.2, 0.6, 0.2], scaleX: [1, 1.5, 1] }}
        transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
      />
    ))}

    {/* Fireflies */}
    {Array.from({ length: 30 }, (_, i) => (
      <motion.div
        key={`firefly-${i}`}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          background: i % 3 === 0 ? 'rgba(250, 204, 21, 0.7)' : i % 3 === 1 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(251, 146, 60, 0.5)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          boxShadow: i % 3 === 0
            ? '0 0 8px 3px rgba(250, 204, 21, 0.3)'
            : i % 3 === 1
              ? '0 0 8px 3px rgba(74, 222, 128, 0.25)'
              : '0 0 8px 3px rgba(251, 146, 60, 0.2)',
        }}
        animate={{
          y: [0, -(25 + Math.random() * 50), 0],
          x: [0, (Math.random() - 0.5) * 70, 0],
          opacity: [0, 0.9, 0],
          scale: [0.4, 1.3, 0.4],
        }}
        transition={{
          duration: 5 + Math.random() * 9,
          repeat: Infinity,
          delay: Math.random() * 8,
          ease: 'easeInOut',
        }}
      />
    ))}

    {/* Floating leaves */}
    {Array.from({ length: 8 }, (_, i) => (
      <motion.div
        key={`leaf-${i}`}
        className="absolute"
        style={{
          width: 8 + Math.random() * 8,
          height: 4 + Math.random() * 4,
          borderRadius: '50% 0 50% 0',
          background: ['rgba(34, 197, 94, 0.3)', 'rgba(22, 163, 74, 0.25)', 'rgba(132, 204, 22, 0.3)', 'rgba(101, 163, 13, 0.25)'][i % 4],
          left: `${Math.random() * 100}%`,
          top: `${-5 + Math.random() * 20}%`,
        }}
        animate={{
          y: [0, window.innerHeight * 1.2],
          x: [0, (Math.random() - 0.5) * 200],
          rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          opacity: [0.4, 0.6, 0],
        }}
        transition={{
          duration: 15 + Math.random() * 20,
          repeat: Infinity,
          delay: Math.random() * 15,
          ease: 'linear',
        }}
      />
    ))}

    {/* Warm gradient overlay */}
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at 70% 20%, rgba(255, 180, 50, 0.06) 0%, transparent 50%)',
      }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
  </>
);

const AnimatedBackground = () => {
  const isDark = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {isDark ? <SpaceTheme /> : <NatureTheme />}
    </div>
  );
};

export default AnimatedBackground;
