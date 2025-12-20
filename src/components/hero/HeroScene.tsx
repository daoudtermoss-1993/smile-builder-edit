import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Images dentaires - Séquence cinématique
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Spring ultra-rapide pour whip pan cinématique (comme dans les films)
  const whipProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 15,
    restDelta: 0.0001
  });

  // Spring fluide pour effets secondaires
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.0001
  });

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Fauteuil dentaire (0% - 25%) - Sort vers le haut RAPIDE
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.25], [1.0, 1.0]);
  const scene1X = useTransform(smoothProgress, [0, 0.25], ["0%", "0%"]);
  const scene1Y = useTransform(whipProgress, [0.10, 0.20], ["0%", "-100%"]);
  const scene1Opacity = useTransform(smoothProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const scene1Blur = useTransform(whipProgress, [0.10, 0.15, 0.20], [0, 25, 0]); // Motion blur vertical

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Équipement dentaire (18% - 55%) - Transition ultra-rapide
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.15, 0.55], [1.0, 1.0]);
  const scene2X = useTransform(smoothProgress, [0.15, 0.55], ["0%", "0%"]);
  const scene2Y = useTransform(whipProgress, [0.10, 0.18, 0.40, 0.48], ["100%", "0%", "0%", "-100%"]);
  const scene2Opacity = useTransform(smoothProgress, [0.12, 0.18, 0.45, 0.52], [0, 1, 1, 0]);
  const scene2Blur = useTransform(whipProgress, [0.10, 0.14, 0.18, 0.40, 0.44, 0.48], [25, 8, 0, 0, 8, 25]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (45% - 100%) - Entrée dramatique
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.42, 1], [1.0, 1.0]);
  const scene3X = useTransform(smoothProgress, [0.42, 1], ["0%", "0%"]);
  const scene3Y = useTransform(whipProgress, [0.40, 0.50], ["100%", "0%"]);
  const scene3Opacity = useTransform(smoothProgress, [0.40, 0.50, 1], [0, 1, 1]);
  const scene3Blur = useTransform(whipProgress, [0.40, 0.45, 0.50], [25, 8, 0]);

  // ═══════════════════════════════════════════════════════════════
  // EFFETS CINÉMATIQUES PROFESSIONNELS
  // ═══════════════════════════════════════════════════════════════
  
  // Flash blanc intense - timing serré comme dans les films
  const flashIntensity = useTransform(whipProgress, 
    [0.12, 0.15, 0.18, 0.42, 0.45, 0.48], 
    [0, 1, 0, 0, 1, 0]
  );
  const flashY = useTransform(whipProgress, 
    [0.12, 0.18, 0.42, 0.48], 
    ["100%", "-100%", "100%", "-100%"]
  );

  // Lignes de vitesse cinématiques (speed lines)
  const speedLinesIntensity = useTransform(whipProgress, 
    [0.11, 0.14, 0.19, 0.41, 0.44, 0.49], 
    [0, 1, 0, 0, 1, 0]
  );

  // Effet de compression verticale (stretch effect cinématique)
  const stretchY = useTransform(whipProgress,
    [0.12, 0.15, 0.18, 0.42, 0.45, 0.48],
    [1, 1.15, 1, 1, 1.15, 1]
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
      }}
    >
      {/* SCENE 1: Fauteuil dentaire */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          x: scene1X,
          y: scene1Y,
          scale: scene1Scale,
          scaleY: stretchY,
          opacity: scene1Opacity,
        }}
      >
        <motion.img
          src={heroDentalChair}
          alt="Fauteuil dentaire moderne"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene1Blur, (b) => `blur(${b}px) brightness(1.02)`),
          }}
        />
      </motion.div>

      {/* SCENE 2: Équipement dentaire */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          x: scene2X,
          y: scene2Y,
          scale: scene2Scale,
          scaleY: stretchY,
          opacity: scene2Opacity,
        }}
      >
        <motion.img
          src={heroDentalEquipment}
          alt="Équipement dentaire professionnel"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene2Blur, (b) => `blur(${b}px) brightness(1.02)`),
          }}
        />
      </motion.div>

      {/* SCENE 3: Vue plongeante */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          x: scene3X,
          y: scene3Y,
          scale: scene3Scale,
          scaleY: stretchY,
          opacity: scene3Opacity,
        }}
      >
        <motion.img
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(scene3Blur, (b) => `blur(${b}px) brightness(1.02)`),
          }}
        />
      </motion.div>

      {/* Flash blanc cinématique - monte rapidement */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: flashIntensity,
          y: flashY,
          background: "linear-gradient(to top, white 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.6) 60%, transparent 100%)",
        }}
      />

      {/* Speed lines verticales - effet cinématique */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: speedLinesIntensity,
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            rgba(255,255,255,0.5) 1px,
            rgba(255,255,255,0.5) 3px,
            transparent 3px,
            transparent 8px
          )`,
        }}
      />

      {/* Bandes noires cinématiques (letterbox subtil) */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[3%] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
          opacity: useTransform(smoothProgress, [0, 0.1], [0.5, 1]),
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[3%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          opacity: useTransform(smoothProgress, [0, 0.1], [0.5, 1]),
        }}
      />

      {/* Vignette cinématique */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)"
        }}
      />
    </div>
  );
}