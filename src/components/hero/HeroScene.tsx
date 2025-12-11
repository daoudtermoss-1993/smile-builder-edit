import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { Tooth3D } from './Tooth3D';

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Key light - teal accent */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            color="#00b3b3"
          />
          
          {/* Fill light */}
          <directionalLight
            position={[-5, 3, -5]}
            intensity={0.8}
            color="#ffffff"
          />
          
          {/* Rim light for glow effect */}
          <pointLight
            position={[0, 5, -3]}
            intensity={2}
            color="#00ffff"
          />
          
          {/* Back light */}
          <pointLight
            position={[0, -3, 3]}
            intensity={0.5}
            color="#004d4d"
          />
          
          {/* 3D Tooth */}
          <Tooth3D />
          
          {/* Soft shadow beneath */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
            color="#004d4d"
          />
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* Allow user interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
