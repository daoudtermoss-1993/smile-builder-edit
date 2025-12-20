import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import heroPanorama from "@/assets/hero-panorama.jpg";

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
          src={heroPanorama}
          alt="Dental Clinic Panorama"
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(
              [brightness, blur],
              ([b, bl]) => `brightness(${b}) blur(${bl}px)`
            ),
          }}
        />
      </motion.div>
    </div>
  );
}
