import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence cinématique élégante
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring fluide pour effet "caméra qui tombe"
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Équipement dentaire (0% - 40%)
  // Monte et sort par le haut, révèle image 2 en dessous
  // ═══════════════════════════════════════════════════════════════
  const scene1Y = useTransform(smoothProgress, [0, 0.40], ["0%", "-100%"]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Fauteuil dentaire (35% - 75%)
  // Fixe derrière image 1, puis monte pour révéler image 3
  // ═══════════════════════════════════════════════════════════════
  const scene2Y = useTransform(smoothProgress, [0.35, 0.75], ["0%", "-100%"]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (70% - 100%)
  // Fixe tout en arrière, révélée quand image 2 sort
  // ═══════════════════════════════════════════════════════════════
  const scene3Y = useTransform(smoothProgress, [0.70, 1], ["0%", "0%"]); // Reste fixe

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
      {/* SCENE 3: Vue plongeante - Tout en arrière (z-index le plus bas) */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <img
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SCENE 2: Fauteuil dentaire - Au milieu (z-index moyen) */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene2Y,
          zIndex: 2,
        }}
      >
        <img
          src={heroDentalChair}
          alt="Fauteuil dentaire moderne"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SCENE 1: Équipement dentaire - Au premier plan (z-index le plus haut) */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene1Y,
          zIndex: 3,
        }}
      >
        <img
          src={heroDentalEquipment}
          alt="Équipement dentaire professionnel"
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