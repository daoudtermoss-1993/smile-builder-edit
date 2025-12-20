import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images haute résolution 1920x1080 pour zoom sans perte
import heroMountain from "@/assets/hero-scene-1-mountain.jpg";
import heroClouds from "@/assets/hero-scene-2-clouds.jpg";
import heroClinic from "@/assets/hero-scene-3-clinic.jpg";
import heroLight from "@/assets/hero-scene-4-light.jpg";
import heroInterior from "@/assets/hero-scene-5-interior.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring très fluide comme mont-fort
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Montagne majestueuse (0% - 25%)
  // Style mont-fort: zoom progressif avec rotation 3D subtile
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.12, 0.25], [1.8, 1.4, 1.1]);
  const scene1X = useTransform(smoothProgress, [0, 0.12, 0.25], ["0%", "8%", "15%"]);
  const scene1Y = useTransform(smoothProgress, [0, 0.12, 0.25], ["0%", "-5%", "-12%"]);
  const scene1RotateY = useTransform(smoothProgress, [0, 0.25], [3, -2]);
  const scene1RotateX = useTransform(smoothProgress, [0, 0.25], [-2, 1]);
  const scene1Opacity = useTransform(smoothProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const scene1Brightness = useTransform(smoothProgress, [0, 0.25], [1.05, 0.9]);

  // ═══════════════════════════════════════════════════════════════
  // TRANSITION 1: Nuages (20% - 40%) - comme mont-fort
  // ═══════════════════════════════════════════════════════════════
  const clouds1Opacity = useTransform(smoothProgress, [0.18, 0.25, 0.35, 0.42], [0, 1, 1, 0]);
  const clouds1Scale = useTransform(smoothProgress, [0.18, 0.30, 0.42], [1.5, 1.2, 1]);
  const clouds1Y = useTransform(smoothProgress, [0.18, 0.42], ["25%", "-30%"]);
  const clouds1X = useTransform(smoothProgress, [0.18, 0.42], ["-5%", "5%"]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Clinique extérieur (35% - 55%)
  // Émergence de la brume vers le bâtiment
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.35, 0.45, 0.55], [1.6, 1.3, 1.1]);
  const scene2X = useTransform(smoothProgress, [0.35, 0.45, 0.55], ["-12%", "0%", "10%"]);
  const scene2Y = useTransform(smoothProgress, [0.35, 0.45, 0.55], ["10%", "0%", "-10%"]);
  const scene2RotateY = useTransform(smoothProgress, [0.35, 0.55], [-3, 3]);
  const scene2RotateX = useTransform(smoothProgress, [0.35, 0.55], [2, -1]);
  const scene2Opacity = useTransform(smoothProgress, [0.32, 0.40, 0.50, 0.60], [0, 1, 1, 0]);
  const scene2Brightness = useTransform(smoothProgress, [0.35, 0.55], [1.1, 0.95]);

  // ═══════════════════════════════════════════════════════════════
  // TRANSITION 2: Lumière éclatante (52% - 72%)
  // Représente le sourire lumineux
  // ═══════════════════════════════════════════════════════════════
  const light2Opacity = useTransform(smoothProgress, [0.52, 0.60, 0.68, 0.75], [0, 1, 1, 0]);
  const light2Scale = useTransform(smoothProgress, [0.52, 0.65, 0.75], [1.4, 1.15, 0.95]);
  const light2Y = useTransform(smoothProgress, [0.52, 0.75], ["20%", "-25%"]);
  const light2Brightness = useTransform(smoothProgress, [0.52, 0.65, 0.75], [0.95, 1.25, 1.1]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Clinique intérieur (68% - 100%)
  // Destination finale - l'expérience premium
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.68, 0.82, 1], [1.5, 1.2, 1]);
  const scene3X = useTransform(smoothProgress, [0.68, 0.82, 1], ["8%", "-3%", "-10%"]);
  const scene3Y = useTransform(smoothProgress, [0.68, 0.82, 1], ["12%", "0%", "-8%"]);
  const scene3RotateY = useTransform(smoothProgress, [0.68, 1], [2, -1]);
  const scene3RotateX = useTransform(smoothProgress, [0.68, 1], [-1, 0.5]);
  const scene3Opacity = useTransform(smoothProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const scene3Brightness = useTransform(smoothProgress, [0.68, 1], [1.08, 0.88]);
  const scene3Blur = useTransform(smoothProgress, [0.92, 1], [0, 2]);

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
      {/* SCENE 1: Montagne majestueuse - Premier impact visuel */}
      <motion.div
        className="absolute w-[220%] h-[220%]"
        style={{
          top: "-60%",
          left: "-60%",
          x: scene1X,
          y: scene1Y,
          scale: scene1Scale,
          opacity: scene1Opacity,
          rotateY: scene1RotateY,
          rotateX: scene1RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroMountain}
          alt="Montagne majestueuse"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene1Brightness, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* TRANSITION 1: Nuages - Voyage à travers la brume */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: clouds1X,
          y: clouds1Y,
          scale: clouds1Scale,
          opacity: clouds1Opacity,
          transformOrigin: "center center",
        }}
      >
        <img
          src={heroClouds}
          alt="Nuages de transition"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.1)" }}
        />
      </motion.div>

      {/* SCENE 2: Clinique extérieur - Émergence */}
      <motion.div
        className="absolute w-[220%] h-[220%]"
        style={{
          top: "-60%",
          left: "-60%",
          x: scene2X,
          y: scene2Y,
          scale: scene2Scale,
          opacity: scene2Opacity,
          rotateY: scene2RotateY,
          rotateX: scene2RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroClinic}
          alt="Clinique dentaire extérieur"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene2Brightness, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* TRANSITION 2: Lumière éclatante - Sourire lumineux */}
      <motion.div
        className="absolute w-[180%] h-[180%]"
        style={{
          top: "-40%",
          left: "-40%",
          y: light2Y,
          scale: light2Scale,
          opacity: light2Opacity,
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroLight}
          alt="Transition lumineuse"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(light2Brightness, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* SCENE 3: Clinique intérieur - Destination finale */}
      <motion.div
        className="absolute w-[220%] h-[220%]"
        style={{
          top: "-60%",
          left: "-60%",
          x: scene3X,
          y: scene3Y,
          scale: scene3Scale,
          opacity: scene3Opacity,
          rotateY: scene3RotateY,
          rotateX: scene3RotateX,
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
              [scene3Brightness, scene3Blur],
              ([b, bl]) => `brightness(${b}) blur(${bl}px)`
            ),
          }}
        />
      </motion.div>

      {/* Vignette cinématique */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.15) 100%)"
        }}
      />
    </div>
  );
}
