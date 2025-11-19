import { Button } from "@/components/ui/button";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={backgroundImage}
          alt="Dental Clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="inline-block mb-4 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-white/20">
          <span className="text-sm font-medium">{badge}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 shadow-medium">
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
            <Phone className="mr-2 h-5 w-5" />
            Contact Clinic
          </Button>
        </div>
      </div>
    </section>
  );
};
