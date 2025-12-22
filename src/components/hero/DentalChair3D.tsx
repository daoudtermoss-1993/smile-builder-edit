import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroContent } from "./HeroContent";
import heroVideo from "@/assets/hero-video.mp4";

export function DentalChair3D() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const rafRef = useRef<number>();
  const targetTimeRef = useRef(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax and fade effects
  const videoScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Smooth scroll-driven video playback with RAF
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.pause();
      video.currentTime = 0;
      setIsVideoReady(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // If already loaded
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Smooth animation loop for video scrubbing
  useEffect(() => {
    if (!isVideoReady) return;
    
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const smoothUpdate = () => {
      if (video && video.duration) {
        const currentTime = video.currentTime;
        const diff = targetTimeRef.current - currentTime;
        
        // Lerp for smooth transition
        if (Math.abs(diff) > 0.01) {
          video.currentTime = currentTime + diff * 0.15;
        }
      }
      rafRef.current = requestAnimationFrame(smoothUpdate);
    };

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (video.duration) {
        targetTimeRef.current = progress * video.duration;
      }
    });

    rafRef.current = requestAnimationFrame(smoothUpdate);

    return () => {
      unsubscribe();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVideoReady, scrollYProgress]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-[500vh] w-full"
    >
      {/* Sticky video container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale: videoScale, opacity: videoOpacity }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          
          {/* Decorative overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 h-full flex flex-col justify-center items-center"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <HeroContent 
            onBookClick={scrollToBooking}
            onContactClick={scrollToContact}
          />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="w-[30px] h-[50px] border-2 border-white/40 rounded-full relative backdrop-blur-sm">
            <motion.div 
              className="w-1.5 h-3 bg-primary rounded-full absolute left-1/2 -translate-x-1/2"
              animate={{ top: [8, 28, 8], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-white/70 font-medium">
            {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll'}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
