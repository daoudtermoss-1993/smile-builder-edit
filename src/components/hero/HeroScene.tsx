import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence avec whip pan
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring très rapide pour whip pan dramatique
  const whipProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 18,
    restDelta: 0.0001
  });

  // Spring fluide pour autres effets
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Fauteuil dentaire (0% - 28%) - Sort vers le haut
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.28], [1.0, 1.0]);
  const scene1X = useTransform(smoothProgress, [0, 0.28], ["0%", "0%"]);
  const scene1Y = useTransform(whipProgress, [0.12, 0.25], ["0%", "-100%"]); // Sort vers le HAUT
  const scene1Opacity = useTransform(smoothProgress, [0, 0.15, 0.28], [1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Équipement dentaire (22% - 58%) - Transition verticale rapide
  // Entre du bas, sort vers le haut
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.18, 0.58], [1.0, 1.0]);
  const scene2X = useTransform(smoothProgress, [0.18, 0.58], ["0%", "0%"]);
  const scene2Y = useTransform(whipProgress, [0.12, 0.22, 0.42, 0.52], ["100%", "0%", "0%", "-100%"]);
  const scene2Opacity = useTransform(smoothProgress, [0.15, 0.22, 0.48, 0.55], [0, 1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (48% - 100%) - Entre du bas dramatique
  // Photo prise du haut - whip pan vertical élégant
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.45, 1], [1.0, 1.0]);
  const scene3X = useTransform(smoothProgress, [0.45, 1], ["0%", "0%"]);
  const scene3Y = useTransform(whipProgress, [0.42, 0.55], ["100%", "0%"]); // Entre du BAS
  const scene3Opacity = useTransform(smoothProgress, [0.42, 0.55, 1], [0, 1, 1]);
  
  // Effet lignes cinématique - Rapide et intense
  const linesIntensity = useTransform(whipProgress, [0.10, 0.18, 0.25, 0.40, 0.48, 0.56], [0, 1, 0, 0, 1, 0]);
  
  // Flash blanc subtil pendant transitions
  const flashIntensity = useTransform(whipProgress, [0.14, 0.19, 0.24, 0.44, 0.50, 0.54], [0, 0.3, 0, 0, 0.3, 0]);

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

      {/* Flash blanc subtil pendant transitions */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: flashIntensity,
          background: "white",
        }}
      />

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
