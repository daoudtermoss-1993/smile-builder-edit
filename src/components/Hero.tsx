import { Calendar, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden vibe-glow">
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={backgroundImage}
          alt="Dental Clinic"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-primary/20 shadow-sm">
          <span className="text-sm font-semibold text-primary">{t('dentist')}</span>
        </div>
        
        <h1 className="vibe-title mb-6 animate-in fade-in duration-1000">
          {t('heroTitle')}
        </h1>
        
        <p className="vibe-sub mb-12 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-200">
          {t('heroSubtitle')}
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
