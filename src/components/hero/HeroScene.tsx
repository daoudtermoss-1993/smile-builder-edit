import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import drYousifHero from "@/assets/dr-yousif-hero.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Smooth spring for all animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Camera movements - pan across the image like a cinematic camera
  const x = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], ["0%", "20%", "-15%", "10%", "0%"]);
  const y = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], ["0%", "-10%", "15%", "-20%", "-30%"]);
  
  // Zoom effect - start zoomed in on detail, zoom out as scroll
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [2, 1.5, 1.2, 1]);
  
  // 3D rotation for depth perception
  const rotateZ = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [0, -3, 2, -1]);
  const rotateY = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [8, 0, -6, 3]);
  const rotateX = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [-5, 0, 4, -2]);
  
  // Dynamic filters for atmosphere
  const brightness = useTransform(smoothProgress, [0, 0.5, 1], [1.15, 1, 0.85]);
  const blur = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 0, 0, 2]);

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
      {/* Deep background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Main photo with 3D camera effect */}
      <motion.div
        className="absolute w-[200%] h-[200%]"
        style={{
          top: "-50%",
          left: "-50%",
          x,
          y,
          scale,
          rotateZ,
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        <motion.img
          src={drYousifHero}
          alt="Dr. Yousif German"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(
              [brightness, blur],
              ([b, bl]) => `brightness(${b}) blur(${bl}px)`
            ),
          }}
        />
      </motion.div>

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
      
      {/* Vignette for cinematic feel */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, hsl(var(--background) / 0.7) 100%)"
        }}
      />

      {/* Subtle animated grain for film effect */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
