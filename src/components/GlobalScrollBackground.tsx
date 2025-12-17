import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import doctorImage from "@/assets/dr-yousif-hero.jpg";

export const GlobalScrollBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollYProgress } = useScroll();
  
  // Smooth spring for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Doctor image parallax - moves and scales with scroll
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3]);
  const imgX = useTransform(scrollYProgress, 
    [0, 0.15, 0.30, 0.45, 0.60, 0.75, 1], 
    isMobile 
      ? [0, 50, -50, 80, -60, 40, 0]
      : [0, 150, -200, 250, -180, 120, 0]
  );
  const imgRotate = useTransform(scrollYProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    [0, 2, -2, 3, 0]
  );
  
  // Blur and opacity for depth
  const imgBlur = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 3, 5]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0.4]);
  
  // Fog/mist layers
  const fog1Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const fog2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.3, 0.6, 0.4]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-montfort-bg"
    >
      {/* Base gradient background - mont-fort style */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100/80 to-white" />
      
      {/* Atmospheric mist layer - top */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none"
        style={{
          y: fog1Y,
          opacity: fogOpacity,
          background: 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(248,250,252,0.5) 50%, transparent 100%)',
        }}
      />
      
      {/* Doctor image - focal point that moves between sections */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          y: imgY,
          x: imgX,
          scale: imgScale,
          rotate: imgRotate,
          opacity: imgOpacity,
        }}
      >
        <motion.div 
          className="relative"
          style={{
            filter: useTransform(imgBlur, (value) => `blur(${value}px)`),
          }}
        >
          {/* Glowing backdrop for doctor image */}
          <div className="absolute -inset-20 bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
          
          {/* Doctor image with mask effect */}
          <motion.img
            src={doctorImage}
            alt="Dr. Yousif German"
            className="relative w-[300px] md:w-[450px] lg:w-[550px] h-auto object-contain drop-shadow-2xl"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Atmospheric mist layer - bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none"
        style={{
          y: fog2Y,
          opacity: fogOpacity,
          background: 'linear-gradient(0deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.6) 40%, transparent 100%)',
        }}
      />
      
      {/* Subtle gradient orbs for depth */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ 
          background: 'radial-gradient(circle, hsl(180 100% 35% / 0.15), transparent 70%)',
          x: useTransform(scrollYProgress, [0, 1], [0, 150]),
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
        style={{ 
          background: 'radial-gradient(circle, hsl(180 80% 40% / 0.1), transparent 70%)',
          x: useTransform(scrollYProgress, [0, 1], [0, -100]),
        }}
      />
      
      {/* Noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};