import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import clinicLogo from "@/assets/clinic-logo.png";

interface HeroContentProps {
  onBookClick: () => void;
  onContactClick: () => void;
}

export function HeroContent({ onBookClick, onContactClick }: HeroContentProps) {
  const { t, language } = useLanguage();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
      
      {/* Centered Logo + Title - Mont-fort style */}
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.img
          src={clinicLogo}
          alt="Dr. Yousif German Dental Clinic"
          className="h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />

        {/* Separator line */}
        <motion.div 
          className="w-px h-8 bg-white/40"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        {/* Main title - large, spaced letters like Mont-fort */}
        <motion.h1 
          className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.3em] md:tracking-[0.4em] uppercase text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <EditableText 
            sectionKey="hero" 
            field="title" 
            defaultValue={language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German'}
            as="span"
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-sm md:text-base lg:text-lg font-light tracking-[0.15em] uppercase text-white/70 max-w-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <EditableText 
            sectionKey="hero" 
            field="subtitle" 
            defaultValue={language === 'ar' ? 'طب الأسنان التجميلي والترميمي' : 'Cosmetic & Restorative Dentistry'}
            as="span"
          />
        </motion.p>
      </motion.div>

      {/* Scroll indicator at bottom - Mont-fort style */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        onClick={onContactClick}
      >
        <span className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-white/60 group-hover:text-white/90 transition-colors duration-300">
          {language === 'ar' ? 'مرر للاكتشاف' : 'Scroll down to discover'}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-white/50 group-hover:text-white/80 transition-colors duration-300" />
        </motion.div>
      </motion.div>
    </div>
  );
}
