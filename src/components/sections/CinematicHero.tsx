import { Suspense, useRef, useEffect, useState, useMemo, useCallback, Component, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHandTracking, HandState } from '@/hooks/useHandTracking';
import { PARTICLE_COUNT, SHAPES, generateShapePositions } from '@/lib/particleShapes';
import ScrollIndicator from '@/components/ScrollIndicator';
import { Hand, CameraOff, Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ── WebGL detection ──
const isWebGLAvailable = (): boolean => {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return false;
    // Verify context is actually functional (not sandboxed/disabled)
    const shader = (gl as WebGLRenderingContext).createShader((gl as WebGLRenderingContext).VERTEX_SHADER);
    if (!shader) return false;
    (gl as WebGLRenderingContext).deleteShader(shader);
    return true;
  } catch { return false; }
};

// ── Error boundary to catch Canvas crashes ──
class CanvasErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: Error) { console.warn('Canvas error caught:', err.message); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

// ── Shaders ──
const vertexShader = `
  attribute vec3 aTarget;
  attribute float aSize;
  attribute vec3 aRandom;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uHandPos;
  uniform float uHandInfluence;
  uniform float uExpansion;
  uniform float uBurst;
  varying float vAlpha;
  varying float vDist;
  void main() {
    vec3 pos = mix(position, aTarget, smoothstep(0.0, 1.0, uProgress));
    pos += sin(pos.yzx * 1.5 + uTime * 0.4) * 0.04 * aRandom;
    if (uBurst > 0.0) {
      vec3 burstDir = normalize(pos + aRandom * 0.1);
      pos += burstDir * uBurst * 2.0 * (0.5 + aRandom.x * 0.5);
    }
    if (uHandInfluence > 0.01) {
      vec3 handDir = pos - uHandPos;
      float handDist = length(handDir);
      float force = uHandInfluence * smoothstep(4.0, 0.0, handDist);
      pos += normalize(handDir + vec3(0.001)) * force * uExpansion;
    }
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize * (180.0 / -mvPos.z) * (1.0 + uBurst * 0.5);
    vAlpha = smoothstep(25.0, 3.0, -mvPos.z);
    vDist = length(pos);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  uniform float uBurst;
  varying float vAlpha;
  varying float vDist;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d) * vAlpha * 0.85;
    vec3 color = mix(uColor1, uColor2, gl_PointCoord.y + sin(uTime * 0.5) * 0.2);
    color += vec3(0.3, 0.2, 0.4) * exp(-d * 6.0);
    color += vec3(1.0) * uBurst * 0.3 * exp(-d * 4.0);
    color = mix(color, color * 1.3, smoothstep(4.0, 0.0, vDist));
    gl_FragColor = vec4(color, alpha);
  }
`;

// ── Three.js Particle System (only used inside Canvas) ──
interface ParticleSystemProps {
  shapeIndex: number;
  handState: HandState;
  burst: number;
}

// Lazy-loaded R3F component to avoid importing Canvas at module level
let R3FCanvas: any = null;
let useFrame: any = null;

const loadR3F = async () => {
  if (R3FCanvas) return;
  const fiber = await import('@react-three/fiber');
  R3FCanvas = fiber.Canvas;
  useFrame = fiber.useFrame;
};

const ParticleSystemInner = ({ shapeIndex, handState, burst, useFrameHook }: ParticleSystemProps & { useFrameHook: any }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const morphProgress = useRef(1.0);

  const shapesData = useMemo(() => SHAPES.map((_, i) => generateShapePositions(i)), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const init = shapesData[0];
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(init), 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(new Float32Array(init), 3));
    const sizes = new Float32Array(PARTICLE_COUNT);
    const randoms = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = 0.4 + Math.random() * 1.8;
      randoms[i * 3] = Math.random() * 2 - 1;
      randoms[i * 3 + 1] = Math.random() * 2 - 1;
      randoms[i * 3 + 2] = Math.random() * 2 - 1;
    }
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    return geo;
  }, [shapesData]);

  const material = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 1.0 },
        uColor1: { value: new THREE.Color(...SHAPES[0].color1) },
        uColor2: { value: new THREE.Color(...SHAPES[0].color2) },
        uHandPos: { value: new THREE.Vector3(0, 0, 0) },
        uHandInfluence: { value: 0 },
        uExpansion: { value: 0.3 },
        uBurst: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    []
  );

  useEffect(() => {
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const targetAttr = geometry.getAttribute('aTarget') as THREE.BufferAttribute;
    const tArr = targetAttr.array as Float32Array;
    const pArr = posAttr.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) pArr[i] = tArr[i];
    posAttr.needsUpdate = true;
    const newShape = shapesData[shapeIndex];
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) tArr[i] = newShape[i];
    targetAttr.needsUpdate = true;
    morphProgress.current = 0;
  }, [shapeIndex, shapesData, geometry]);

  useFrameHook((state: any) => {
    const u = material.uniforms;
    const t = state.clock.elapsedTime;
    u.uTime.value = t;
    if (morphProgress.current < 1) morphProgress.current = Math.min(1, morphProgress.current + 0.006);
    u.uProgress.value = morphProgress.current;
    u.uBurst.value *= 0.95;
    if (burst > 0) u.uBurst.value = burst;
    if (handState.position && handState.isTracking) {
      const hp = u.uHandPos.value;
      hp.x += ((handState.position.x - 0.5) * 8 - hp.x) * 0.08;
      hp.y += ((0.5 - handState.position.y) * 6 - hp.y) * 0.08;
      u.uHandInfluence.value += (1 - u.uHandInfluence.value) * 0.05;
      u.uExpansion.value = handState.isOpen ? 1.8 : handState.isPinching ? -0.8 : 0.4;
    } else {
      u.uHandInfluence.value *= 0.96;
    }
    const shape = SHAPES[shapeIndex];
    u.uColor1.value.lerp(new THREE.Color(...shape.color1), 0.015);
    u.uColor2.value.lerp(new THREE.Color(...shape.color2), 0.015);
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04;
      pointsRef.current.rotation.x = Math.sin(t * 0.025) * 0.08;
    }
  });

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  return <points ref={pointsRef} geometry={geometry} material={material} />;
};

