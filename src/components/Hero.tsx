import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

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
  const { language } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Content - Mont-fort style centered minimal */}
      <motion.div 
        className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center"
        style={{ 
          opacity: contentOpacity,
          y: contentY
        }}
      >
        {/* Logo/Brand mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto opacity-60"
          >
            <circle cx="24" cy="24" r="20" stroke="hsl(180, 100%, 35%)" strokeWidth="0.5" fill="none" />
            <circle cx="24" cy="12" r="2" fill="hsl(180, 100%, 35%)" opacity="0.6" />
            <circle cx="16" cy="18" r="1.5" fill="hsl(180, 100%, 35%)" opacity="0.4" />
            <circle cx="32" cy="18" r="1.5" fill="hsl(180, 100%, 35%)" opacity="0.4" />
            <circle cx="24" cy="24" r="3" fill="hsl(180, 100%, 35%)" opacity="0.8" />
            <circle cx="18" cy="30" r="1.5" fill="hsl(180, 100%, 35%)" opacity="0.4" />
            <circle cx="30" cy="30" r="1.5" fill="hsl(180, 100%, 35%)" opacity="0.4" />
            <circle cx="24" cy="36" r="2" fill="hsl(180, 100%, 35%)" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Main title - letter-spaced like mont-fort */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] md:tracking-[0.3em] text-slate-800 uppercase mb-8"
        >
          {language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German'}
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-24 h-px bg-primary/40 mx-auto mb-8"
        />

        {/* Subtitle - elegant and minimal */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl font-light tracking-[0.1em] text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          {language === 'ar' 
            ? 'طب الأسنان الفاخر في الكويت' 
            : 'Premium Dental Care in Kuwait'
          }
        </motion.p>

        {/* CTA Buttons - minimal style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            onClick={() => scrollToSection('booking')}
            className="group relative px-10 py-4 text-sm font-light tracking-[0.2em] text-white uppercase bg-primary hover:bg-primary/90 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'ar' ? 'احجز موعد' : 'Book Appointment'}
          </motion.button>
          
          <motion.button
            onClick={() => scrollToSection('about')}
            className="group relative px-10 py-4 text-sm font-light tracking-[0.2em] text-slate-600 uppercase border border-slate-300 hover:border-primary hover:text-primary transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - mont-fort style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
        onClick={() => scrollToSection('about')}
      >
        <span className="text-xs font-light tracking-[0.3em] text-slate-400 uppercase">
          {language === 'ar' ? 'انزل للأسفل' : 'Scroll Down'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};