import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Images dentaires - Séquence style Mont-fort
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
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

  const travel = vh * 2; // 3 scenes stacked -> 2vh travel

  // Base camera translation
  const cameraY = useTransform(smoothScrollY, [0, travel], [0, -travel], {
    clamp: true,
  });

  // Global “dolly” feeling (subtle zoom out as you scroll)
  const globalScale = useTransform(smoothScrollY, [0, travel], [1.06, 1], {
    clamp: true,
  });

  // Cinematic transition specifically between scene 2 and 3
  const t23Start = vh * 1.05;
  const t23End = vh * 1.85;

  const scene2Opacity = useTransform(smoothScrollY, [t23Start, t23End], [1, 0], {
    clamp: true,
  });
  const scene3Opacity = useTransform(smoothScrollY, [t23Start, t23End], [0, 1], {
    clamp: true,
  });

  const scene2Blur = useTransform(
    smoothScrollY,
    [t23Start, t23End],
    ["blur(0px)", "blur(14px)"],
    { clamp: true }
  );
  const scene3Blur = useTransform(
    smoothScrollY,
    [t23Start, t23End],
    ["blur(14px)", "blur(0px)"],
    { clamp: true }
  );

  const scene3Scale = useTransform(smoothScrollY, [t23Start, t23End], [1.14, 1], {
    clamp: true,
  });

  // Light rays + haze that grows a bit during the cinematic moment
  const raysOpacity = useTransform(smoothScrollY, [vh * 0.2, t23End], [0.06, 0.26], {
    clamp: true,
  });

  return (
    <div
      className="fixed inset-0 z-0 h-full w-full overflow-hidden bg-background"
      aria-hidden="true"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute left-0 top-0 w-full will-change-transform"
        style={{
          y: cameraY,
          height: `${vh * 3}px`,
        }}
      >
        {/* Scene 1 */}
        <div
          className="absolute left-0 top-0 w-full overflow-hidden"
          style={{ height: `${vh}px` }}
        >
          <motion.img
            src={heroDentalEquipment}
            alt="Équipement dentaire professionnel"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
            style={{ scale: globalScale }}
          />
        </div>

        {/* Scene 2 */}
        <motion.div
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: `${vh}px`, height: `${vh}px`, opacity: scene2Opacity }}
        >
          <motion.img
            src={heroDentalChair}
            alt="Fauteuil dentaire moderne"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
            style={{
              scale: globalScale,
              filter: scene2Blur,
            }}
          />
        </motion.div>

        {/* Scene 3 */}
        <motion.div
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: `${vh * 2}px`, height: `${vh}px`, opacity: scene3Opacity }}
        >
          <motion.img
            src={heroDentalTopview}
            alt="Vue plongeante clinique dentaire"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
            style={{
              scale: scene3Scale,
              filter: scene3Blur,
            }}
          />
        </motion.div>
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
