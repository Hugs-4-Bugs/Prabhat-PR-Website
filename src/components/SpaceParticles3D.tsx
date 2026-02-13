import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch { return false; }
};

// Orbiting planet-like orbs
const CosmicOrbs = () => {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      radius: 3 + i * 1.5,
      speed: 0.15 - i * 0.02,
      size: 0.08 + Math.random() * 0.15,
      color: new THREE.Color().setHSL(
        [0.97, 0.78, 0.6, 0.08, 0.55, 0.12][i],
        0.6 + Math.random() * 0.3,
        0.4 + Math.random() * 0.3
      ),
      yOffset: (Math.random() - 0.5) * 4,
      phase: Math.random() * Math.PI * 2,
    }))
  , []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.03;

    groupRef.current.children.forEach((child, i) => {
      const orb = orbs[i];
      if (!orb) return;
      child.position.x = Math.cos(t * orb.speed + orb.phase) * orb.radius;
      child.position.z = Math.sin(t * orb.speed + orb.phase) * orb.radius;
      child.position.y = orb.yOffset + Math.sin(t * 0.3 + i) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={[orb.radius, orb.yOffset, 0]}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// Ring system around center
const CosmicRings = () => {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    ringRef.current.rotation.x = Math.PI * 0.35 + Math.sin(t * 0.1) * 0.05;
    ringRef.current.rotation.z = t * 0.02;
  });

  return (
    <group ref={ringRef}>
      {[3, 5, 7].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(0.97 - i * 0.15, 0.5, 0.35)}
            transparent
            opacity={0.15 - i * 0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Nebula dust particles
const NebulaParticles = ({ count = 400 }) => {
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 12;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const hue = Math.random() > 0.5 ? 0.97 + Math.random() * 0.03 : 0.6 + Math.random() * 0.2;
      const col = new THREE.Color().setHSL(hue % 1, 0.6, 0.5 + Math.random() * 0.3);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { pos, colors };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// CSS Fallback
const CSSFallback = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 50 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `hsl(${Math.random() > 0.5 ? 350 : 220} ${60 + Math.random() * 30}% ${50 + Math.random() * 30}%)`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 6,
          delay: Math.random() * 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

const SpaceParticles3D = () => {
  const [webGL, setWebGL] = useState(true);
  useEffect(() => { setWebGL(isWebGLAvailable()); }, []);

  if (!webGL) return <CSSFallback />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        fallback={<CSSFallback />}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <NebulaParticles count={300} />
          <CosmicOrbs />
          <CosmicRings />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SpaceParticles3D;
