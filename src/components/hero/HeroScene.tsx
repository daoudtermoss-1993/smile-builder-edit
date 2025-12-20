import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires cohérentes - Séquence clinique professionnelle
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring fluide pour transitions douces
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Équipement dentaire - Loupes (0% - 35%)
  // Focus sur les détails, précision médicale
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.15, 0.35], [1.4, 1.2, 1.05]);
  const scene1X = useTransform(smoothProgress, [0, 0.35], ["5%", "-5%"]);
  const scene1Y = useTransform(smoothProgress, [0, 0.35], ["0%", "-8%"]);
  const scene1RotateY = useTransform(smoothProgress, [0, 0.35], [2, -2]);
  const scene1Opacity = useTransform(smoothProgress, [0, 0.25, 0.40], [1, 1, 0]);
  const scene1Brightness = useTransform(smoothProgress, [0, 0.35], [1.05, 0.95]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Salle de traitement - Fauteuil (30% - 70%)
  // Vue d'ensemble, environnement moderne
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.30, 0.50, 0.70], [1.5, 1.25, 1.08]);
  const scene2X = useTransform(smoothProgress, [0.30, 0.50, 0.70], ["-8%", "0%", "6%"]);
  const scene2Y = useTransform(smoothProgress, [0.30, 0.50, 0.70], ["10%", "0%", "-8%"]);
  const scene2RotateY = useTransform(smoothProgress, [0.30, 0.70], [-2, 2]);
  const scene2RotateX = useTransform(smoothProgress, [0.30, 0.70], [1, -1]);
  const scene2Opacity = useTransform(smoothProgress, [0.28, 0.38, 0.62, 0.75], [0, 1, 1, 0]);
  const scene2Brightness = useTransform(smoothProgress, [0.30, 0.70], [1.02, 0.98]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante - Perspective unique (65% - 100%)
  // Angle artistique, conclusion impactante
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.65, 0.82, 1], [1.45, 1.2, 1]);
  const scene3X = useTransform(smoothProgress, [0.65, 0.82, 1], ["6%", "-2%", "-4%"]);
  const scene3Y = useTransform(smoothProgress, [0.65, 0.82, 1], ["12%", "2%", "-3%"]);
  const scene3RotateY = useTransform(smoothProgress, [0.65, 1], [1.5, -0.5]);
  const scene3RotateX = useTransform(smoothProgress, [0.65, 1], [-1, 0.5]);
  const scene3Opacity = useTransform(smoothProgress, [0.62, 0.75, 1], [0, 1, 1]);
  const scene3Brightness = useTransform(smoothProgress, [0.65, 0.90, 1], [1.05, 1, 0.95]);

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
      {/* SCENE 1: Équipement dentaire - Loupes professionnelles */}
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
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroDentalEquipment}
          alt="Équipement dentaire professionnel"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene1Brightness, (b) => `brightness(${b}) saturate(1.05)`),
          }}
        />
      </motion.div>

      {/* SCENE 2: Salle de traitement - Fauteuil moderne */}
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
          src={heroDentalChair}
          alt="Salle de traitement dentaire"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene2Brightness, (b) => `brightness(${b}) saturate(1.02)`),
          }}
        />
      </motion.div>

      {/* SCENE 3: Vue plongeante - Perspective artistique */}
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
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
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
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)"
        }}
      />
    </div>
  );
}
