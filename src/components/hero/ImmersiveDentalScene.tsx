import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  MeshTransmissionMaterial,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';

// Hook to get scroll progress
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / docHeight, 1);
      setProgress(scrollProgress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return progress;
}

// Scroll-controlled camera component
function CinematicCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3(0, 2, 8));
  
  useFrame(() => {
    const t = scrollProgress;
    
    // Cinematic camera path - 360° rotation around the tooth
    const radius = 8 - t * 2; // Start far, come closer
    const angle = t * Math.PI * 2.5; // More than full rotation
    const height = 2 + Math.sin(t * Math.PI * 2) * 2; // Wave up and down
    
    targetPosition.current.set(
      Math.sin(angle) * radius,
      height,
      Math.cos(angle) * radius
    );
    
    // Smooth interpolation
    currentPosition.current.lerp(targetPosition.current, 0.05);
    camera.position.copy(currentPosition.current);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Premium 3D Tooth with glass material
function PremiumTooth() {
  const toothRef = useRef<THREE.Group>(null);
  
  const toothShape = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0.05, -1.2));
    points.push(new THREE.Vector2(0.15, -1.0));
    points.push(new THREE.Vector2(0.2, -0.8));
    points.push(new THREE.Vector2(0.35, -0.5));
    points.push(new THREE.Vector2(0.5, -0.2));
    points.push(new THREE.Vector2(0.7, 0));
    points.push(new THREE.Vector2(0.8, 0.2));
    points.push(new THREE.Vector2(0.85, 0.4));
    points.push(new THREE.Vector2(0.8, 0.6));
    points.push(new THREE.Vector2(0.7, 0.75));
    points.push(new THREE.Vector2(0.5, 0.85));
    points.push(new THREE.Vector2(0.3, 0.9));
    points.push(new THREE.Vector2(0.1, 0.88));
    points.push(new THREE.Vector2(0, 0.85));
    return points;
  }, []);

  useFrame((state) => {
    if (toothRef.current) {
      toothRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      toothRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={toothRef} scale={1.5}>
        {/* Main tooth - glass material */}
        <mesh>
          <latheGeometry args={[toothShape, 48]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.6}
            chromaticAberration={0.15}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.2}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={[100, 400]}
            color="#e8f8f8"
            transmission={0.95}
            roughness={0.05}
            ior={1.5}
          />
        </mesh>
        
        {/* Inner glow */}
        <mesh scale={0.8}>
          <latheGeometry args={[toothShape, 32]} />
          <meshStandardMaterial
            color="#00e5e5"
            emissive="#00b3b3"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Orbiting dental elements
function OrbitingElements({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3 + scrollProgress * Math.PI * 4;
    }
  });

  const createDentalTool = (position: [number, number, number], rotation: [number, number, number], color: string) => (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        {/* Handle */}
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 16]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tip */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );

  return (
    <group ref={groupRef}>
      {createDentalTool([3.5, 0.5, 0], [0, 0, 0.3], '#00b3b3')}
      {createDentalTool([-3.5, -0.5, 1], [0.5, 0, -0.3], '#00d4d4')}
      {createDentalTool([0, 1, -3.5], [-0.3, 0, 0], '#009999')}
      
      {/* Floating toothbrush */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <group position={[2.5, -1.5, -2]} rotation={[0.5, 0.3, 0.2]}>
          <mesh>
            <boxGeometry args={[0.2, 1, 0.1]} />
            <meshStandardMaterial color="#00b3b3" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.18, 0.4, 0.08]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </Float>

      {/* Floating dental floss */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh position={[-2.5, 1, 2]} rotation={[0.2, 0.5, 0]}>
          <torusGeometry args={[0.3, 0.08, 16, 32]} />
          <meshStandardMaterial color="#00d4d4" metalness={0.3} roughness={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// Sparkle particles
function Sparkles({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const radius = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (radius * Math.sin(phi) * Math.sin(theta)) - 1;
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02 + scrollProgress * 2;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00ffff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Scene content
function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <CinematicCamera scrollProgress={scrollProgress} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00d4d4" />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 5, 0]} intensity={2} color="#00ffff" />
      <pointLight position={[0, -3, 3]} intensity={0.8} color="#004d4d" />
      <spotLight position={[-3, 3, 3]} intensity={1} angle={0.4} penumbra={1} color="#00e5e5" />
      
      {/* Main tooth */}
      <PremiumTooth />
      
      {/* Orbiting elements */}
      <OrbitingElements scrollProgress={scrollProgress} />
      
      {/* Particles */}
      <Sparkles scrollProgress={scrollProgress} />
      
      {/* Background stars */}
      <Stars
        radius={60}
        depth={60}
        count={800}
        factor={3}
        saturation={0.5}
        fade
        speed={0.3}
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Fog */}
      <fog attach="fog" args={['#051515', 15, 60]} />
    </>
  );
}

export function ImmersiveDentalScene() {
  const [isMounted, setIsMounted] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        opacity: 0.85,
      }}
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ 
          background: 'linear-gradient(180deg, #051818 0%, #072525 30%, #041515 70%, #020a0a 100%)' 
        }}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
