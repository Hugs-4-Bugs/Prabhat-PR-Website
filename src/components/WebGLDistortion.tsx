import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';

// Vertex shader for distortion
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader with liquid distortion
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uStrength;
  uniform float uRadius;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from mouse
    vec2 mousePos = uMouse;
    float dist = distance(uv, mousePos);
    
    // Create liquid distortion based on mouse proximity
    float strength = uStrength * smoothstep(uRadius, 0.0, dist);
    
    // Ripple effect
    float ripple = sin(dist * 20.0 - uTime * 3.0) * strength * 0.03;
    
    // Displacement direction (away from mouse)
    vec2 dir = normalize(uv - mousePos);
    
    // Apply distortion
    vec2 distortedUv = uv + dir * ripple + dir * strength * 0.05;
    
    // Sample texture with distorted UVs
    vec4 color = texture2D(uTexture, distortedUv);
    
    // Add subtle chromatic aberration
    float r = texture2D(uTexture, distortedUv + dir * strength * 0.01).r;
    float b = texture2D(uTexture, distortedUv - dir * strength * 0.01).b;
    
    color.r = r;
    color.b = b;
    
    gl_FragColor = color;
  }
`;

interface DistortionPlaneProps {
  imageUrl: string;
}

const DistortionPlane = ({ imageUrl }: DistortionPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePosition = useMousePosition();
  const { viewport, size } = useThree();
  
  const texture = useTexture(imageUrl);
  
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
    uStrength: { value: 0.5 },
    uRadius: { value: 0.4 },
  }), [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smooth mouse position
      const targetX = mousePosition.normalizedX;
      const targetY = 1 - mousePosition.normalizedY;
      
      material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.1;
      material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.1;
    }
  });

  // Calculate aspect ratio to cover viewport
  const img = texture.image as HTMLImageElement | undefined;
  const imageAspect = img?.width && img?.height ? img.width / img.height : 16 / 9;
  const viewportAspect = viewport.width / viewport.height;
  
  const scale: [number, number, number] = imageAspect > viewportAspect 
    ? [viewport.height * imageAspect, viewport.height, 1]
    : [viewport.width, viewport.width / imageAspect, 1];

  return (
    <mesh ref={meshRef} scale={scale as [number, number, number]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface WebGLDistortionProps {
  imageUrl: string;
  className?: string;
}

const WebGLDistortion = ({ imageUrl, className = '' }: WebGLDistortionProps) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <DistortionPlane imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
};

export default WebGLDistortion;
