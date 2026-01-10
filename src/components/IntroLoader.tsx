import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

interface IntroLoaderProps {
  onComplete: () => void;
  ready?: boolean;
}

// Mini 3D Tooth component for the loader
function MiniTooth3D() {
  const toothRef = useRef<THREE.Group>(null);
  
  const toothShape = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, -1.5));
    points.push(new THREE.Vector2(0.15, -1.4));
    points.push(new THREE.Vector2(0.2, -1.2));
    points.push(new THREE.Vector2(0.25, -1.0));
    points.push(new THREE.Vector2(0.3, -0.8));
    points.push(new THREE.Vector2(0.35, -0.5));
    points.push(new THREE.Vector2(0.4, -0.3));
    points.push(new THREE.Vector2(0.55, 0));
    points.push(new THREE.Vector2(0.65, 0.3));
    points.push(new THREE.Vector2(0.7, 0.5));
    points.push(new THREE.Vector2(0.68, 0.7));
    points.push(new THREE.Vector2(0.6, 0.85));
    points.push(new THREE.Vector2(0.45, 0.95));
    points.push(new THREE.Vector2(0.25, 1.0));
    points.push(new THREE.Vector2(0, 1.02));
    return points;
  }, []);

  useFrame((state) => {
    if (toothRef.current) {
      toothRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      toothRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
      <group ref={toothRef} scale={0.45}>
        <mesh>
          <latheGeometry args={[toothShape, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={256}
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
        <mesh scale={0.85}>
          <latheGeometry args={[toothShape, 32]} />
          <meshStandardMaterial
            color="#00b3b3"
            emissive="#00b3b3"
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function IntroLoader({ onComplete, ready = true }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "exit">("loading");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!ready || startedRef.current) return;
    startedRef.current = true;

    // Progress animation - 1200ms total for smoother feel
    const duration = 1200;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth acceleration
      const eased = 1 - Math.pow(1 - newProgress, 3);
      setProgress(eased);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPhase("complete");
        setTimeout(() => setPhase("exit"), 300);
        setTimeout(() => onComplete(), 600);
      }
    };
    
    requestAnimationFrame(animate);
  }, [ready, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" || progress < 1 ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(180 15% 92%) 0%, hsl(180 10% 88%) 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Main horizontal line container - full width */}
          <div className="absolute inset-x-0 flex items-center px-8 md:px-16 lg:px-24">
            {/* Left side - Logo */}
            <motion.div
              className="flex-shrink-0 z-10"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-xl md:text-2xl lg:text-3xl font-light tracking-wide text-[#2a3a3a]">
                <span className="font-semibold">German</span>
              </h1>
              <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#5a6a6a] mt-0.5">
                Dental Clinic
              </p>
            </motion.div>

            {/* Horizontal line - extends from logo to circles */}
            <motion.div
              className="flex-grow h-px bg-[#2a3a3a]/40 mx-4 md:mx-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
            />

            {/* Center - 3D Tooth with concentric circles */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              {/* Outer circle - rotating */}
              <motion.div
                className="absolute w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border border-[#2a3a3a]/30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                transition={{ 
                  scale: { duration: 0.4, delay: 0.3 },
                  opacity: { duration: 0.4, delay: 0.3 },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
              />
              
              {/* Middle circle - counter rotating */}
              <motion.div
                className="absolute w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full border border-[#2a3a3a]/50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: -360 }}
                transition={{ 
                  scale: { duration: 0.4, delay: 0.4 },
                  opacity: { duration: 0.4, delay: 0.4 },
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                }}
              />
              
              {/* Inner circle - static */}
              <motion.div
                className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 rounded-full border-2 border-[#2a3a3a]/70"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />

              {/* 3D Tooth Canvas */}
              <motion.div 
                className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 z-10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Canvas
                  camera={{ position: [0, 0, 4], fov: 45 }}
                  style={{ background: "transparent" }}
                  gl={{ alpha: true, antialias: true }}
                >
                  <ambientLight intensity={1} />
                  <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
                  <pointLight position={[-10, -10, -10]} intensity={0.4} color="#e0e0e0" />
                  <spotLight position={[0, 5, 5]} intensity={0.8} color="#00b3b3" />
                  <MiniTooth3D />
                </Canvas>
              </motion.div>
            </div>

            {/* Horizontal line - extends from circles to percentage */}
            <motion.div
              className="flex-grow h-px bg-[#2a3a3a]/40 mx-4 md:mx-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformOrigin: "right" }}
            />

            {/* Right side - Percentage */}
            <motion.div
              className="flex-shrink-0 text-right z-10"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2a3a3a] tabular-nums">
                  {Math.round(progress * 100)}
                </span>
                <span className="text-lg md:text-xl text-[#5a6a6a]">%</span>
              </div>
              <p className="text-[10px] md:text-xs tracking-[0.15em] uppercase text-[#5a6a6a] mt-1">
                Loading...
              </p>
            </motion.div>
          </div>

          {/* Bottom left - Mission text */}
          <motion.div
            className="absolute bottom-8 left-8 md:left-16 lg:left-24 max-w-xs md:max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-[10px] md:text-xs tracking-wide text-[#5a6a6a] leading-relaxed">
              <span className="font-medium text-[#2a3a3a]">Our mission:</span>{" "}
              To provide exceptional dental care with a commitment to patient comfort, 
              advanced technology, and lasting beautiful smiles.
            </p>
          </motion.div>

          {/* Exit curtain effect */}
          {phase === "exit" && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, hsl(180 15% 92%) 0%, hsl(180 10% 88%) 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
