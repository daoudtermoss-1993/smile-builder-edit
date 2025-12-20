import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence style Mont-fort
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring fluide style Mont-fort
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 35,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // Effet "caméra qui descend" - les images sont empilées verticalement
  // et le viewport "descend" à travers elles
  // ═══════════════════════════════════════════════════════════════
  
  // Container qui se déplace vers le HAUT (simule la caméra qui descend)
  const containerY = useTransform(smoothProgress, [0, 1], ["0%", "-200%"]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
      }}
    >
      {/* Container de toutes les scènes - se déplace vers le haut */}
      <motion.div
        className="absolute w-full"
        style={{
          y: containerY,
          height: "300%", // 3 images empilées
        }}
      >
        {/* SCENE 1: Équipement dentaire - En haut */}
        <div 
          className="absolute w-full h-[33.33%] top-0 left-0 overflow-hidden"
        >
          <img
            src={heroDentalEquipment}
            alt="Équipement dentaire professionnel"
            className="w-full h-full object-cover"
          />
        </div>

        {/* SCENE 2: Fauteuil dentaire - Au milieu */}
        <div 
          className="absolute w-full h-[33.33%] top-[33.33%] left-0 overflow-hidden"
        >
          <img
            src={heroDentalChair}
            alt="Fauteuil dentaire moderne"
            className="w-full h-full object-cover"
          />
        </div>

        {/* SCENE 3: Vue plongeante - En bas */}
        <div 
          className="absolute w-full h-[33.33%] top-[66.66%] left-0 overflow-hidden"
        >
          <img
            src={heroDentalTopview}
            alt="Vue plongeante clinique dentaire"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Vignette cinématique */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)",
          zIndex: 10,
        }}
      />
    </div>
  );
}