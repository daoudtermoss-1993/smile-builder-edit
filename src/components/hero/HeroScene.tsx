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
  // SCENE 1: Fauteuil dentaire (0% - 30%) - Image de départ
  // Commence à échelle normale, léger zoom out puis whip pan
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.15, 0.30], [1.1, 1.0, 0.95]); // Zoom out léger
  const scene1X = useTransform(whipProgress, [0, 0.18, 0.38], ["0%", "0%", "120%"]); // Whip pan après
  const scene1Y = useTransform(smoothProgress, [0, 0.30], ["0%", "-3%"]);
  const scene1Opacity = useTransform(smoothProgress, [0, 0.25, 0.40], [1, 1, 0]);
  const scene1Blur = useTransform(whipProgress, [0.18, 0.28, 0.38], [0, 10, 0]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Équipement dentaire (25% - 65%) - Zoom out vers normal
  // Sort vers le bas avec effet lignes
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.20, 0.45, 0.65], [1.15, 1.0, 1.0]); // Zoom out vers normal
  const scene2X = useTransform(whipProgress, [0.18, 0.35], ["-100%", "0%"]); // Whip pan entrée
  const scene2Y = useTransform(whipProgress, [0.52, 0.68], ["0%", "100%"]); // Sort vers le bas
  const scene2Opacity = useTransform(smoothProgress, [0.20, 0.32, 0.58, 0.70], [0, 1, 1, 0]);
  const scene2Blur = useTransform(whipProgress, [0.18, 0.30, 0.35], [12, 3, 0]); // Blur entrée seulement

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (60% - 100%) - Zoom out dès le début
  // Entre du haut rapidement avec effet lignes cinématique
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.55, 0.72, 1], [1.12, 1.0, 1.0]); // Zoom out vers normal
  const scene3Y = useTransform(whipProgress, [0.55, 0.72], ["-100%", "0%"]); // Entre du haut
  const scene3X = useTransform(smoothProgress, [0.55, 1], ["0%", "0%"]); // Stable horizontalement
  const scene3Opacity = useTransform(smoothProgress, [0.55, 0.68, 1], [0, 1, 1]);
  
  // Effet lignes cinématique (intensité des lignes pendant transition verticale)
  const linesIntensity = useTransform(whipProgress, [0.52, 0.60, 0.72], [0, 1, 0]);

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
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: scene1X,
          y: scene1Y,
          scale: scene1Scale,
          opacity: scene1Opacity,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
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

      {/* SCENE 2: Équipement dentaire - Whip pan depuis la gauche */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: scene2X,
          y: scene2Y,
          scale: scene2Scale,
          opacity: scene2Opacity,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
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

      {/* SCENE 3: Vue plongeante - Entre du haut */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: scene3X,
          y: scene3Y,
          scale: scene3Scale,
          opacity: scene3Opacity,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
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

      {/* Effet lignes cinématique pendant transition verticale */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: linesIntensity,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.08) 3px,
            rgba(255,255,255,0.08) 6px
          )`,
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
