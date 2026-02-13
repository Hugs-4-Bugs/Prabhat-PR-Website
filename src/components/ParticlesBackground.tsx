import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};

// ===== SPACE PARTICLES (Dark Mode) =====
const CosmicParticles = ({ count = 250 }) => {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const colorPalette = [
      [0.4, 0.5, 1.0],   // blue
      [0.7, 0.3, 0.9],   // purple
      [1.0, 0.3, 0.4],   // red
      [0.9, 0.5, 0.2],   // orange
      [0.5, 0.8, 1.0],   // cyan
      [1.0, 0.4, 0.7],   // pink
    ];

    for (let i = 0; i < count; i++) {
      // Distribute in a galaxy-like spiral
      const angle = (i / count) * Math.PI * 8;
      const radius = Math.random() * 12 + 1;
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 4 - 5;
      speeds[i] = Math.random() * 0.4 + 0.15;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { positions, colors, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time * particles.speeds[i] + i) * 0.003;
      positions[i3] += Math.cos(time * particles.speeds[i] * 0.4 + i * 0.5) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.015;
    mesh.current.rotation.x = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Nebula cloud meshes for space
const NebulaClouds = () => {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(
    () => [
      { pos: [-5, 3, -6] as [number, number, number], scale: 2, color: '#8b0030' },
      { pos: [6, -2, -7] as [number, number, number], scale: 2.5, color: '#4b0082' },
      { pos: [-4, -4, -5] as [number, number, number], scale: 1.8, color: '#002060' },
      { pos: [4, 5, -8] as [number, number, number], scale: 3, color: '#6b0050' },
      { pos: [0, 0, -9] as [number, number, number], scale: 3.5, color: '#1a0040' },
      { pos: [-6, 2, -7] as [number, number, number], scale: 1.5, color: '#600020' },
      { pos: [5, -5, -6] as [number, number, number], scale: 2.2, color: '#200060' },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.x = clouds[i].pos[0] + Math.sin(time * 0.15 + i) * 0.8;
      child.position.y = clouds[i].pos[1] + Math.cos(time * 0.2 + i) * 0.5;
      child.rotation.z = Math.sin(time * 0.08 + i) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color={c.color} transparent opacity={0.06} wireframe />
        </mesh>
      ))}
    </group>
  );
};

// Glowing orbs for space depth
const CosmicOrbs = () => {
  const orbsRef = useRef<THREE.Group>(null);
  const orbs = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        position: [(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10 - 5] as [number, number, number],
        scale: Math.random() * 0.35 + 0.1,
        speed: Math.random() * 0.4 + 0.15,
        color: ['#6366f1', '#ec4899', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#06b6d4', '#a855f7', '#f43f5e', '#7c3aed'][i],
      })),
    []
  );

  useFrame((state) => {
    if (!orbsRef.current) return;
    const time = state.clock.elapsedTime;
    orbsRef.current.children.forEach((orb, i) => {
      const d = orbs[i];
      orb.position.y = d.position[1] + Math.sin(time * d.speed + i) * 2.5;
      orb.position.x = d.position[0] + Math.cos(time * d.speed * 0.4 + i) * 1.5;
    });
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
};

// ===== NATURE PARTICLES (Light Mode) =====
const NatureParticles = ({ count = 120 }) => {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const colorPalette = [
      [0.98, 0.8, 0.08],  // golden
      [0.29, 0.77, 0.37],  // green
      [0.96, 0.65, 0.14],  // amber
      [0.56, 0.87, 0.09],  // lime
      [0.98, 0.57, 0.24],  // orange
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
      speeds[i] = Math.random() * 0.3 + 0.1;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    return { positions, colors, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle upward drift like pollen
      positions[i3 + 1] += Math.sin(time * particles.speeds[i] + i) * 0.004 + 0.001;
      positions[i3] += Math.cos(time * particles.speeds[i] * 0.3 + i) * 0.002;
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.008;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.5} sizeAttenuation blending={THREE.NormalBlending} />
    </points>
  );
};

// Nature cloud shapes
const NatureClouds = () => {
  const groupRef = useRef<THREE.Group>(null);
  const clouds = useMemo(
    () => [
      { pos: [-4, 4, -5] as [number, number, number], scale: 2, color: '#ffffff' },
      { pos: [5, 3, -6] as [number, number, number], scale: 2.5, color: '#f0f0f0' },
      { pos: [-3, -2, -4] as [number, number, number], scale: 1.5, color: '#e8e8e8' },
      { pos: [3, -4, -5] as [number, number, number], scale: 1.8, color: '#f5f5f5' },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.x = clouds[i].pos[0] + Math.sin(time * 0.1 + i * 2) * 1.2;
      child.position.y = clouds[i].pos[1] + Math.cos(time * 0.08 + i) * 0.4;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={c.color} transparent opacity={0.04} />
        </mesh>
      ))}
    </group>
  );
};

// Nature glowing orbs (warm tones)
const NatureOrbs = () => {
  const orbsRef = useRef<THREE.Group>(null);
  const orbs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        position: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 6 - 4] as [number, number, number],
        scale: Math.random() * 0.25 + 0.1,
        speed: Math.random() * 0.3 + 0.1,
        color: ['#facc15', '#4ade80', '#fb923c', '#a3e635', '#34d399', '#fbbf24'][i],
      })),
    []
  );

  useFrame((state) => {
    if (!orbsRef.current) return;
    const time = state.clock.elapsedTime;
    orbsRef.current.children.forEach((orb, i) => {
      const d = orbs[i];
      orb.position.y = d.position[1] + Math.sin(time * d.speed + i) * 1.5;
      orb.position.x = d.position[0] + Math.cos(time * d.speed * 0.5 + i) * 1;
    });
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// CSS fallback
const CSSParticlesFallback = ({ isDark }: { isDark: boolean }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
        color: isDark
          ? ['rgba(99,102,241,0.3)', 'rgba(236,72,153,0.3)', 'rgba(59,130,246,0.3)', 'rgba(168,85,247,0.3)'][i % 4]
          : ['rgba(250,204,21,0.3)', 'rgba(74,222,128,0.3)', 'rgba(251,146,60,0.3)', 'rgba(163,230,53,0.3)'][i % 4],
      })),
    [isDark]
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

const ParticlesBackground = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  if (!webGLSupported) {
    return <CSSParticlesFallback isDark={isDark} />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          if (!gl.getContext()) setWebGLSupported(false);
        }}
        fallback={<CSSParticlesFallback isDark={isDark} />}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.3 : 0.6} />
          {isDark ? (
            <>
              <CosmicParticles count={250} />
              <NebulaClouds />
              <CosmicOrbs />
            </>
          ) : (
            <>
              <NatureParticles count={120} />
              <NatureClouds />
              <NatureOrbs />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticlesBackground;
