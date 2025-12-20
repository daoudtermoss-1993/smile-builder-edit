import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence cinématique élégante
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring fluide pour glissement doux
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 35,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Équipement dentaire (0% - 35%)
  // Glisse vers le haut en disparaissant
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.35], [1.0, 1.0]);
  const scene1Y = useTransform(smoothProgress, [0, 0.35], ["0%", "-50%"]); // Glisse vers le haut
  const scene1Opacity = useTransform(smoothProgress, [0, 0.20, 0.35], [1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Fauteuil dentaire (25% - 65%)
  // Entre du bas, glisse vers le haut, sort vers le haut
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.20, 0.65], [1.0, 1.0]);
  const scene2Y = useTransform(smoothProgress, [0.20, 0.35, 0.50, 0.65], ["50%", "0%", "0%", "-50%"]); // Entre du bas, sort vers haut
  const scene2Opacity = useTransform(smoothProgress, [0.20, 0.32, 0.52, 0.65], [0, 1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (55% - 100%)
  // Entre du bas avec fondu
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.55, 1], [1.0, 1.0]);
  const scene3Y = useTransform(smoothProgress, [0.55, 0.75], ["50%", "0%"]); // Entre du bas
  const scene3Opacity = useTransform(smoothProgress, [0.55, 0.72, 1], [0, 1, 1]);

  // ═══════════════════════════════════════════════════════════════
  // EFFETS CINÉMATIQUES ÉLÉGANTS
  // ═══════════════════════════════════════════════════════════════
  
  // Voile lumineux subtil pendant les transitions (comme Mont-fort)
  const transitionGlow = useTransform(smoothProgress, 
    [0.30, 0.38, 0.45, 0.58, 0.68, 0.75], 
    [0, 0.15, 0, 0, 0.15, 0]
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
      }}
    >
      {/* SCENE 1: Équipement dentaire (était image 2) */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene1Y,
          scale: scene1Scale,
          opacity: scene1Opacity,
        }}
      >
        <img
          src={heroDentalEquipment}
          alt="Équipement dentaire professionnel"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SCENE 2: Fauteuil dentaire (était image 1) */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene2Y,
          scale: scene2Scale,
          opacity: scene2Opacity,
        }}
      >
        <img
          src={heroDentalChair}
          alt="Fauteuil dentaire moderne"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SCENE 3: Vue plongeante */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene3Y,
          scale: scene3Scale,
          opacity: scene3Opacity,
        }}
      >
        <img
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Voile lumineux élégant pendant transitions */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: transitionGlow,
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Vignette cinématique élégante */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)"
        }}
      />
    </div>
  );
}