import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Images dentaires - Séquence style Mont-fort
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";
import heroLightRays from "@/assets/hero-light-rays.jpg";

export function HeroScene() {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const update = () => setVh(window.innerHeight || 800);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Smooth camera-like motion
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 85,
    damping: 28,
    restDelta: 0.001,
  });

  const travel = vh * 4; // 4 screens total

  // === IMAGE 1: Stays fixed during hero section (first 1.5 screens), then moves ===
  const scene1Y = useTransform(smoothScrollY, [0, vh * 1.5, travel], [0, 0, -vh * 1.5], {
    clamp: true,
  });
  
  // Zoom out effect on image 1 during hero section
  const scene1Scale = useTransform(smoothScrollY, [0, vh * 1.5], [1.4, 1], {
    clamp: true,
  });

  // Image 1 fades out with smooth crossfade to image 2
  const scene1Opacity = useTransform(smoothScrollY, [vh * 1.3, vh * 2], [1, 0], {
    clamp: true,
  });

  // === IMAGE 2 (final): Smooth crossfade from image 1 ===
  const scene2Start = vh * 1.5;
  
  const scene2Opacity = useTransform(smoothScrollY, [scene2Start, vh * 2.2], [0, 1], {
    clamp: true,
  });
  
  const scene2Scale = useTransform(smoothScrollY, [scene2Start, travel], [1.15, 1], {
    clamp: true,
  });

  // Light rays - subtle during hero, grows after
  const raysOpacity = useTransform(smoothScrollY, [0, vh * 1.5, travel], [0.05, 0.1, 0.25], {
    clamp: true,
  });

  return (
    <div
      className="fixed inset-0 z-0 h-full w-full overflow-hidden bg-background"
      aria-hidden="true"
      style={{ perspective: 1200 }}
    >
      {/* Scene 1 - Synced with hero content */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ 
          y: scene1Y,
          opacity: scene1Opacity,
        }}
      >
        <motion.img
          src={heroDentalEquipment}
          alt="Équipement dentaire professionnel"
          className="h-full w-full select-none object-cover"
          draggable={false}
          loading="eager"
          decoding="async"
          style={{ scale: scene1Scale }}
        />
      </motion.div>

      {/* Scene 2 - Final scene */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ opacity: scene2Opacity }}
      >
        <motion.img
          src={heroDentalTopview}
          alt="Vue plongeante clinique dentaire"
          className="h-full w-full select-none object-cover"
          draggable={false}
          loading="eager"
          decoding="async"
          style={{ scale: scene2Scale }}
        />
      </motion.div>

      {/* Light rays overlay */}
      <motion.img
        src={heroLightRays}
        alt="Effet de rayons lumineux cinématique"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover mix-blend-screen"
        draggable={false}
        loading="eager"
        decoding="async"
        style={{ opacity: raysOpacity }}
      />

      {/* Soft haze */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: raysOpacity,
          background:
            "radial-gradient(ellipse at 65% 20%, hsl(var(--background) / 0.22) 0%, transparent 55%)",
        }}
      />

      {/* Film-ish grain (token-based) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.22,
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(var(--foreground) / 0.035) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, hsl(var(--foreground) / 0.02) 0 1px, transparent 1px 6px)",
        }}
      />

      {/* Vignette cinématique (tokens only) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 52%, hsl(var(--foreground) / 0.18) 100%)",
        }}
      />
    </div>
  );
}
