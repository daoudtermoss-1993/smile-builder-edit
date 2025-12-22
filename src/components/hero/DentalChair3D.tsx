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
  const imageScale = useTransform(scrollYProgress, [0, 0.7], [1, 1.15]);
  const imageOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  
  // Dark overlay appears earlier and stays longer (less scroll needed)
  const darkOverlayOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const gridOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const gridLineProgress = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  
  // Zoom effect: zoom in first, then zoom out
  const darkSectionScale = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [1.2, 1.05, 1]);
  
  const [showGrid, setShowGrid] = useState(false);
  
  // Trigger grid animation when dark overlay is visible
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      setShowGrid(progress > 0.5);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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
      className="relative h-[200vh] w-full"
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

        {/* Dark overlay with grid pattern - with zoom effect - Teal themed */}
        <motion.div 
          className="absolute inset-0 z-[1] bg-[hsl(180,35%,8%)] origin-center"
          style={{ opacity: darkOverlayOpacity, scale: darkSectionScale }}
        />
        
        {/* Camera flying through Grid Lines effect */}
        {showGrid && (
          <motion.div 
            className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
            style={{ perspective: '1200px' }}
          >
            {/* 3D Grid container with camera movement */}
            <motion.div
              className="absolute inset-0 origin-center"
              style={{ 
                transformStyle: 'preserve-3d'
              }}
              initial={{ 
                rotateX: 0,
                scale: 1
              }}
              animate={{ 
                rotateX: [0, 20, 35, 25, 10],
                scale: [1, 1.2, 1.8, 2.5, 3]
              }}
              transition={{ 
                duration: 3.5,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Vertical Lines rushing towards camera */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`v-${i}`}
                  className="absolute top-0 h-full bg-gradient-to-b from-[hsl(175,60%,50%,0.1)] via-[hsl(175,60%,45%,0.5)] to-[hsl(175,60%,50%,0.1)]"
                  style={{ 
                    left: `${(i + 1) * 5}%`,
                    width: '2px'
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.02,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Horizontal Lines with depth */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={`h-${i}`}
                  className="absolute left-0 w-full bg-gradient-to-r from-[hsl(175,60%,50%,0.1)] via-[hsl(175,60%,40%,0.4)] to-[hsl(175,60%,50%,0.1)]"
                  style={{ 
                    top: `${(i + 1) * 6.5}%`,
                    height: '2px'
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 + i * 0.02,
                    ease: "easeOut"
                  }}
                />
              ))}

              {/* Intersection dots */}
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 12 }).map((_, col) => (
                  <motion.div
                    key={`dot-${row}-${col}`}
                    className="absolute w-2 h-2 rounded-full bg-[hsl(175,60%,55%)]"
                    style={{ 
                      top: `${(row + 1) * 11}%`, 
                      left: `${(col + 1) * 8}%`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.3 + (row + col) * 0.02,
                      ease: "easeOut"
                    }}
                  />
                ))
              )}
            </motion.div>

            {/* Speed lines rushing effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, delay: 1 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`speed-${i}`}
                  className="absolute h-[2px] bg-gradient-to-r from-transparent via-[hsl(175,60%,60%,0.8)] to-transparent"
                  style={{
                    top: `${10 + i * 7}%`,
                    left: '0',
                    right: '0'
                  }}
                  initial={{ scaleX: 0, x: '-50%' }}
                  animate={{ 
                    scaleX: [0, 1.5, 2],
                    x: ['-50%', '0%', '50%']
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 1.5 + i * 0.06,
                    ease: "easeIn"
                  }}
                />
              ))}
            </motion.div>

            {/* Vignette tunnel effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 20%, hsl(180,35%,8%) 80%)'
              }}
            />

            {/* Light particles flying past */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-8 md:h-12 rounded-full bg-gradient-to-b from-[hsl(175,60%,60%)] to-transparent"
                style={{ 
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`
                }}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 2, 3],
                  y: ['0%', '200%']
                }}
                transition={{ 
                  duration: 1.5,
                  delay: 1.2 + i * 0.1,
                  ease: "easeIn"
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Curved transition at bottom - reduced height */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 z-[3] h-16"
          style={{ opacity: darkOverlayOpacity }}
        >
          <svg 
            viewBox="0 0 1440 64" 
            fill="none" 
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Curved shape - smaller height */}
            <path 
              d="M0 64V64H160C160 64 180 64 200 48C220 32 250 20 300 20H1140C1190 20 1220 32 1240 48C1260 64 1280 64 1280 64H1440V64H0Z" 
              fill="hsl(var(--background))"
            />
            {/* Top curve border */}
            <path 
              d="M160 64C160 64 180 64 200 48C220 32 250 20 300 20H1140C1190 20 1220 32 1240 48C1260 64 1280 64 1280 64" 
              stroke="hsl(var(--border))"
              strokeWidth="1"
              fill="none"
            />
          </svg>
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
