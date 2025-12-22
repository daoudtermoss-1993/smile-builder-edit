import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroContent } from "./HeroContent";
import heroVideo from "@/assets/hero-video.mp4";

export function DentalChair3D() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const currentTimeRef = useRef(0);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number>();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax and fade effects
  const videoScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Optimized smooth scrubbing with high-performance lerp
  const smoothScrub = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || !isVideoReady) {
      rafRef.current = requestAnimationFrame(smoothScrub);
      return;
    }

    const diff = targetTimeRef.current - currentTimeRef.current;
    
    // Use faster lerp factor for more responsive feel (like Terminal Industries)
    // 0.08 gives smooth but responsive scrolling
    if (Math.abs(diff) > 0.001) {
      currentTimeRef.current += diff * 0.08;
      video.currentTime = currentTimeRef.current;
    }
    
    rafRef.current = requestAnimationFrame(smoothScrub);
  }, [isVideoReady]);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.pause();
      video.currentTime = 0;
      currentTimeRef.current = 0;
      setIsVideoReady(true);
    };

    // Preload video for smooth playback
    video.preload = "auto";
    video.addEventListener('canplaythrough', handleCanPlay);
    
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, []);

  // Start animation loop and scroll listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (video.duration) {
        targetTimeRef.current = progress * video.duration;
      }
    });

    rafRef.current = requestAnimationFrame(smoothScrub);

    return () => {
      unsubscribe();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrollYProgress, smoothScrub]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-[600vh] w-full"
    >
      {/* Sticky video container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video Background - optimized for scroll scrubbing */}
        <motion.div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ scale: videoScale, opacity: videoOpacity }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover will-change-auto"
            style={{ 
              // Hardware acceleration hints
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 h-full flex flex-col justify-center items-center will-change-transform"
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
          style={{ opacity: contentOpacity }}
        >
          <div className="w-[30px] h-[50px] border-2 border-white/40 rounded-full relative backdrop-blur-sm">
            <motion.div 
              className="w-1.5 h-3 bg-primary rounded-full absolute left-1/2 -translate-x-1/2"
              animate={{ top: [8, 28, 8], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-white/70 font-medium">
            {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll to explore'}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
