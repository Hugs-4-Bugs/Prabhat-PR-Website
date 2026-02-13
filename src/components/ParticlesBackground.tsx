import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Check if WebGL is available
const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

// Floating particles
const Particles = ({ count = 200 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = Math.random() * 0.5 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    
    return { positions, scales, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time * particles.speeds[i] + i) * 0.002;
      positions[i3] += Math.cos(time * particles.speeds[i] * 0.5 + i) * 0.001;
      
      // Reset if out of bounds
      if (positions[i3 + 1] > 10) positions[i3 + 1] = -10;
      if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Cloud-like volumetric shapes
const Cloud = ({ position, scale }: { position: [number, number, number]; scale: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    meshRef.current.position.x = position[0] + Math.sin(time * 0.2) * 0.5;
    meshRef.current.position.y = position[1] + Math.cos(time * 0.3) * 0.3;
    meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#4488aa"
        transparent
        opacity={0.08}
        wireframe
      />
    </mesh>
  );
};

// Multiple clouds
const Clouds = () => {
  const clouds = useMemo(() => [
    { position: [-4, 3, -3] as [number, number, number], scale: 1.5 },
    { position: [5, -2, -4] as [number, number, number], scale: 2 },
    { position: [-3, -3, -2] as [number, number, number], scale: 1.2 },
    { position: [4, 4, -5] as [number, number, number], scale: 1.8 },
    { position: [0, 0, -6] as [number, number, number], scale: 2.5 },
    { position: [-5, 1, -4] as [number, number, number], scale: 1.3 },
    { position: [3, -4, -3] as [number, number, number], scale: 1.6 },
  ], []);

  return (
    <>
      {clouds.map((cloud, index) => (
        <Cloud key={index} {...cloud} />
      ))}
    </>
  );
};

// Glowing orbs for depth
const GlowOrbs = () => {
  const orbsRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8 - 5,
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
    }))
  , []);

  useFrame((state) => {
    if (!orbsRef.current) return;
    const time = state.clock.elapsedTime;
    
    orbsRef.current.children.forEach((orb, index) => {
      const data = orbs[index];
      orb.position.y = data.position[1] + Math.sin(time * data.speed + index) * 2;
      orb.position.x = data.position[0] + Math.cos(time * data.speed * 0.5 + index) * 1;
    });
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, index) => (
        <mesh key={index} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? '#66aadd' : '#44ddaa'}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
};

// CSS fallback particles
const CSSParticlesFallback = () => {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }))
  , []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const ParticlesBackground = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  if (!webGLSupported) {
    return <CSSParticlesFallback />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          if (!gl.getContext()) {
            setWebGLSupported(false);
          }
        }}
        fallback={<CSSParticlesFallback />}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Particles count={150} />
          <Clouds />
          <GlowOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ParticlesBackground;
