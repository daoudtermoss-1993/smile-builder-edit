import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Tooth3D } from "./hero/Tooth3D";
import heroImage from "@/assets/hero-dental.jpg";
import * as THREE from "three";

// Lerp function for smooth interpolation
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

const AnimatedTooth = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  const currentX = useRef(2.5);
  const currentScale = useRef(1.2);
  const currentRotationY = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate target position based on scroll
  const getXPosition = (progress: number) => {
    if (progress < 0.12) return 2.5; // Hero - right
    if (progress < 0.28) return -2.8; // About - left
    if (progress < 0.42) return 3.0; // Services - right
    if (progress < 0.58) return -2.5; // Gallery - left
    if (progress < 0.78) return 2.8; // Booking - right
    return 0; // Contact - center
  };

  const getScale = (progress: number) => {
    if (progress < 0.12) return 1.3;
    if (progress < 0.28) return 0.95;
    if (progress < 0.42) return 1.1;
    if (progress < 0.58) return 0.9;
    if (progress < 0.78) return 1.0;
    return 0.8;
  };

  const getRotationY = (progress: number) => {
    if (progress < 0.12) return 0;
    if (progress < 0.28) return Math.PI * 0.15;
    if (progress < 0.42) return -Math.PI * 0.1;
    if (progress < 0.58) return Math.PI * 0.2;
    if (progress < 0.78) return -Math.PI * 0.15;
    return 0;
  };

  useFrame(() => {
    if (!groupRef.current) return;
    
    const targetX = getXPosition(scrollProgress) * (isMobile ? 0.4 : 1);
    const targetScale = getScale(scrollProgress) * (isMobile ? 0.6 : 1);
    const targetRotationY = getRotationY(scrollProgress);
    
    // Smooth lerp transitions
    currentX.current = lerp(currentX.current, targetX, 0.04);
    currentScale.current = lerp(currentScale.current, targetScale, 0.04);
    currentRotationY.current = lerp(currentRotationY.current, targetRotationY, 0.03);
    
    groupRef.current.position.x = currentX.current;
    groupRef.current.scale.setScalar(currentScale.current);
    groupRef.current.rotation.y = currentRotationY.current;
  });

  return (
    <group ref={groupRef}>
      <Tooth3D />
    </group>
  );
};

const Scene3D = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.8}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-5, 5, -5]} intensity={1} color="#00b3b3" />
      <pointLight position={[5, -5, 5]} intensity={0.6} color="#00e6e6" />
      
      <Suspense fallback={null}>
        <Float
          speed={1.2}
          rotationIntensity={0.2}
          floatIntensity={0.4}
        >
          <AnimatedTooth scrollProgress={scrollProgress} />
        </Float>
        
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.5}
          scale={15}
          blur={2.5}
          far={5}
        />
        
        <Environment preset="studio" />
      </Suspense>
    </>
  );
};

export const GlobalScrollBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  
  // Smooth spring for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Background image parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgBlur = useTransform(scrollYProgress, [0, 0.3, 1], [0, 2, 6]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.3, 0.15]);

  // Convert MotionValue to number for Canvas
  const [scrollValue, setScrollValue] = useState(0);
  
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      setScrollValue(v);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 -inset-x-20 -inset-y-20"
        style={{
          y: bgY,
          scale: bgScale,
          opacity: bgOpacity,
        }}
      >
        <motion.img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(bgBlur, (value) => `blur(${value}px)`),
          }}
        />
      </motion.div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      
      {/* 3D Canvas with scrolling tooth */}
      <div className="absolute inset-0 pointer-events-auto">
        <Canvas
          camera={{ 
            position: [0, 0, 8], 
            fov: 45,
            near: 0.1,
            far: 100
          }}
          style={{ 
            background: 'transparent',
            pointerEvents: 'none'
          }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene3D scrollProgress={scrollValue} />
        </Canvas>
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
        style={{ 
          x: useTransform(scrollYProgress, [0, 1], [0, 200]),
          opacity: useTransform(scrollYProgress, [0, 0.5], [0.6, 0.2])
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl"
        style={{ 
          x: useTransform(scrollYProgress, [0, 1], [0, -150]),
          opacity: useTransform(scrollYProgress, [0, 0.5], [0.5, 0.15])
        }}
      />
    </div>
  );
};