// ── CSS Fallback Particle System ──
const CSSParticleFallback = ({ shapeIndex }: { shapeIndex: number; burst?: number }) => {
  const particles = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 8,
    })),
    []
  );

  const shape = SHAPES[shapeIndex];
  const hue1 = Math.round(shape.color1[0] * 360);
  const hue2 = Math.round(shape.color2[0] * 360);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `hsl(${p.id % 2 === 0 ? hue1 : hue2} 70% 65%)`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.05, 0.35, 0.05],
            scale: [1, 1.3, 1],
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

// ── WebGL Canvas Wrapper ──
const WebGLParticleCanvas = ({ shapeIndex, handState, burst }: ParticleSystemProps) => {
  const [CanvasComponent, setCanvasComponent] = useState<any>(null);
  const [useFrameHook, setUseFrameHook] = useState<any>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import('@react-three/fiber').then((mod) => {
      if (!cancelled) {
        setCanvasComponent(() => mod.Canvas);
        setUseFrameHook(() => mod.useFrame);
      }
    }).catch(() => { if (!cancelled) setCanvasFailed(true); });
    return () => { cancelled = true; };
  }, []);

  // Listen for WebGL context loss on the canvas element
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const handleContextLost = () => setCanvasFailed(true);
    // R3F creates a canvas child element
    const observer = new MutationObserver(() => {
      const canvas = container.querySelector('canvas');
      if (canvas) {
        canvas.addEventListener('webglcontextlost', handleContextLost);
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    // Also check if canvas already exists
    const existing = container.querySelector('canvas');
    if (existing) {
      existing.addEventListener('webglcontextlost', handleContextLost);
      observer.disconnect();
    }
    return () => { observer.disconnect(); };
  }, [CanvasComponent]);

  if (canvasFailed || !CanvasComponent || !useFrameHook) {
    return <CSSParticleFallback shapeIndex={shapeIndex} />;
  }

  return (
    <div ref={canvasContainerRef} className="w-full h-full">
      <CanvasErrorBoundary fallback={<CSSParticleFallback shapeIndex={shapeIndex} />}>
        <CanvasComponent
          camera={{ position: [0, 0, 7], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ParticleSystemInner
              shapeIndex={shapeIndex}
              handState={handState}
              burst={burst}
              useFrameHook={useFrameHook}
            />
          </Suspense>
        </CanvasComponent>
      </CanvasErrorBoundary>
    </div>
  );
};

// ── Webcam PIP ──
const WebcamPip = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
  );
};

