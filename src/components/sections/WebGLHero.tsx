import { Suspense, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMousePosition } from '@/hooks/useMousePosition';
import ScrollIndicator from '@/components/ScrollIndicator';
import heroMountain from '@/assets/hero-mountain.jpg';

gsap.registerPlugin(ScrollTrigger);

// Enhanced vertex shader
const vertexShader = `
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  uniform vec2 uMouse;
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Create wave distortion based on mouse
    float dist = distance(uv, uMouse);
    float wave = sin(dist * 15.0 - uTime * 2.0) * 0.02 * smoothstep(0.5, 0.0, dist);
    pos.z += wave;
    
    vWave = wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Enhanced fragment shader with liquid distortion
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHoverStrength;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    float dist = distance(uv, uMouse);
    
    // Liquid distortion effect
    float strength = uHoverStrength * smoothstep(0.4, 0.0, dist);
    
    // Multiple wave layers for organic liquid feel
    float wave1 = sin(dist * 20.0 - uTime * 2.5) * 0.015;
    float wave2 = sin(dist * 15.0 - uTime * 1.8 + 1.0) * 0.01;
    float wave3 = cos(dist * 25.0 - uTime * 3.0) * 0.008;
    
    float totalWave = (wave1 + wave2 + wave3) * strength;
    
    // Direction from mouse
    vec2 dir = normalize(uv - uMouse + 0.001);
    
    // Apply distortion
    vec2 distortedUv = uv + dir * totalWave + dir * strength * 0.03;
    
    // Sample with chromatic aberration
    float r = texture2D(uTexture, distortedUv + dir * strength * 0.008).r;
    float g = texture2D(uTexture, distortedUv).g;
    float b = texture2D(uTexture, distortedUv - dir * strength * 0.008).b;
    
    vec4 color = vec4(r, g, b, 1.0);
    
    // Add subtle vignette
    float vignette = 1.0 - smoothstep(0.4, 1.0, distance(vUv, vec2(0.5)));
    color.rgb *= 0.8 + vignette * 0.2;
    
    // Add slight blue tint in distorted areas
    color.b += strength * 0.1;
    
    gl_FragColor = color;
  }
`;

const DistortionMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePosition = useMousePosition();
  const { viewport } = useThree();
  
  const texture = useTexture(heroMountain);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  const uniforms = useRef({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
    uHoverStrength: { value: 0.6 },
  });

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth mouse lerp
      const targetX = mousePosition.normalizedX;
      const targetY = 1 - mousePosition.normalizedY;
      
      material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.05;
    }
  });

  // Cover viewport
  const imageAspect = 16 / 9;
  const viewportAspect = viewport.width / viewport.height;
  
  const scale: [number, number, number] = imageAspect > viewportAspect 
    ? [viewport.height * imageAspect * 1.2, viewport.height * 1.2, 1]
    : [viewport.width * 1.2, (viewport.width / imageAspect) * 1.2, 1];

  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

const WebGLHero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    // Pin the hero and animate content on scroll
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        gsap.to(content, {
          y: -progress * 100,
          opacity: 1 - progress,
          scale: 1 + progress * 0.1,
          duration: 0,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-screen overflow-hidden"
    >
      {/* WebGL Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <DistortionMesh />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, 
            hsl(205 52% 15% / 0.3) 0%, 
            hsl(205 52% 20% / 0.4) 50%, 
            hsl(205 52% 15% / 0.5) 100%)`,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        {/* Name split animation */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-2"
        >
          <h1 className="hero-title-large text-5xl md:text-7xl lg:text-9xl text-primary-foreground">
            P R A B H A T
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <h1 className="hero-title-large text-5xl md:text-7xl lg:text-9xl text-primary-foreground">
            K U M A R
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <p className="font-body text-sm md:text-base tracking-[0.3em] text-primary-foreground/80 uppercase">
            Java Software Developer • AI & Web Enthusiast
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <p className="font-display text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
            I blend the art of code with the science of AI to build innovative,
            high-performance software solutions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#projects"
            className="btn-montfort text-primary-foreground border-primary-foreground/50 hover:border-primary-foreground"
            data-cursor-hover
          >
            <span>View My Work</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
          <a
            href="https://prabhat-codes.vercel.app/Prabhat%20Experience%20Profile.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-montfort text-primary-foreground border-primary-foreground/30"
            data-cursor-hover
          >
            <span>Download CV</span>
            <span>↓</span>
          </a>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default WebGLHero;
