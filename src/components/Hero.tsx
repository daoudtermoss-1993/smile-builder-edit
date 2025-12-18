import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
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
  
  // Opacity fade as user scrolls
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
      
      {/* Content overlay */}
      <motion.div 
        className="relative z-10 w-full"
        style={{ opacity, y: yContent }}
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
