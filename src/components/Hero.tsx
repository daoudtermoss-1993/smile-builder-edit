import { Calendar, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { motion } from "framer-motion";

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
  backgroundImage = "/placeholder.svg", 
  backgroundVideo,
  title, 
  subtitle,
  badge
}: HeroProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Background image/video */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage && backgroundImage !== "/placeholder.svg" ? (
        <motion.div
          className="absolute inset-0 hero-image-mask"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <EditableImage
            sectionKey="hero"
            field="backgroundImage"
            defaultSrc={backgroundImage}
            alt="Dental Clinic"
            className="w-full h-full"
          />
        </motion.div>
      ) : null}
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div 
          className="inline-block mb-6 px-6 py-2 glass rounded-full border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EditableText 
            sectionKey="hero" 
            field="badge" 
            defaultValue={t('dentist')}
            className="text-sm font-semibold text-primary"
          />
        </motion.div>
        
        <motion.h1 
          className="vibe-title mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <EditableText 
            sectionKey="hero" 
            field="title" 
            defaultValue={t('heroTitle')}
            as="span"
          />
        </motion.h1>
        
        <motion.p 
          className="vibe-sub mb-12 max-w-2xl mx-auto"
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
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button 
            onClick={() => scrollToSection('booking')}
            className="vibe-btn vibe-glow inline-flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            {t('bookAppointment')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="vibe-btn inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary/20 hover:bg-secondary hover:border-primary/40"
          >
            <Phone className="h-5 w-5" />
            {t('contactClinic')}
          </button>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
