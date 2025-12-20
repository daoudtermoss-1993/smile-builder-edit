import { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Images dentaires - Séquence style Mont-fort
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";
import heroLightRays from "@/assets/hero-light-rays.jpg";

// Floating light particles component
function FloatingParticles({ scrollProgress }: { scrollProgress: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6,
      opacity: Math.random() * 0.4 + 0.2,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => {
        const yOffset = scrollProgress * 120 * (particle.size / 4);
        const xDrift = Math.sin(scrollProgress * Math.PI * 2 + particle.delay) * 15;
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, rgba(255,255,255,${particle.opacity}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255,255,255,${particle.opacity * 0.5})`,
            }}
            animate={{
              y: [-20 - yOffset, 20 - yOffset, -20 - yOffset],
              x: [xDrift - 10, xDrift + 10, xDrift - 10],
              opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

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

  const travel = vh * 2.5; // Extended travel for smoother combined zone

  // Base camera translation
  const cameraY = useTransform(smoothScrollY, [0, travel], [0, -vh * 2.2], {
    clamp: true,
  });

  // Global "dolly" feeling (subtle zoom out as you scroll)
  const globalScale = useTransform(smoothScrollY, [0, travel], [1.08, 1], {
    clamp: true,
  });

  // Transition from scene 1 to combined zone (starts at middle of scene 1)
  const t12Start = vh * 0.5;
  const t12End = vh * 1.2;

  const scene1Opacity = useTransform(smoothScrollY, [t12Start, t12End], [1, 0], {
    clamp: true,
  });

  // Combined zone 2+3: Image 2 starts visible, Image 3 fades in gradually
  // No hard edges - both images blend together
  const combinedZoneStart = vh * 0.8;
  const combinedZoneMid = vh * 1.5;
  const combinedZoneEnd = vh * 2.2;

  // Image 2 stays visible longer, then fades out smoothly
  const image2Opacity = useTransform(
    smoothScrollY,
    [combinedZoneStart, combinedZoneMid, combinedZoneEnd],
    [0, 1, 0.3],
    { clamp: true }
  );

  // Image 3 fades in from the middle of the combined zone
  const image3Opacity = useTransform(
    smoothScrollY,
    [combinedZoneMid * 0.9, combinedZoneMid, combinedZoneEnd],
    [0, 0.4, 1],
    { clamp: true }
  );

  // Subtle blur transitions for cinematic feel
  const image2Blur = useTransform(
    smoothScrollY,
    [combinedZoneMid, combinedZoneEnd],
    ["blur(0px)", "blur(8px)"],
    { clamp: true }
  );

  const image3Blur = useTransform(
    smoothScrollY,
    [combinedZoneMid * 0.9, combinedZoneMid * 1.1],
    ["blur(6px)", "blur(0px)"],
    { clamp: true }
  );

  // Scale effects for depth
  const image2Scale = useTransform(smoothScrollY, [combinedZoneStart, combinedZoneEnd], [1.05, 0.98], {
    clamp: true,
  });

  const image3Scale = useTransform(smoothScrollY, [combinedZoneMid, combinedZoneEnd], [1.12, 1], {
    clamp: true,
  });

  // Light rays + haze
  const raysOpacity = useTransform(smoothScrollY, [vh * 0.2, combinedZoneEnd], [0.05, 0.28], {
    clamp: true,
  });

  // White flash during transition peaks (more cinematic)
  const flash1Peak = (t12Start + t12End) / 2;
  const flash1Opacity = useTransform(
    smoothScrollY,
    [t12Start, flash1Peak, t12End],
    [0, 0.15, 0],
    { clamp: true }
  );

  const flash2Peak = combinedZoneMid;
  const flash2Opacity = useTransform(
    smoothScrollY,
    [combinedZoneMid * 0.85, flash2Peak, combinedZoneMid * 1.15],
    [0, 0.12, 0],
    { clamp: true }
  );

  // Scroll progress for particles (0 to 1)
  const scrollProgress = useTransform(smoothScrollY, [0, travel], [0, 1]);
  const [particleProgress, setParticleProgress] = useState(0);
  
  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => setParticleProgress(v));
    return () => unsubscribe();
  }, [scrollProgress]);

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
        {/* Scene 1 - Equipment */}
        <motion.div
          className="absolute left-0 top-0 w-full overflow-hidden"
          style={{ height: `${vh * 1.3}px`, opacity: scene1Opacity }}
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
          {/* Gradient fade to blend into combined zone */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full"
            style={{
              height: "40%",
              background: "linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 100%)",
            }}
          />
        </motion.div>

        {/* Combined Zone: Images 2 + 3 layered seamlessly */}
        <div
          className="absolute left-0 w-full"
          style={{ top: `${vh * 0.9}px`, height: `${vh * 2.1}px` }}
        >
          {/* Image 3 (back layer - revealed gradually) */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: image3Opacity }}
          >
            <motion.img
              src={heroDentalTopview}
              alt="Vue plongeante clinique dentaire"
              className="h-full w-full select-none object-cover"
              draggable={false}
              loading="eager"
              decoding="async"
              style={{
                scale: image3Scale,
                filter: image3Blur,
              }}
            />
          </motion.div>

          {/* Image 2 (front layer - fades out to reveal image 3) */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: image2Opacity }}
          >
            <motion.img
              src={heroDentalChair}
              alt="Fauteuil dentaire moderne"
              className="h-full w-full select-none object-cover"
              draggable={false}
              loading="eager"
              decoding="async"
              style={{
                scale: image2Scale,
                filter: image2Blur,
              }}
            />
            {/* Soft radial gradient to blend edges */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center 60%, transparent 40%, hsl(var(--background) / 0.4) 100%)",
              }}
            />
          </motion.div>

          {/* Cinematic light streaks between images */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: flash2Opacity,
              background: "linear-gradient(180deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
            }}
          />
        </div>
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

      {/* White flash during transitions */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: flash1Opacity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: flash2Opacity }}
      />

      {/* Floating light particles */}
      <FloatingParticles scrollProgress={particleProgress} />

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
