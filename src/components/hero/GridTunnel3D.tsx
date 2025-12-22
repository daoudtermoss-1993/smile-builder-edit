import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

// Tooth outline points - more detailed for clear visibility
const toothPoints: [number, number, number][] = [
  [0, 3.0, 0], 
  [-0.5, 2.9, 0], [-0.9, 2.7, 0], [-1.2, 2.3, 0], [-1.4, 1.8, 0], [-1.5, 1.2, 0],
  [-1.5, 0.5, 0], [-1.4, 0, 0], [-1.3, -0.5, 0], [-1.1, -1.2, 0],
  [-0.9, -2.0, 0], [-0.7, -2.8, 0], [-0.5, -3.2, 0], [-0.25, -3.5, 0],
  [0, -3.2, 0],
  [0.25, -3.5, 0], [0.5, -3.2, 0], [0.7, -2.8, 0], [0.9, -2.0, 0],
  [1.1, -1.2, 0], [1.3, -0.5, 0], [1.4, 0, 0], [1.5, 0.5, 0],
  [1.5, 1.2, 0], [1.4, 1.8, 0], [1.2, 2.3, 0], [0.9, 2.7, 0], [0.5, 2.9, 0],
  [0, 3.0, 0]
];

// Animated tooth outline that draws itself
function AnimatedToothOutline({ 
  zPosition, 
  scale, 
  opacity, 
  drawProgress 
}: { 
  zPosition: number; 
  scale: number; 
  opacity: number;
  drawProgress: number;
}) {
  const points = useMemo(() => {
    const scaledPoints = toothPoints.map(([x, y, z]) => 
      [x * 2, y * 1.8, z] as [number, number, number]
    );
    // Only show portion of the path based on drawProgress
    const pointCount = Math.floor(scaledPoints.length * drawProgress);
    return scaledPoints.slice(0, Math.max(2, pointCount));
  }, [drawProgress]);

  if (opacity <= 0 || drawProgress <= 0) return null;

  return (
    <group scale={[scale, scale, 1]} position={[0, 0, zPosition]}>
      <Line 
        points={points} 
        color="#3dd9c4" 
        lineWidth={3} 
        transparent 
        opacity={opacity}
      />
      {/* Glow effect */}
      <Line 
        points={points} 
        color="#5ee8d5" 
        lineWidth={6} 
        transparent 
        opacity={opacity * 0.3}
      />
    </group>
  );
}

// Multiple tooth layers that appear in sequence
function ToothLayers({ progress }: { progress: number }) {
  // First phase: draw the tooth lines (0 to 0.3)
  // Second phase: camera enters through (0.3 to 1.0)
  
  const layers = useMemo(() => {
    return [
      { zOffset: 0, delay: 0, scaleMultiplier: 1 },
      { zOffset: -5, delay: 0.05, scaleMultiplier: 1.2 },
      { zOffset: -10, delay: 0.1, scaleMultiplier: 1.5 },
      { zOffset: -15, delay: 0.15, scaleMultiplier: 1.8 },
      { zOffset: -20, delay: 0.2, scaleMultiplier: 2.2 },
      { zOffset: -30, delay: 0.25, scaleMultiplier: 2.8 },
    ];
  }, []);

  return (
    <group>
      {layers.map((layer, i) => {
        // Draw progress for this layer
        const layerDrawStart = layer.delay;
        const layerDrawEnd = layerDrawStart + 0.25;
        const drawProgress = Math.min(1, Math.max(0, (progress - layerDrawStart) / (layerDrawEnd - layerDrawStart)));
        
        // Scale increases as camera enters
        const enterProgress = Math.max(0, (progress - 0.3) / 0.7);
        const baseScale = layer.scaleMultiplier;
        const scale = baseScale + enterProgress * 8 * baseScale;
        
        // Opacity fades as we pass through
        const opacity = Math.min(1, drawProgress) * Math.max(0, 1 - enterProgress * 1.5);
        
        // Z position moves towards camera as we enter
        const zPos = layer.zOffset + enterProgress * 30;
        
        return (
          <AnimatedToothOutline
            key={i}
            zPosition={zPos}
            scale={scale}
            opacity={opacity}
            drawProgress={drawProgress}
          />
        );
      })}
    </group>
  );
}

