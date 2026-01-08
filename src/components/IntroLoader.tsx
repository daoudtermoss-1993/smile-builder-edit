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
      toothRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      toothRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={toothRef} scale={0.5}>
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

    // Fast progress animation - 800ms total
    const duration = 800;
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
        setTimeout(() => setPhase("exit"), 200);
        setTimeout(() => onComplete(), 500);
      }
    };
    
    requestAnimationFrame(animate);
  }, [ready, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" || progress < 1 ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Subtle background gradient */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Center container */}
          <div className="relative flex flex-col items-center gap-6 md:gap-8 px-8 w-full max-w-xs md:max-w-sm">
            {/* Logo text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                Dr. Yousif German
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Dental Clinic
              </p>
            </motion.div>

            {/* Loading bar container */}
            <div className="relative w-full">
              {/* Background track */}
              <motion.div
                className="h-0.5 md:h-1 w-full rounded-full bg-muted/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Progress bar with glow */}
              <motion.div
                className="absolute top-0 left-0 h-0.5 md:h-1 rounded-full bg-primary origin-left"
                style={{
                  width: "100%",
                  scaleX: progress,
                  boxShadow: "0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.3)",
                }}
              />

              {/* Moving 3D tooth on the loading bar */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${progress * 100}%`,
                  x: "-50%",
                }}
              >
                {/* Glow behind tooth */}
                <motion.div
                  className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* 3D Tooth Canvas */}
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  <Canvas
                    camera={{ position: [0, 0, 4], fov: 45 }}
                    style={{ background: "transparent" }}
                    gl={{ alpha: true, antialias: true }}
                  >
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
                    <spotLight position={[0, 5, 5]} intensity={1} color="#00b3b3" />
                    <MiniTooth3D />
                  </Canvas>
                </div>
              </motion.div>
            </div>

            {/* Percentage */}
            <motion.span
              className="text-xs md:text-sm font-medium text-muted-foreground tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {Math.round(progress * 100)}%
            </motion.span>
          </div>

          {/* Exit curtain effect */}
          {phase === "exit" && (
            <>
              <motion.div
                className="absolute inset-0 bg-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
