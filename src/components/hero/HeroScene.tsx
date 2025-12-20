import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images haute résolution 1920x1088 - Séquence narrative clinique dentaire
import heroExterior from "@/assets/hero-dental-exterior.jpg";
import heroLight from "@/assets/hero-dental-light.jpg";
import heroTreatment from "@/assets/hero-dental-treatment.jpg";
import heroSilk from "@/assets/hero-dental-silk.jpg";
import heroSmile from "@/assets/hero-dental-smile.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring très fluide comme mont-fort
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 28,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Clinique Extérieur (0% - 25%)
  // Premier contact - Architecture moderne et accueillante
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.12, 0.25], [1.6, 1.35, 1.1]);
  const scene1X = useTransform(smoothProgress, [0, 0.12, 0.25], ["5%", "0%", "-8%"]);
  const scene1Y = useTransform(smoothProgress, [0, 0.12, 0.25], ["3%", "0%", "-10%"]);
  const scene1RotateY = useTransform(smoothProgress, [0, 0.25], [2, -3]);
  const scene1RotateX = useTransform(smoothProgress, [0, 0.25], [-1, 1.5]);
  const scene1Opacity = useTransform(smoothProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const scene1Brightness = useTransform(smoothProgress, [0, 0.25], [1.02, 0.92]);

  // ═══════════════════════════════════════════════════════════════
  // TRANSITION 1: Lumière dorée (18% - 38%)
  // Passage vers l'intérieur - Sensation de bien-être
  // ═══════════════════════════════════════════════════════════════
  const trans1Opacity = useTransform(smoothProgress, [0.18, 0.26, 0.34, 0.42], [0, 1, 1, 0]);
  const trans1Scale = useTransform(smoothProgress, [0.18, 0.30, 0.42], [1.4, 1.2, 1.05]);
  const trans1Y = useTransform(smoothProgress, [0.18, 0.42], ["15%", "-20%"]);
  const trans1Brightness = useTransform(smoothProgress, [0.18, 0.30, 0.42], [1, 1.15, 1.05]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Salle de Traitement (35% - 58%)
  // Technologie de pointe - Confiance et professionnalisme
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.35, 0.46, 0.58], [1.5, 1.25, 1.08]);
  const scene2X = useTransform(smoothProgress, [0.35, 0.46, 0.58], ["-10%", "0%", "8%"]);
  const scene2Y = useTransform(smoothProgress, [0.35, 0.46, 0.58], ["8%", "0%", "-8%"]);
  const scene2RotateY = useTransform(smoothProgress, [0.35, 0.58], [-2, 2.5]);
  const scene2RotateX = useTransform(smoothProgress, [0.35, 0.58], [1.5, -1]);
  const scene2Opacity = useTransform(smoothProgress, [0.32, 0.40, 0.52, 0.62], [0, 1, 1, 0]);
  const scene2Brightness = useTransform(smoothProgress, [0.35, 0.58], [1.05, 0.95]);

  // ═══════════════════════════════════════════════════════════════
  // TRANSITION 2: Soie blanche (55% - 75%)
  // Douceur et confort - Préparation au résultat
  // ═══════════════════════════════════════════════════════════════
  const trans2Opacity = useTransform(smoothProgress, [0.55, 0.62, 0.70, 0.78], [0, 1, 1, 0]);
  const trans2Scale = useTransform(smoothProgress, [0.55, 0.66, 0.78], [1.35, 1.15, 0.98]);
  const trans2Y = useTransform(smoothProgress, [0.55, 0.78], ["18%", "-22%"]);
  const trans2RotateZ = useTransform(smoothProgress, [0.55, 0.78], [2, -2]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Sourire Parfait (70% - 100%)
  // Résultat final - La promesse de la clinique
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.70, 0.84, 1], [1.45, 1.18, 1]);
  const scene3X = useTransform(smoothProgress, [0.70, 0.84, 1], ["6%", "-2%", "-5%"]);
  const scene3Y = useTransform(smoothProgress, [0.70, 0.84, 1], ["10%", "0%", "-5%"]);
  const scene3RotateY = useTransform(smoothProgress, [0.70, 1], [1.5, -0.5]);
  const scene3RotateX = useTransform(smoothProgress, [0.70, 1], [-0.8, 0.3]);
  const scene3Opacity = useTransform(smoothProgress, [0.68, 0.78, 1], [0, 1, 1]);
  const scene3Brightness = useTransform(smoothProgress, [0.70, 0.90, 1], [1.08, 1, 0.92]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
        perspective: "2200px",
        perspectiveOrigin: "50% 50%"
      }}
    >
      {/* SCENE 1: Clinique Extérieur - Premier impact */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
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
          src={heroExterior}
          alt="Clinique dentaire moderne"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene1Brightness, (b) => `brightness(${b}) saturate(1.05)`),
          }}
        />
      </motion.div>

      {/* TRANSITION 1: Lumière dorée - Passage élégant */}
      <motion.div
        className="absolute w-[180%] h-[180%]"
        style={{
          top: "-40%",
          left: "-40%",
          y: trans1Y,
          scale: trans1Scale,
          opacity: trans1Opacity,
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroLight}
          alt="Transition lumineuse"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(trans1Brightness, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* SCENE 2: Salle de Traitement - Technologie */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
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
          src={heroTreatment}
          alt="Salle de traitement moderne"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene2Brightness, (b) => `brightness(${b}) saturate(1.02)`),
          }}
        />
      </motion.div>

      {/* TRANSITION 2: Soie blanche - Douceur */}
      <motion.div
        className="absolute w-[175%] h-[175%]"
        style={{
          top: "-37.5%",
          left: "-37.5%",
          y: trans2Y,
          scale: trans2Scale,
          opacity: trans2Opacity,
          rotate: trans2RotateZ,
          transformOrigin: "center center",
        }}
      >
        <img
          src={heroSilk}
          alt="Transition soie"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.08)" }}
        />
      </motion.div>

      {/* SCENE 3: Sourire Parfait - Le résultat */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
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
          src={heroSmile}
          alt="Sourire parfait"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene3Brightness, (b) => `brightness(${b}) contrast(1.02)`),
          }}
        />
      </motion.div>

      {/* Vignette cinématique subtile */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.12) 100%)"
        }}
      />
    </div>
  );
}
