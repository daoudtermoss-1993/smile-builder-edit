import { Calendar, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { DentalBackground3D, FloatingTooth } from "./DentalBackground3D";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Animated Background */}
      <DentalBackground3D />
      
      {/* Floating decorative elements */}
      <FloatingTooth delay={0} className="top-20 left-10 hidden lg:block" />
      <FloatingTooth delay={1} className="top-40 right-20 hidden lg:block" />
      <FloatingTooth delay={2} className="bottom-40 left-1/4 hidden lg:block" />
      <FloatingTooth delay={1.5} className="bottom-60 right-1/4 hidden lg:block" />
      
      {/* Optional background image/video overlay */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10 z-[1]"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage && backgroundImage !== "/placeholder.svg" ? (
        <img
          src={backgroundImage}
          alt="Dental Clinic"
          className="absolute inset-0 w-full h-full object-cover opacity-10 z-[1]"
        />
      ) : null}
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60 z-[2]" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-primary/20 shadow-sm">
          <EditableText 
            sectionKey="hero" 
            field="badge" 
            defaultValue={t('dentist')}
            className="text-sm font-semibold text-primary"
          />
        </div>
        
        <h1 className="vibe-title mb-6 animate-in fade-in duration-1000">
          <EditableText 
            sectionKey="hero" 
            field="title" 
            defaultValue={t('heroTitle')}
            as="span"
          />
        </h1>
        
        <p className="vibe-sub mb-12 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-200">
          <EditableText 
            sectionKey="hero" 
            field="subtitle" 
            defaultValue={t('heroSubtitle')}
            as="span"
          />
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-1000 delay-300">
          <button 
            onClick={() => scrollToSection('booking')}
            className="vibe-btn inline-flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            {t('bookAppointment')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="vibe-btn inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-secondary"
          >
            <Phone className="h-5 w-5" />
            {t('contactClinic')}
          </button>
        </div>
      </div>
    </section>
  );
};
