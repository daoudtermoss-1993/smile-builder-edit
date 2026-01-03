import { Phone, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "sonner";
import doctorIntroAudio from "@/assets/dr-german-intro.mp3";
import { GlowType } from "@/components/ui/TypeWriter";

interface HeroContentProps {
  onBookClick: () => void;
  onContactClick: () => void;
}

export function HeroContent({ onBookClick, onContactClick }: HeroContentProps) {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayDoctorInfo = () => {
    // If already playing, stop it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(doctorIntroAudio);
      audio.volume = 0.6; // Reduced volume for elegance
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error(language === 'ar' ? 'خطأ في تشغيل الصوت' : 'Error playing audio');
      };
      
      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio error:', error);
      toast.error(language === 'ar' ? 'خطأ في تشغيل الصوت' : 'Error playing audio');
    }
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
      {/* Top section - Only subtitle with typewriter effect */}
      <div className="container mx-auto px-4 pt-24 sm:pt-28 md:pt-32 text-center">
        {/* Subtitle with GlowType effect - responsive text size */}
        <motion.div 
          className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlowType
            text={t('heroSubtitle')}
            delay={800}
            speed={35}
            glowColor="hsl(175 80% 60%)"
            startOnView={false}
          />
        </motion.div>
      </div>

      {/* Spacer to push buttons to bottom */}
      <div className="flex-1" />

      {/* Bottom section - CTA Buttons - responsive layout */}
      <div className="w-full px-4 sm:px-6 md:px-12 pb-6 sm:pb-8 md:pb-12">
        <motion.div 
          className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 sm:gap-4 max-w-5xl mx-auto pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Left button - responsive sizing */}
          <button 
            onClick={handlePlayDoctorInfo}
            className="group relative overflow-hidden w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-[hsl(175,85%,35%)] text-white rounded-full font-semibold text-sm sm:text-base md:text-lg shadow-lg shadow-[hsl(175,85%,35%)]/40 hover:shadow-xl hover:shadow-[hsl(175,85%,35%)]/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              {isPlaying ? (
                <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              ) : (
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              )}
              {isPlaying 
                ? (language === 'ar' ? 'إيقاف' : 'Stop') 
                : (language === 'ar' ? 'عن الدكتور' : 'About Dr.')}
            </span>
            <div className="absolute inset-0 bg-[hsl(175,85%,40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          {/* Right button - responsive sizing */}
          <button 
            onClick={onContactClick}
            className="group w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold text-sm sm:text-base md:text-lg hover:border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-12" />
              {t('contactClinic')}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
