import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

// Tooth outline points for the entry shape
const toothPoints: [number, number, number][] = [
  [0, 2.5, 0], [-0.8, 2.3, 0], [-1.2, 1.8, 0], [-1.3, 1, 0], [-1.2, 0.2, 0],
  [-1.0, -0.5, 0], [-0.8, -1.5, 0], [-0.6, -2.5, 0], [-0.3, -2.8, 0],
  [0, -2.5, 0], [0.3, -2.8, 0], [0.6, -2.5, 0], [0.8, -1.5, 0],
  [1.0, -0.5, 0], [1.2, 0.2, 0], [1.3, 1, 0], [1.2, 1.8, 0], [0.8, 2.3, 0], [0, 2.5, 0]
];

function ToothOutline({ progress, offset = 0 }: { progress: number; offset?: number }) {
  const adjustedProgress = Math.max(0, progress - offset);
  
  const points = useMemo(() => {
    return toothPoints.map(([x, y, z]) => [x * 1.5, y * 1.2, z] as [number, number, number]);
  }, []);

  const scale = 1 + adjustedProgress * 8;
  const opacity = Math.max(0, 1 - adjustedProgress * 1.5);

  if (opacity <= 0) return null;

  return (
    <group scale={[scale, scale, 1]} position={[0, 0, -5 + adjustedProgress * 20]}>
      <Line points={points} color="#3dd9c4" lineWidth={2} transparent opacity={opacity} />
    </group>
  );
}

function GridLines({ progress }: { progress: number }) {
  const verticalLines = useMemo(() => {
    const lines: [number, number, number][][] = [];
    for (let i = -10; i <= 10; i++) {
      lines.push([
        [i * 2, -20, 0],
        [i * 2, 20, 0]
      ]);
    }
    return lines;
  }, []);

  const horizontalLines = useMemo(() => {
    const lines: [number, number, number][][] = [];
    for (let i = -10; i <= 10; i++) {
      lines.push([
        [-20, i * 2, 0],
        [20, i * 2, 0]
      ]);
    }
    return lines;
  }, []);

  const zPosition = -30 + progress * 10;

  return (
    <group position={[0, 0, zPosition]}>
      {verticalLines.map((points, i) => (
        <Line key={`v-${i}`} points={points} color="#2ab8a5" lineWidth={1} transparent opacity={0.4} />
      ))}
      {horizontalLines.map((points, i) => (
        <Line key={`h-${i}`} points={points} color="#2ab8a5" lineWidth={1} transparent opacity={0.3} />
      ))}
    </group>
  );
}

function TunnelRings() {
  const ringsRef = useRef<THREE.Group>(null);
  
  const rings = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      z: -i * 5 - 10,
      scale: 1 + i * 0.3,
      opacity: Math.max(0.1, 1 - i * 0.05)
    }));
  }, []);

  useFrame(() => {
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring) => {
        ring.position.z += 0.15;
        if (ring.position.z > 10) {
          ring.position.z = -90;
        }
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} scale={[ring.scale * 3, ring.scale * 3, 1]}>
          <torusGeometry args={[3, 0.02, 8, 64]} />
          <meshBasicMaterial color="#3dd9c4" transparent opacity={ring.opacity * 0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DepthLines() {
  const lines = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 8;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });
  }, []);

  return (
    <group>
      {lines.map((line, i) => {
        const points: [number, number, number][] = [
          [line.x, line.y, 10],
          [line.x * 0.1, line.y * 0.1, -100]
        ];
        return (
          <Line key={i} points={points} color="#3dd9c4" lineWidth={1} transparent opacity={0.6} />
        );
      })}
    </group>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = Math.random() * -100;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 200; i++) {
        positions[i * 3 + 2] += 0.5;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -100;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#5ee8d5" size={0.15} transparent opacity={0.8} />
    </points>
  );
}

function CameraController({ progress }: { progress: number }) {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.z = 10 - progress * 120;
    camera.position.y = Math.sin(progress * Math.PI * 2) * 0.5;
    camera.rotation.z = Math.sin(progress * Math.PI * 4) * 0.02;
  });

  return null;
}

function Scene({ progress }: { progress: number }) {
  return (
    <>
      <color attach="background" args={['#0d2625']} />
      <fog attach="fog" args={['#0d2625', 10, 100]} />
      
      <CameraController progress={progress} />
      
      {/* Tooth outline that we fly through */}
      <ToothOutline progress={progress} />
      
      {/* Multiple tooth outlines for depth */}
      {[0.1, 0.2, 0.3].map((offset, i) => (
        <ToothOutline key={i} progress={progress} offset={offset} />
      ))}
      
      {/* Grid at the back */}
      <GridLines progress={progress} />
      
      {/* Tunnel rings */}
      <TunnelRings />
      
      {/* Perspective depth lines */}
      <DepthLines />
      
      {/* Flying particles */}
      <Particles />
      
      {/* Ambient glow */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, -50]} intensity={2} color="#3dd9c4" />
    </>
  );
}

interface GridTunnel3DProps {
  progress: number;
}

export function GridTunnel3D({ progress }: GridTunnel3DProps) {
  return (
    <div className="absolute inset-0 z-[2]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}