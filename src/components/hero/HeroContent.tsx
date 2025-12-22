import { Phone, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "sonner";
import heroAudio from "@/assets/hero-audio.mp3";

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
      
      const audio = new Audio(heroAudio);
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
    <div className="relative z-10 container mx-auto px-4 text-center">
      
      {/* Main title with gradient - white/teal for dark background */}
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
          className="bg-gradient-to-r from-white via-[hsl(180,100%,70%)] to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient drop-shadow-[0_0_30px_rgba(0,180,180,0.4)]"
        />
      </motion.h1>
      
      {/* Subtitle - light for dark background */}
      <motion.p 
        className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
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
          onClick={handlePlayDoctorInfo}
          className="group relative overflow-hidden px-8 py-4 bg-[hsl(180,100%,40%)] text-white rounded-full font-semibold text-lg shadow-lg shadow-[hsl(180,100%,40%)]/40 hover:shadow-xl hover:shadow-[hsl(180,100%,40%)]/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {isPlaying ? (
              <VolumeX className="h-5 w-5 transition-transform group-hover:scale-110" />
            ) : (
              <Volume2 className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
            {isPlaying 
              ? (language === 'ar' ? 'إيقاف' : 'Stop') 
              : (language === 'ar' ? 'عن الدكتور' : 'About Dr.')}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(180,100%,45%)] via-[hsl(180,100%,50%)] to-[hsl(180,100%,45%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
        
        <button 
          onClick={onContactClick}
          className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold text-lg hover:border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105"
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
