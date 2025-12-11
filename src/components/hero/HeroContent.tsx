import { Calendar, Phone, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";

interface HeroContentProps {
  onBookClick: () => void;
  onContactClick: () => void;
}

export function HeroContent({ onBookClick, onContactClick }: HeroContentProps) {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 container mx-auto px-4 text-center">
      {/* Floating badge */}
      <motion.div 
        className="inline-flex items-center gap-2 mb-6 px-6 py-2 glass rounded-full border border-primary/20"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <EditableText 
          sectionKey="hero" 
          field="badge" 
          defaultValue={t('dentist')}
          className="text-sm font-semibold text-primary"
        />
      </motion.div>
      
      {/* Main title with gradient */}
      <motion.h1 
        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <EditableText 
          sectionKey="hero" 
          field="title" 
          defaultValue={t('heroTitle')}
          as="span"
          className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
        />
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p 
        className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <EditableText 
          sectionKey="hero" 
          field="subtitle" 
          defaultValue={t('heroSubtitle')}
          as="span"
        />
      </motion.p>
      
      {/* CTA Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <button 
          onClick={onBookClick}
          className="group relative overflow-hidden px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            <Calendar className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {t('bookAppointment')}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
        
        <button 
          onClick={onContactClick}
          className="group px-8 py-4 glass border border-primary/20 text-foreground rounded-full font-semibold text-lg hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
        >
          <span className="inline-flex items-center gap-2">
            <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {t('contactClinic')}
          </span>
        </button>
      </motion.div>
    </div>
  );
}
