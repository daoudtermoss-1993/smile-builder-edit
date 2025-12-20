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
  // SCENE 1: Équipement dentaire (0% - 35%)
  // Glisse vers le HAUT (la caméra tombe, donc l'image monte)
  // ═══════════════════════════════════════════════════════════════
  const scene1Y = useTransform(smoothProgress, [0, 0.35], ["0%", "-100%"]); // Monte et sort par le haut
  const scene1Opacity = useTransform(smoothProgress, [0, 0.30, 0.35], [1, 1, 0.8]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Fauteuil dentaire (0% - 70%)
  // Fixe au début, puis glisse vers le haut quand révélée
  // ═══════════════════════════════════════════════════════════════
  const scene2Y = useTransform(smoothProgress, [0.30, 0.70], ["0%", "-100%"]); // Monte et sort
  const scene2Opacity = useTransform(smoothProgress, [0.28, 0.35, 0.65, 0.70], [0, 1, 1, 0.8]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (60% - 100%)
  // Fixe, révélée quand image 2 sort
  // ═══════════════════════════════════════════════════════════════
  const scene3Y = useTransform(smoothProgress, [0.65, 1], ["0%", "0%"]); // Reste en place
  const scene3Opacity = useTransform(smoothProgress, [0.60, 0.72, 1], [0, 1, 1]);

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
      {/* SCENE 3: Vue plongeante - En arrière-plan, révélée en dernier */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene3Y,
          opacity: scene3Opacity,
        }}
      >
        <img
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SCENE 2: Fauteuil dentaire - Au milieu, révélée après scene 1 */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene2Y,
          opacity: scene2Opacity,
        }}
      >
        <img
          src={heroDentalChair}
          alt="Fauteuil dentaire moderne"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* SCENE 1: Équipement dentaire - Au premier plan, part en premier */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          y: scene1Y,
          opacity: scene1Opacity,
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