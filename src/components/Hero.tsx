import { Calendar, Phone } from "lucide-react";

interface HeroProps {
  backgroundImage?: string;
  backgroundVideo?: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const Hero = ({ 
  backgroundImage = "/placeholder.svg", 
  backgroundVideo,
  title, 
  subtitle,
  badge
}: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden vibe-glow">
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
      ) : (
        <img
          src={backgroundImage}
          alt="Dental Clinic"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block mb-6 px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30">
          <span className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent">{badge}</span>
        </div>
        
        <h1 className="vibe-title mb-6 animate-in fade-in duration-1000">
          {title}
        </h1>
        
        <p className="vibe-sub mb-12 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-200">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-1000 delay-300">
          <button className="vibe-btn inline-flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </button>
          <button className="vibe-btn inline-flex items-center justify-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Clinic
          </button>
        </div>
      </div>
    </section>
  );
};
