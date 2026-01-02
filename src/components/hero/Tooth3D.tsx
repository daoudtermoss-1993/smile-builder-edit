import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export function Tooth3D() {
  const toothRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Create tooth shape using lathe geometry for realistic molar shape
  const toothShape = useMemo(() => {
    const points: THREE.Vector2[] = [];
    
    // Root base
    points.push(new THREE.Vector2(0, -1.5));
    points.push(new THREE.Vector2(0.15, -1.4));
    points.push(new THREE.Vector2(0.2, -1.2));
    points.push(new THREE.Vector2(0.25, -1.0));
    points.push(new THREE.Vector2(0.3, -0.8));
    
    // Neck (CEJ - cementoenamel junction)
    points.push(new THREE.Vector2(0.35, -0.5));
    points.push(new THREE.Vector2(0.4, -0.3));
    
    // Crown bulge
    points.push(new THREE.Vector2(0.55, 0));
    points.push(new THREE.Vector2(0.65, 0.3));
    points.push(new THREE.Vector2(0.7, 0.5));
    points.push(new THREE.Vector2(0.68, 0.7));
    
    // Crown top (occlusal surface)
    points.push(new THREE.Vector2(0.6, 0.85));
    points.push(new THREE.Vector2(0.45, 0.95));
    points.push(new THREE.Vector2(0.25, 1.0));
    points.push(new THREE.Vector2(0, 1.02));
    
    return points;
  }, []);

  useFrame((state) => {
    if (toothRef.current) {
      // Smooth rotation
      toothRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      // Gentle floating motion
      toothRef.current.position.y = (isMobile ? 1.5 : 0) + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Mobile: very small scale, positioned higher
  const scale = isMobile ? 0.5 : 1.8;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={toothRef} scale={scale} position={[0, isMobile ? 0.8 : 0, 0]}>
        {/* Main tooth body */}
        <mesh>
          <latheGeometry args={[toothShape, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.95}
            roughness={0.05}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.2}
            temporalDistortion={0.1}
            color="#e0f7f7"
          />
        </mesh>
        
        {/* Inner glow core */}
        <mesh scale={0.85}>
          <latheGeometry args={[toothShape, 32]} />
          <meshStandardMaterial
            color="#00b3b3"
            emissive="#00b3b3"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Sparkle particles around tooth */}
        <Sparkles />
      </group>
    </Float>
  );
}

function Sparkles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 0.8;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