// ── Main Hero Component ──
const CinematicHero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentShape, setCurrentShape] = useState(0);
  const [burst, setBurst] = useState(0);
  const [showText, setShowText] = useState(false);
  const [webGL, setWebGL] = useState(true);
  const { handState, isEnabled, isLoading, error, stream, startTracking, stopTracking } = useHandTracking();

  useEffect(() => { setWebGL(isWebGLAvailable()); }, []);

  useEffect(() => {
    const iv = setInterval(() => setCurrentShape((p) => (p + 1) % SHAPES.length), 12000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        gsap.to(content, { y: -self.progress * 100, opacity: 1 - self.progress, scale: 1 + self.progress * 0.1, duration: 0 });
      },
    });
    return () => trigger.kill();
  }, []);

  const handleClick = useCallback(() => {
    setBurst(1);
    setShowText(true);
    setTimeout(() => setBurst(0), 100);
    setTimeout(() => setShowText(false), 4000);
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative h-screen overflow-hidden cursor-pointer" onClick={handleClick}>
      {/* Particle background */}
      <div className="absolute inset-0">
        {webGL ? (
          <WebGLParticleCanvas shapeIndex={currentShape} handState={handState} burst={burst} />
        ) : (
          <CSSParticleFallback shapeIndex={currentShape} burst={burst} />
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 30%, hsl(var(--background) / 0.3) 100%)` }}
      />

      {/* Shape name */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentShape}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-20"
        >
          <p className="font-body text-[10px] sm:text-xs tracking-[0.4em] text-primary-foreground/40 uppercase">
            {SHAPES[currentShape].name}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {showText ? (
            <motion.div
              key="text-reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="font-display font-light text-primary-foreground tracking-[0.15em] md:tracking-[0.2em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                PRABHAT
              </h1>
              <h1 className="font-display font-light text-primary-foreground tracking-[0.15em] md:tracking-[0.2em] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                KUMAR
              </h1>
              <p className="font-body text-xs sm:text-sm tracking-[0.15em] text-primary-foreground/80 uppercase mt-6">
                Java Software Developer • AI & Web Enthusiast
              </p>
              <p className="font-display text-base sm:text-lg md:text-xl text-primary-foreground/70 leading-relaxed max-w-xl mx-auto mt-4">
                I blend the art of code with the science of AI to build innovative, high-performance software solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
                <a href="#projects" className="btn-montfort text-primary-foreground border-primary-foreground/50 hover:border-primary-foreground text-center justify-center" data-cursor-hover onClick={(e) => e.stopPropagation()}>
                  <span>View My Work</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </a>
                <a href="/resume/resume.pdf" download="Prabhat_Kumar_Resume.pdf" className="btn-montfort text-primary-foreground border-primary-foreground/30 text-center justify-center" data-cursor-hover onClick={(e) => e.stopPropagation()}>
                  <span>Download CV</span>
                  <span>↓</span>
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.h1
                className="font-display font-light text-primary-foreground/20 tracking-[0.2em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none"
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                PRABHAT KUMAR
              </motion.h1>
              <motion.p
                className="font-body text-[10px] sm:text-xs tracking-[0.2em] text-primary-foreground/30 uppercase"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                Click anywhere to reveal
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hand tracking controls */}
      <div className="absolute bottom-24 right-4 sm:right-8 z-20 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={isEnabled ? stopTracking : startTracking}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-primary-foreground/20 bg-background/30 backdrop-blur-md text-primary-foreground/70 hover:text-primary-foreground hover:border-primary-foreground/40 transition-all text-[10px] sm:text-xs tracking-wider uppercase"
        >
          {isLoading ? (
            <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Loading...</>
          ) : isEnabled ? (
            <><CameraOff className="w-3 h-3 sm:w-4 sm:h-4" /> Stop Gesture</>
          ) : (
            <><Hand className="w-3 h-3 sm:w-4 sm:h-4" /> Hand Control</>
          )}
        </button>
        {error && <p className="text-[9px] sm:text-[10px] text-destructive/80 max-w-[150px] sm:max-w-[200px]">{error}</p>}
      </div>

      {/* Webcam PIP */}
      {isEnabled && stream && (
        <div className="absolute bottom-24 left-4 sm:left-8 w-24 h-18 sm:w-32 sm:h-24 rounded-lg border border-primary-foreground/20 overflow-hidden z-20 opacity-60 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <WebcamPip stream={stream} />
          {handState.isTracking && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />}
        </div>
      )}

      {/* Gesture status */}
      {isEnabled && handState.isTracking && (
        <div className="absolute top-24 right-4 sm:right-8 z-20 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-body text-[9px] sm:text-[10px] tracking-wider text-primary-foreground/50 uppercase">
            {handState.isOpen ? 'Open Palm' : handState.isPinching ? 'Pinching' : 'Tracking'}
          </span>
        </div>
      )}

      <ScrollIndicator />
    </section>
  );
};

export default CinematicHero;
