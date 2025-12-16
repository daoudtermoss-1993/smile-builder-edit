import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
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
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const xContent = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 100, damping: 30 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Content overlay - positioned to the left to complement the 3D object on right */}
      <motion.div 
        className="relative z-10 w-full"
        style={{ 
          x: xContent,
          opacity: contentOpacity
        }}
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