// Grid lines that appear after tooth
function GridLines({ progress }: { progress: number }) {
  const gridProgress = Math.max(0, (progress - 0.4) / 0.6);
  
  const verticalLines = useMemo(() => {
    const lines: [number, number, number][][] = [];
    for (let i = -10; i <= 10; i++) {
      lines.push([
        [i * 3, -30, 0],
        [i * 3, 30, 0]
      ]);
    }
    return lines;
  }, []);

  const horizontalLines = useMemo(() => {
    const lines: [number, number, number][][] = [];
    for (let i = -10; i <= 10; i++) {
      lines.push([
        [-30, i * 3, 0],
        [30, i * 3, 0]
      ]);
    }
    return lines;
  }, []);

  const zPosition = -50 + gridProgress * 20;
  const opacity = Math.min(1, gridProgress * 2);

  if (gridProgress <= 0) return null;

  return (
    <group position={[0, 0, zPosition]}>
      {verticalLines.map((points, i) => (
        <Line 
          key={`v-${i}`} 
          points={points} 
          color="#2ab8a5" 
          lineWidth={1} 
          transparent 
          opacity={opacity * 0.4} 
        />
      ))}
      {horizontalLines.map((points, i) => (
        <Line 
          key={`h-${i}`} 
          points={points} 
          color="#2ab8a5" 
          lineWidth={1} 
          transparent 
          opacity={opacity * 0.3} 
        />
      ))}
    </group>
  );
}

// Tunnel depth lines
function TunnelDepthLines({ progress }: { progress: number }) {
  const tunnelProgress = Math.max(0, (progress - 0.35) / 0.65);
  
  const lines = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const angle = (i / 32) * Math.PI * 2;
      const radius = 12;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });
  }, []);

  if (tunnelProgress <= 0) return null;

  return (
    <group>
      {lines.map((line, i) => {
        const points: [number, number, number][] = [
          [line.x, line.y, 20],
          [line.x * 0.05, line.y * 0.05, -150]
        ];
        return (
          <Line 
            key={i} 
            points={points} 
            color="#3dd9c4" 
            lineWidth={1} 
            transparent 
            opacity={tunnelProgress * 0.5} 
          />
        );
      })}
    </group>
  );
}

// Flying particles
function Particles({ progress }: { progress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleProgress = Math.max(0, (progress - 0.3) / 0.7);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = Math.random() * -120;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (particlesRef.current && particleProgress > 0) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 150; i++) {
        positions[i * 3 + 2] += 0.8;
        if (positions[i * 3 + 2] > 15) {
          positions[i * 3 + 2] = -120;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (particleProgress <= 0) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={150}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#5ee8d5" 
        size={0.2} 
        transparent 
        opacity={particleProgress * 0.8} 
      />
    </points>
  );
}

// Camera controller - enters through the tooth
function CameraController({ progress }: { progress: number }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Phase 1 (0-0.3): Camera stays still, watches tooth draw
    // Phase 2 (0.3-1): Camera enters and flies through
    
    const enterProgress = Math.max(0, (progress - 0.3) / 0.7);
    
    // Start position: in front of tooth, end: deep in tunnel
    camera.position.z = 15 - enterProgress * 130;
    
    // Slight vertical movement
    camera.position.y = Math.sin(enterProgress * Math.PI * 2) * 0.8;
    
    // Subtle rotation
    camera.rotation.z = Math.sin(enterProgress * Math.PI * 3) * 0.03;
  });

  return null;
}

function Scene({ progress }: { progress: number }) {
  return (
    <>
      <color attach="background" args={['#0d2625']} />
      <fog attach="fog" args={['#0d2625', 20, 120]} />
      
      <CameraController progress={progress} />
      
      {/* Animated tooth outlines - camera enters through these */}
      <ToothLayers progress={progress} />
      
      {/* Grid at the back */}
      <GridLines progress={progress} />
      
      {/* Tunnel depth lines */}
      <TunnelDepthLines progress={progress} />
      
      {/* Flying particles */}
      <Particles progress={progress} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 10]} intensity={1.5} color="#3dd9c4" />
      <pointLight position={[0, 0, -50]} intensity={2} color="#2ab8a5" />
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
        camera={{ position: [0, 0, 15], fov: 70, near: 0.1, far: 250 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}