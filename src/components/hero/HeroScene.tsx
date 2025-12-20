import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence avec whip pan
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring rapide pour whip pan effect
  const whipProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.0001
  });

  // Spring fluide pour autres transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Fauteuil dentaire (0% - 30%) - Sort vers le bas
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.30], [1.0, 1.0]);
  const scene1X = useTransform(smoothProgress, [0, 0.30], ["0%", "0%"]);
  const scene1Y = useTransform(whipProgress, [0.15, 0.35], ["0%", "100%"]); // Sort vers le bas
  const scene1Opacity = useTransform(smoothProgress, [0, 0.20, 0.38], [1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Équipement dentaire (25% - 60%) - Transition verticale
  // Entre du haut, sort vers le bas
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.20, 0.60], [1.0, 1.0]);
  const scene2X = useTransform(smoothProgress, [0.20, 0.60], ["0%", "0%"]);
  const scene2Y = useTransform(whipProgress, [0.15, 0.32, 0.48, 0.65], ["-100%", "0%", "0%", "100%"]);
  const scene2Opacity = useTransform(smoothProgress, [0.18, 0.30, 0.55, 0.68], [0, 1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (55% - 100%) - Entre du haut
  // Photo prise du haut - transition verticale élégante
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.50, 1], [1.0, 1.0]);
  const scene3X = useTransform(smoothProgress, [0.50, 1], ["0%", "0%"]);
  const scene3Y = useTransform(whipProgress, [0.50, 0.70], ["-100%", "0%"]); // Entre du haut
  const scene3Opacity = useTransform(smoothProgress, [0.50, 0.65, 1], [0, 1, 1]);
  
  // Effet lignes cinématique - Plus visible et intense
  const linesIntensity = useTransform(whipProgress, [0.12, 0.22, 0.35, 0.45, 0.55, 0.70], [0, 1, 0, 0, 1, 0]);

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
      {/* SCENE 1: Fauteuil dentaire - Point de départ */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          x: scene1X,
          y: scene1Y,
          scale: scene1Scale,
          opacity: scene1Opacity,
        }}
      >
        <motion.img
          src={heroDentalChair}
          alt="Fauteuil dentaire moderne"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(1.02)",
          }}
        />
      </motion.div>

      {/* SCENE 2: Équipement dentaire - Transition verticale */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          x: scene2X,
          y: scene2Y,
          scale: scene2Scale,
          opacity: scene2Opacity,
        }}
      >
        <motion.img
          src={heroDentalEquipment}
          alt="Équipement dentaire professionnel"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(1.02)",
          }}
        />
      </motion.div>

      {/* SCENE 3: Vue plongeante - Entre du haut */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          x: scene3X,
          y: scene3Y,
          scale: scene3Scale,
          opacity: scene3Opacity,
        }}
      >
        <motion.img
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(1.02)",
          }}
        />
      </motion.div>

      {/* Effet lignes cinématique - Très visible pendant transitions */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: linesIntensity,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.25) 2px,
            rgba(255,255,255,0.25) 4px
          )`,
          mixBlendMode: "overlay",
        }}
      />

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
