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
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 8,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => {
        const yOffset = scrollProgress * 150 * (particle.size / 4);
        const xDrift = Math.sin(scrollProgress * Math.PI * 3 + particle.delay) * 20;
        
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
              boxShadow: `0 0 ${particle.size * 3}px rgba(255,255,255,${particle.opacity * 0.6})`,
            }}
            animate={{
              y: [-30 - yOffset, 30 - yOffset, -30 - yOffset],
              x: [xDrift - 15, xDrift + 15, xDrift - 15],
              opacity: [particle.opacity * 0.4, particle.opacity, particle.opacity * 0.4],
              scale: [0.7, 1.3, 0.7],
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
  const [docHeight, setDocHeight] = useState(5000);

  useEffect(() => {
    const update = () => {
      setVh(window.innerHeight || 800);
      setDocHeight(document.documentElement.scrollHeight || 5000);
    };
    update();
    window.addEventListener("resize", update);
    // Update on scroll to catch dynamic content
    const scrollUpdate = () => {
      const newHeight = document.documentElement.scrollHeight;
      if (newHeight !== docHeight) setDocHeight(newHeight);
    };
    window.addEventListener("scroll", scrollUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", scrollUpdate);
    };
  }, [docHeight]);

  // Smooth camera-like motion (Mont-fort style)
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  });

  // Travel covers entire document for full-site background
  const travel = docHeight - vh;

  // Camera moves through all 3 images across the entire site scroll
  const cameraY = useTransform(smoothScrollY, [0, travel], [0, -vh * 2.5], {
    clamp: true,
  });

  // Global "dolly" zoom effect (cinematic pull-back)
  const globalScale = useTransform(smoothScrollY, [0, travel * 0.5, travel], [1.15, 1.05, 1], {
    clamp: true,
  });

  // === SCENE 1: First third of scroll ===
  const scene1End = travel * 0.35;
  const scene1Opacity = useTransform(smoothScrollY, [0, scene1End * 0.7, scene1End], [1, 1, 0], {
    clamp: true,
  });
  const scene1Blur = useTransform(
    smoothScrollY,
    [scene1End * 0.6, scene1End],
    ["blur(0px)", "blur(12px)"],
    { clamp: true }
  );

  // === SCENE 2 & 3: Combined cinematic zone ===
  const scene2Start = travel * 0.25;
  const scene2Mid = travel * 0.5;
  const scene2End = travel * 0.75;

  // Scene 2 fades in, peaks, then fades for scene 3
  const scene2Opacity = useTransform(
    smoothScrollY,
    [scene2Start, scene2Start + travel * 0.1, scene2Mid, scene2End],
    [0, 1, 1, 0.2],
    { clamp: true }
  );
  const scene2Blur = useTransform(
    smoothScrollY,
    [scene2Mid, scene2End],
    ["blur(0px)", "blur(10px)"],
    { clamp: true }
  );
  const scene2Scale = useTransform(
    smoothScrollY,
    [scene2Start, scene2End],
    [1.1, 0.95],
    { clamp: true }
  );

  // Scene 3 emerges from scene 2
  const scene3Start = travel * 0.45;
  const scene3Opacity = useTransform(
    smoothScrollY,
    [scene3Start, scene3Start + travel * 0.15, travel],
    [0, 0.6, 1],
    { clamp: true }
  );
  const scene3Blur = useTransform(
    smoothScrollY,
    [scene3Start, scene3Start + travel * 0.2],
    ["blur(8px)", "blur(0px)"],
    { clamp: true }
  );
  const scene3Scale = useTransform(
    smoothScrollY,
    [scene3Start, travel],
    [1.15, 1],
    { clamp: true }
  );

  // === CINEMATIC EFFECTS ===
  // Light rays intensity grows through scroll
  const raysOpacity = useTransform(smoothScrollY, [0, travel * 0.3, travel], [0.04, 0.2, 0.35], {
    clamp: true,
  });

  // White flash at transition points (Mont-fort style)
  const flash1Peak = scene1End * 0.85;
  const flash1Opacity = useTransform(
    smoothScrollY,
    [flash1Peak - travel * 0.08, flash1Peak, flash1Peak + travel * 0.08],
    [0, 0.2, 0],
    { clamp: true }
  );

  const flash2Peak = scene2Mid;
  const flash2Opacity = useTransform(
    smoothScrollY,
    [flash2Peak - travel * 0.06, flash2Peak, flash2Peak + travel * 0.06],
    [0, 0.15, 0],
    { clamp: true }
  );

  const flash3Peak = travel * 0.7;
  const flash3Opacity = useTransform(
    smoothScrollY,
    [flash3Peak - travel * 0.05, flash3Peak, flash3Peak + travel * 0.05],
    [0, 0.12, 0],
    { clamp: true }
  );

  // Scroll progress for particles
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
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="absolute left-0 top-0 w-full will-change-transform"
        style={{
          y: cameraY,
          height: `${vh * 3.5}px`,
        }}
      >
        {/* Scene 1 - Equipment (top layer initially) */}
        <motion.div
          className="absolute left-0 top-0 w-full overflow-hidden"
          style={{ 
            height: `${vh * 1.4}px`, 
            opacity: scene1Opacity,
            zIndex: 3,
          }}
        >
          <motion.img
            src={heroDentalEquipment}
            alt="Équipement dentaire professionnel"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
            style={{ 
              scale: globalScale,
              filter: scene1Blur,
            }}
          />
          {/* Soft gradient fade */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full"
            style={{
              height: "50%",
              background: "linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.6) 70%, hsl(var(--background)) 100%)",
            }}
          />
        </motion.div>

        {/* Combined Zone: Scenes 2 + 3 blended */}
        <div
          className="absolute left-0 w-full"
          style={{ 
            top: `${vh * 0.8}px`, 
            height: `${vh * 2.7}px`,
            zIndex: 2,
          }}
        >
          {/* Scene 3 (back layer - revealed progressively) */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: scene3Opacity }}
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

          {/* Scene 2 (front layer - fades to reveal scene 3) */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: scene2Opacity }}
          >
            <motion.img
              src={heroDentalChair}
              alt="Fauteuil dentaire moderne"
              className="h-full w-full select-none object-cover"
              draggable={false}
              loading="eager"
              decoding="async"
              style={{
                scale: scene2Scale,
                filter: scene2Blur,
              }}
            />
            {/* Radial blend for seamless transition */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center 55%, transparent 35%, hsl(var(--background) / 0.5) 100%)",
              }}
            />
          </motion.div>

          {/* Cinematic light streaks during blend */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: flash2Opacity,
              background: "linear-gradient(175deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%)",
            }}
          />
        </div>
      </motion.div>

      {/* Light rays overlay (full screen, fixed) */}
      <motion.img
        src={heroLightRays}
        alt="Effet de rayons lumineux cinématique"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover mix-blend-screen"
        draggable={false}
        loading="eager"
        decoding="async"
        style={{ opacity: raysOpacity }}
      />

      {/* Atmospheric haze */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: raysOpacity,
          background:
            "radial-gradient(ellipse at 60% 25%, hsl(var(--background) / 0.25) 0%, transparent 60%)",
        }}
      />

      {/* White flash transitions */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: flash1Opacity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: flash2Opacity }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{ opacity: flash3Opacity }}
      />

      {/* Floating light particles */}
      <FloatingParticles scrollProgress={particleProgress} />

      {/* Film grain texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.18,
          backgroundImage:
            "repeating-linear-gradient(0deg, hsl(var(--foreground) / 0.04) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, hsl(var(--foreground) / 0.025) 0 1px, transparent 1px 5px)",
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 48%, hsl(var(--foreground) / 0.22) 100%)",
        }}
      />
    </div>
  );
}
