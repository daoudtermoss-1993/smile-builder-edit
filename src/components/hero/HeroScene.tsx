import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import heroPanorama from "@/assets/hero-panorama.jpg";
import heroClouds from "@/assets/hero-clouds-transition.jpg";
import heroExterior from "@/assets/hero-clinic-exterior.jpg";
import heroInterior from "@/assets/hero-clinic-interior.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Smooth spring for all animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // === IMAGE 1: Panorama (0% - 30% scroll) ===
  const img1X = useTransform(smoothProgress, [0, 0.15, 0.3], ["0%", "15%", "30%"]);
  const img1Y = useTransform(smoothProgress, [0, 0.15, 0.3], ["0%", "-10%", "-25%"]);
  const img1Scale = useTransform(smoothProgress, [0, 0.15, 0.3], [1.8, 1.4, 1.1]);
  const img1Opacity = useTransform(smoothProgress, [0, 0.2, 0.35], [1, 1, 0]);
  const img1RotateY = useTransform(smoothProgress, [0, 0.3], [5, -3]);
  const img1RotateX = useTransform(smoothProgress, [0, 0.3], [-3, 2]);

  // === CLOUDS TRANSITION 1 (25% - 45% scroll) ===
  const clouds1Opacity = useTransform(smoothProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const clouds1Scale = useTransform(smoothProgress, [0.2, 0.35, 0.5], [1.5, 1.2, 1]);
  const clouds1Y = useTransform(smoothProgress, [0.2, 0.5], ["20%", "-30%"]);

  // === IMAGE 2: Exterior (35% - 65% scroll) ===
  const img2X = useTransform(smoothProgress, [0.35, 0.5, 0.65], ["-20%", "0%", "20%"]);
  const img2Y = useTransform(smoothProgress, [0.35, 0.5, 0.65], ["10%", "0%", "-15%"]);
  const img2Scale = useTransform(smoothProgress, [0.35, 0.5, 0.65], [1.6, 1.3, 1.1]);
  const img2Opacity = useTransform(smoothProgress, [0.3, 0.4, 0.55, 0.7], [0, 1, 1, 0]);
  const img2RotateY = useTransform(smoothProgress, [0.35, 0.65], [-5, 5]);
  const img2RotateX = useTransform(smoothProgress, [0.35, 0.65], [2, -2]);

  // === CLOUDS TRANSITION 2 (55% - 75% scroll) ===
  const clouds2Opacity = useTransform(smoothProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  const clouds2Scale = useTransform(smoothProgress, [0.55, 0.7, 0.85], [1.3, 1.1, 0.9]);
  const clouds2Y = useTransform(smoothProgress, [0.55, 0.85], ["30%", "-20%"]);
  const clouds2X = useTransform(smoothProgress, [0.55, 0.85], ["-10%", "10%"]);

  // === IMAGE 3: Interior (70% - 100% scroll) ===
  const img3X = useTransform(smoothProgress, [0.7, 0.85, 1], ["10%", "-5%", "-15%"]);
  const img3Y = useTransform(smoothProgress, [0.7, 0.85, 1], ["15%", "0%", "-10%"]);
  const img3Scale = useTransform(smoothProgress, [0.7, 0.85, 1], [1.5, 1.2, 1]);
  const img3Opacity = useTransform(smoothProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const img3RotateY = useTransform(smoothProgress, [0.7, 1], [4, -2]);
  const img3RotateX = useTransform(smoothProgress, [0.7, 1], [-2, 1]);

  // Dynamic filters
  const brightness1 = useTransform(smoothProgress, [0, 0.3], [1.1, 0.9]);
  const brightness2 = useTransform(smoothProgress, [0.35, 0.65], [1.15, 0.95]);
  const brightness3 = useTransform(smoothProgress, [0.7, 1], [1.1, 0.85]);
  const blur3 = useTransform(smoothProgress, [0.9, 1], [0, 3]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
        perspective: "2000px",
        perspectiveOrigin: "50% 50%"
      }}
    >
      {/* IMAGE 1: Panorama - First scene */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: img1X,
          y: img1Y,
          scale: img1Scale,
          opacity: img1Opacity,
          rotateY: img1RotateY,
          rotateX: img1RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroPanorama}
          alt="Panorama apaisant"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(brightness1, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* CLOUDS TRANSITION 1 */}
      <motion.div
        className="absolute w-[180%] h-[180%]"
        style={{
          top: "-40%",
          left: "-40%",
          y: clouds1Y,
          scale: clouds1Scale,
          opacity: clouds1Opacity,
          transformOrigin: "center center",
        }}
      >
        <img
          src={heroClouds}
          alt="Transition nuages"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.15)" }}
        />
      </motion.div>

      {/* IMAGE 2: Clinic Exterior */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: img2X,
          y: img2Y,
          scale: img2Scale,
          opacity: img2Opacity,
          rotateY: img2RotateY,
          rotateX: img2RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroExterior}
          alt="Clinique dentaire extérieur"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(brightness2, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* CLOUDS TRANSITION 2 */}
      <motion.div
        className="absolute w-[160%] h-[160%]"
        style={{
          top: "-30%",
          left: "-30%",
          x: clouds2X,
          y: clouds2Y,
          scale: clouds2Scale,
          opacity: clouds2Opacity,
          transformOrigin: "center center",
        }}
      >
        <img
          src={heroClouds}
          alt="Transition nuages"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.1) blur(1px)" }}
        />
      </motion.div>

      {/* IMAGE 3: Clinic Interior - Final scene */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: img3X,
          y: img3Y,
          scale: img3Scale,
          opacity: img3Opacity,
          rotateY: img3RotateY,
          rotateX: img3RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroInterior}
          alt="Clinique dentaire intérieur"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(
              [brightness3, blur3],
              ([b, bl]) => `brightness(${b}) blur(${bl}px)`
            ),
          }}
        />
      </motion.div>

      {/* Subtle vignette overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)"
        }}
      />
    </div>
  );
}
