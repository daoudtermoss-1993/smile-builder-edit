import { Phone, Sparkles, Volume2, Loader2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeroContentProps {
  onBookClick: () => void;
  onContactClick: () => void;
}

const doctorInfoEN = `Dr. Yousif German is a highly qualified dental surgeon based in Kuwait City. 
He graduated with honors from the Faculty of Dentistry and completed advanced training in cosmetic dentistry, dental implants, and orthodontics. 
With over 15 years of clinical experience, Dr. German specializes in smile design, teeth whitening, ceramic veneers, and full mouth rehabilitation. 
He is known for his gentle approach and commitment to using the latest dental technologies to ensure patient comfort and optimal results. 
Dr. German regularly attends international conferences and continuing education programs to stay at the forefront of modern dentistry.`;

const doctorInfoAR = `الدكتور يوسف جيرمان هو جراح أسنان مؤهل تأهيلاً عالياً ويعمل في مدينة الكويت.
تخرج بامتياز من كلية طب الأسنان وأكمل تدريباً متقدماً في طب الأسنان التجميلي وزراعة الأسنان وتقويم الأسنان.
مع أكثر من 15 عاماً من الخبرة السريرية، يتخصص الدكتور جيرمان في تصميم الابتسامة وتبييض الأسنان والقشور الخزفية وإعادة تأهيل الفم الكامل.
يُعرف بنهجه اللطيف والتزامه باستخدام أحدث تقنيات طب الأسنان لضمان راحة المريض والحصول على أفضل النتائج.
يحضر الدكتور جيرمان بانتظام المؤتمرات الدولية وبرامج التعليم المستمر للبقاء في طليعة طب الأسنان الحديث.`;

export function HeroContent({ onBookClick, onContactClick }: HeroContentProps) {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayDoctorInfo = async () => {
    // If already playing, stop it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const text = language === 'ar' ? doctorInfoAR : doctorInfoEN;
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, language }
      });

      if (error) {
        throw error;
      }

      // Create audio from blob
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error(language === 'ar' ? 'خطأ في تشغيل الصوت' : 'Error playing audio');
      };
      
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('TTS error:', error);
      toast.error(language === 'ar' ? 'خطأ في توليد الصوت' : 'Error generating speech');
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={handlePlayDoctorInfo}
          disabled={isLoading}
          className="group relative overflow-hidden px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <VolumeX className="h-5 w-5 transition-transform group-hover:scale-110" />
            ) : (
              <Volume2 className="h-5 w-5 transition-transform group-hover:scale-110" />
            )}
            {isLoading 
              ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') 
              : isPlaying 
                ? (language === 'ar' ? 'إيقاف' : 'Stop') 
                : (language === 'ar' ? 'عن الدكتور' : 'About Dr.')}
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
