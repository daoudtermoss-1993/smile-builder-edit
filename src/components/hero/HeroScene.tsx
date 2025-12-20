import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import heroPanorama from "@/assets/hero-panorama.jpg";
import heroLightTransition from "@/assets/hero-light-transition.jpg";
import heroExterior from "@/assets/hero-clinic-exterior.jpg";
import heroSilkTransition from "@/assets/hero-silk-transition.jpg";
import heroInterior from "@/assets/hero-clinic-interior.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Smooth spring for cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // === SCENE 1: Panorama apaisant (0% - 30%) ===
  // Effet: zoom arrière progressif avec panoramique
  const img1X = useTransform(smoothProgress, [0, 0.15, 0.3], ["0%", "12%", "25%"]);
  const img1Y = useTransform(smoothProgress, [0, 0.15, 0.3], ["0%", "-8%", "-20%"]);
  const img1Scale = useTransform(smoothProgress, [0, 0.15, 0.3], [1.6, 1.35, 1.1]);
  const img1Opacity = useTransform(smoothProgress, [0, 0.22, 0.32], [1, 1, 0]);
  const img1RotateY = useTransform(smoothProgress, [0, 0.3], [4, -2]);
  const img1RotateX = useTransform(smoothProgress, [0, 0.3], [-2, 1]);

  // === TRANSITION 1: Lumière éclatante (25% - 42%) ===
  // Représente le sourire lumineux, la pureté dentaire
  const light1Opacity = useTransform(smoothProgress, [0.22, 0.3, 0.38, 0.45], [0, 1, 1, 0]);
  const light1Scale = useTransform(smoothProgress, [0.22, 0.35, 0.45], [1.4, 1.15, 1]);
  const light1Y = useTransform(smoothProgress, [0.22, 0.45], ["15%", "-25%"]);
  const light1Brightness = useTransform(smoothProgress, [0.22, 0.35, 0.45], [0.9, 1.3, 1.1]);

  // === SCENE 2: Clinique extérieur (38% - 65%) ===
  // L'arrivée à la clinique moderne
  const img2X = useTransform(smoothProgress, [0.38, 0.52, 0.65], ["-15%", "0%", "18%"]);
  const img2Y = useTransform(smoothProgress, [0.38, 0.52, 0.65], ["12%", "0%", "-15%"]);
  const img2Scale = useTransform(smoothProgress, [0.38, 0.52, 0.65], [1.5, 1.25, 1.1]);
  const img2Opacity = useTransform(smoothProgress, [0.35, 0.42, 0.58, 0.68], [0, 1, 1, 0]);
  const img2RotateY = useTransform(smoothProgress, [0.38, 0.65], [-4, 4]);
  const img2RotateX = useTransform(smoothProgress, [0.38, 0.65], [2, -1]);

  // === TRANSITION 2: Soie fluide (60% - 78%) ===
  // Représente le confort, l'élégance, l'accueil premium
  const silk2Opacity = useTransform(smoothProgress, [0.58, 0.66, 0.74, 0.82], [0, 1, 1, 0]);
  const silk2Scale = useTransform(smoothProgress, [0.58, 0.7, 0.82], [1.3, 1.1, 0.95]);
  const silk2Y = useTransform(smoothProgress, [0.58, 0.82], ["20%", "-18%"]);
  const silk2X = useTransform(smoothProgress, [0.58, 0.82], ["-8%", "8%"]);
  const silk2Rotate = useTransform(smoothProgress, [0.58, 0.82], [-2, 2]);

  // === SCENE 3: Clinique intérieur (72% - 100%) ===
  // L'expérience de soin premium
  const img3X = useTransform(smoothProgress, [0.72, 0.86, 1], ["10%", "-3%", "-12%"]);
  const img3Y = useTransform(smoothProgress, [0.72, 0.86, 1], ["12%", "0%", "-8%"]);
  const img3Scale = useTransform(smoothProgress, [0.72, 0.86, 1], [1.45, 1.18, 1]);
  const img3Opacity = useTransform(smoothProgress, [0.7, 0.78, 1], [0, 1, 1]);
  const img3RotateY = useTransform(smoothProgress, [0.72, 1], [3, -1]);
  const img3RotateX = useTransform(smoothProgress, [0.72, 1], [-1, 0.5]);

  // Effets de luminosité dynamiques
  const brightness1 = useTransform(smoothProgress, [0, 0.3], [1.08, 0.92]);
  const brightness2 = useTransform(smoothProgress, [0.38, 0.65], [1.1, 0.95]);
  const brightness3 = useTransform(smoothProgress, [0.72, 1], [1.08, 0.88]);
  const blur3 = useTransform(smoothProgress, [0.92, 1], [0, 2.5]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
        perspective: "2000px",
        perspectiveOrigin: "50% 50%"
      }}
    >
      {/* SCENE 1: Panorama apaisant - Premier contact visuel */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: img1X,
          y: img1Y,
          scale: img1Scale,
          opacity: img1Opacity,
          rotateY: img1RotateY,
          rotateX: img1RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroPanorama}
          alt="Atmosphère apaisante"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(brightness1, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* TRANSITION 1: Lumière éclatante - Sourire lumineux */}
      <motion.div
        className="absolute w-[180%] h-[180%]"
        style={{
          top: "-40%",
          left: "-40%",
          y: light1Y,
          scale: light1Scale,
          opacity: light1Opacity,
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroLightTransition}
          alt="Transition lumineuse"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(light1Brightness, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* SCENE 2: Clinique extérieur - L'arrivée */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: img2X,
          y: img2Y,
          scale: img2Scale,
          opacity: img2Opacity,
          rotateY: img2RotateY,
          rotateX: img2RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroExterior}
          alt="Clinique dentaire extérieur"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(brightness2, (b) => `brightness(${b})`),
          }}
        />
      </motion.div>

      {/* TRANSITION 2: Soie fluide - Confort & Élégance */}
      <motion.div
        className="absolute w-[170%] h-[170%]"
        style={{
          top: "-35%",
          left: "-35%",
          x: silk2X,
          y: silk2Y,
          scale: silk2Scale,
          opacity: silk2Opacity,
          rotate: silk2Rotate,
          transformOrigin: "center center",
        }}
      >
        <img
          src={heroSilkTransition}
          alt="Transition élégante"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.05)" }}
        />
      </motion.div>

      {/* SCENE 3: Clinique intérieur - L'expérience premium */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x: img3X,
          y: img3Y,
          scale: img3Scale,
          opacity: img3Opacity,
          rotateY: img3RotateY,
          rotateX: img3RotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={heroInterior}
          alt="Clinique dentaire intérieur"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(
              [brightness3, blur3],
              ([b, bl]) => `brightness(${b}) blur(${bl}px)`
            ),
          }}
        />
      </motion.div>

      {/* Vignette subtile pour la profondeur */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.12) 100%)"
        }}
      />
    </div>
  );
}
