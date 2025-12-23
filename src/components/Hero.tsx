import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroContent } from "./hero/HeroContent";
import { ScrollIndicator } from "./hero/ScrollIndicator";

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
  const [vh, setVh] = useState(800);
  
  useEffect(() => {
    const update = () => setVh(window.innerHeight || 800);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollY } = useScroll();
  
  // Smooth scroll for synchronized animation with HeroScene
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 85,
    damping: 28,
    restDelta: 0.001,
  });
  
  // Content fades out during scene 1 only (first ~1.5vh of scroll)
  const fadeOutEnd = vh * 1.2;
  const opacity = useTransform(smoothScrollY, [0, fadeOutEnd], [1, 0], { clamp: true });
  const yContent = useTransform(smoothScrollY, [0, fadeOutEnd], [0, -80], { clamp: true });
  const scale = useTransform(smoothScrollY, [0, fadeOutEnd], [1, 0.95], { clamp: true });
  
  return (
    <section 
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
      
      {/* Content overlay - synchronized with image 1 only */}
      <motion.div 
        className="relative z-10 flex-1 flex flex-col"
        style={{ opacity, y: yContent, scale }}
      >
        <HeroContent 
          onBookClick={() => scrollToSection('booking')}
          onContactClick={() => scrollToSection('contact')}
        />
      </motion.div>
      
      {/* Scroll indicator - also fades with content */}
      <motion.div style={{ opacity }}>
        <ScrollIndicator />
      </motion.div>
    </section>
  );
};
