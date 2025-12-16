import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { HeroScene } from "./hero/HeroScene";
import { HeroContent } from "./hero/HeroContent";
import { ScrollIndicator } from "./hero/ScrollIndicator";
import heroImage from "@/assets/hero-dental.jpg";

interface HeroProps {
  backgroundImage?: string;
  backgroundVideo?: string;
  title: string;
  subtitle: string;
  badge: string;
}

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const Hero = ({ 
  title, 
  subtitle,
  badge
}: HeroProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax horizontal effects - différentes vitesses pour chaque élément
  const xOrb1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300]), { stiffness: 100, damping: 30 });
  const xOrb2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -250]), { stiffness: 80, damping: 25 });
  const xOrb3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), { stiffness: 60, damping: 20 });
  const xContent = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 100, damping: 30 });
  const x3DScene = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), { stiffness: 120, damping: 35 });
  
  // Opacité qui diminue au scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  
  // Background image parallax effects
  const bgY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), { stiffness: 50, damping: 20 });
  const bgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.15]), { stiffness: 50, damping: 20 });
  const bgRotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 5]), { stiffness: 50, damping: 20 });
  const bgBlur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 4, 12]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [0.4, 0.1]);
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background image with rotation and blur */}
      <motion.div
        className="absolute inset-0 -inset-x-20 -inset-y-20"
        style={{
          y: bgY,
          scale: bgScale,
          rotate: bgRotate,
          opacity: bgOpacity,
        }}
      >
        <motion.img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: useTransform(bgBlur, (value) => `blur(${value}px)`),
          }}
        />
      </motion.div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Animated gradient orbs with horizontal parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          style={{ x: xOrb1, opacity }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl"
          style={{ x: xOrb2, opacity }}
          animate={{
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
          style={{ x: xOrb3, opacity }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Additional decorative elements for enhanced parallax */}
        <motion.div
          className="absolute top-20 left-1/4 w-2 h-2 rounded-full bg-primary/40"
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-primary/30"
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, -180]) }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-primary/50"
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, 250]) }}
        />
      </div>
      
      {/* 3D Scene with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ x: x3DScene }}
      >
        <HeroScene />
      </motion.div>
      
      {/* Content overlay with subtle parallax */}
      <motion.div 
        className="relative z-10 w-full"
        style={{ x: xContent }}
      >
        <HeroContent 
          onBookClick={() => scrollToSection('booking')}
          onContactClick={() => scrollToSection('contact')}
        />
      </motion.div>
      
      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
};
