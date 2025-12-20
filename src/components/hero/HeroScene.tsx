import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence cinématique élégante
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring fluide pour effet cinématique élégant (style Mont-fort)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Fauteuil dentaire (0% - 40%)
  // Parallaxe subtil + crossfade élégant
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.40], [1.0, 1.08]); // Zoom très léger
  const scene1Y = useTransform(smoothProgress, [0, 0.40], ["0%", "-15%"]); // Parallaxe vers le haut
  const scene1Opacity = useTransform(smoothProgress, [0, 0.25, 0.40], [1, 1, 0]); // Crossfade doux

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Équipement dentaire (30% - 70%)
  // Fondu enchaîné + parallaxe
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.25, 0.70], [1.0, 1.08]);
  const scene2Y = useTransform(smoothProgress, [0.25, 0.70], ["10%", "-15%"]); // Entre légèrement du bas
  const scene2Opacity = useTransform(smoothProgress, [0.25, 0.38, 0.55, 0.70], [0, 1, 1, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (60% - 100%)
  // Entrée élégante finale
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.55, 1], [1.0, 1.05]);
  const scene3Y = useTransform(smoothProgress, [0.55, 1], ["8%", "-5%"]);
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