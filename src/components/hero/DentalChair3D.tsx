import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroContent } from "./HeroContent";
import heroVideo from "@/assets/hero-video.mp4";

// Number of frames to extract (more = smoother but heavier)
const FRAME_COUNT = 90;

export function DentalChair3D() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax and fade effects
  const imageScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.15]);
  const imageOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Extract frames from video using canvas
  useEffect(() => {
    const video = document.createElement('video');
    video.src = heroVideo;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const extractFrames = async () => {
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const duration = video.duration;
      const frameInterval = duration / FRAME_COUNT;
      const extractedFrames: string[] = [];

      for (let i = 0; i < FRAME_COUNT; i++) {
        video.currentTime = i * frameInterval;
        
        await new Promise<void>((resolve) => {
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            extractedFrames.push(canvas.toDataURL('image/jpeg', 0.85));
            setLoadingProgress(Math.round(((i + 1) / FRAME_COUNT) * 100));
            resolve();
          };
        });
      }

      setFrames(extractedFrames);
      setIsLoading(false);
    };

    extractFrames();

    return () => {
      video.src = '';
    };
  }, []);

  // Update current frame based on scroll
  useEffect(() => {
    if (frames.length === 0) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const frameIndex = Math.min(
        Math.floor(progress * frames.length),
        frames.length - 1
      );
      setCurrentFrame(frameIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, frames.length]);

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
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4">
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'ar' ? `جاري التحميل ${loadingProgress}%` : `Loading ${loadingProgress}%`}
            </span>
          </div>
        )}

        {/* Frame-based background - ultra smooth scrolling */}
        <motion.div 
          className="absolute inset-0 z-0 will-change-transform"
          style={{ scale: imageScale, opacity: imageOpacity }}
        >
          {frames.length > 0 && (
            <img
              src={frames[currentFrame]}
              alt="Hero"
              className="w-full h-full object-cover"
              style={{ 
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            />
          )}
          
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
        {!isLoading && (
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
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
        )}
      </div>
    </section>
  );
}
