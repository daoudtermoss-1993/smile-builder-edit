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
  // SCENE 2: Équipement dentaire (25% - 65%) - Cinematic whip pan
  // Échelle normale, mouvement fluide cinématique
  // ═══════════════════════════════════════════════════════════════
  const scene2Scale = useTransform(smoothProgress, [0.20, 0.45, 0.65], [1.0, 1.0, 0.98]); // Reste normal
  const scene2X = useTransform(whipProgress, [0.18, 0.35, 0.52, 0.70], ["-100%", "0%", "0%", "100%"]);
  const scene2Y = useTransform(smoothProgress, [0.25, 0.65], ["0%", "-2%"]);
  const scene2Opacity = useTransform(smoothProgress, [0.20, 0.32, 0.58, 0.72], [0, 1, 1, 0]);
  const scene2Blur = useTransform(whipProgress, [0.18, 0.30, 0.35, 0.55, 0.65, 0.70], [12, 3, 0, 0, 3, 12]);

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Vue plongeante (60% - 100%) - Cinematic finale
  // Échelle normale, entrée dramatique
  // ═══════════════════════════════════════════════════════════════
  const scene3Scale = useTransform(smoothProgress, [0.58, 0.75, 1], [1.0, 1.0, 1.0]); // Reste normal
  const scene3X = useTransform(whipProgress, [0.58, 0.78, 1], ["-100%", "0%", "0%"]);
  const scene3Y = useTransform(smoothProgress, [0.65, 1], ["0%", "-1%"]);
  const scene3Opacity = useTransform(smoothProgress, [0.58, 0.75, 1], [0, 1, 1]);
  const scene3Blur = useTransform(whipProgress, [0.58, 0.70, 0.78], [12, 3, 0]);

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

      {/* SCENE 3: Vue plongeante - Transition finale */}
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
            filter: useTransform(scene3Blur, (b) => `blur(${b}px) brightness(1.02)`),
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
