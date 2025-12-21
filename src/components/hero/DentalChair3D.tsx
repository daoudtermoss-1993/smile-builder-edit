import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Cabinet dentaire images - solide blanc et wireframe
const CABINET_SOLID_URL = "https://a.lovart.ai/artifacts/agent/eCYhzwystv5TzpHS.png";
const CABINET_WIRE_URL = "https://a.lovart.ai/artifacts/agent/UhM1KsXb5FdhwtEw.png";

// Utility functions
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const mapRange = (value: number, low1: number, high1: number, low2: number, high2: number) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

export function DentalChair3D() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  
  const { scrollY } = useScroll();
  
  // Smooth spring for global scroll
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 85,
    damping: 28,
    restDelta: 0.001,
  });

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      currentScrollRef.current = lerp(currentScrollRef.current, targetScrollRef.current, 0.08);
      
      if (containerRef.current) {
        const triggerHeight = containerRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollDistance = triggerHeight - viewportHeight;
        const rawProgress = currentScrollRef.current / scrollDistance;
        
        const progress = clamp(rawProgress, 0, 1);
        setScrollProgress(progress);
        setSmoothedProgress(prev => lerp(prev, progress, 0.1));
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const handleScroll = () => {
      targetScrollRef.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    animate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const p = smoothedProgress;
  
  // Rotation - rotation complète sur scroll
  const rotateY = p * 360;
  const rotateX = Math.sin(p * Math.PI * 2) * 15;
  
  // Scale - démarre grand, reste stable
  const scale = mapRange(p, 0, 1, 1.0, 0.85);
  
  // TranslateZ pour l'effet de profondeur
  const translateZ = mapRange(p, 0, 1, 0, -100);
  
  // Crossfade entre solide (blanc) et wireframe (lignes)
  let solidOpacity: number;
  let wireOpacity: number;
  
  if (p < 0.25) {
    solidOpacity = 1;
    wireOpacity = 0;
  } else if (p > 0.75) {
    solidOpacity = 0;
    wireOpacity = 1;
  } else {
    const fadeProgress = mapRange(p, 0.25, 0.75, 0, 1);
    solidOpacity = 1 - fadeProgress;
    wireOpacity = fadeProgress;
  }
  
  // Parallax background
  const parallaxY = p * 150;
  
  // Text visibility based on scroll
  const text1Visible = p > 0.05 && p < 0.3;
  const text2Visible = p > 0.35 && p < 0.6;
  const text3Visible = p > 0.7 && p < 0.95;
  
  // Scroll indicator fade
  const scrollIndicatorOpacity = useTransform(smoothScrollY, [0, 200], [1, 0]);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div 
          className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main 3D Hero Section */}
      <section 
        ref={containerRef}
        className="h-[500vh] relative z-0"
        id="hero-3d"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex justify-center items-center" style={{ perspective: '1200px' }}>
          {/* Gradient Background - like terminal-industries */}
          <div 
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(180deg, 
                hsl(40 ${30 + p * 20}% ${75 - p * 30}%) 0%, 
                hsl(30 ${25 + p * 15}% ${60 - p * 35}%) 50%,
                hsl(20 ${20 + p * 10}% ${15 - p * 10}%) 100%
              )`
            }}
          />
          
          {/* Ground Shadow */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/3"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)'
            }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 3D Cabinet Scene */}
          <div 
            className="relative z-10 flex items-center justify-center"
            style={{ 
              transformStyle: 'preserve-3d',
              width: '80vw',
              height: '80vh',
            }}
          >
            <div 
              className="relative transition-transform duration-100"
              style={{
                transform: `
                  scale(${scale})
                  rotateX(${rotateX}deg) 
                  rotateY(${rotateY}deg) 
                  translateZ(${translateZ}px)
                `,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Solid White Cabinet */}
              <img 
                src={CABINET_SOLID_URL}
                alt="Cabinet Dentaire"
                className="w-auto h-[60vh] max-w-[80vw] object-contain drop-shadow-2xl"
                style={{ 
                  opacity: solidOpacity,
                  filter: `brightness(${1 + (1 - p) * 0.2})`,
                }}
                draggable={false}
              />
              {/* Wireframe Cabinet - positioned absolutely to overlay */}
              <img 
                src={CABINET_WIRE_URL}
                alt="Cabinet Dentaire Wireframe"
                className="absolute top-0 left-0 w-auto h-[60vh] max-w-[80vw] object-contain"
                style={{ 
                  opacity: wireOpacity,
                  filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.3))',
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Top Text Overlay - Title */}
          <div className="absolute top-8 left-0 right-0 text-center z-20">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="inline-block"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase text-foreground/90 mb-2">
                {language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German'}
              </h1>
              <p className="text-primary text-sm md:text-base tracking-[0.3em] uppercase">
                {language === 'ar' ? 'طب الأسنان الرقمي' : 'Digital Dentistry'}
              </p>
            </motion.div>
          </div>

          {/* Floating Feature Text */}
          <motion.div 
            className={`absolute left-8 md:left-16 top-1/3 max-w-xs transition-all duration-500 ${text1Visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <span className="text-primary text-xs tracking-[0.2em] uppercase mb-2 block">
              {language === 'ar' ? 'المرحلة ٠١' : 'Phase 01'}
            </span>
            <h3 className="text-xl md:text-2xl font-light text-foreground">
              {language === 'ar' ? 'تصميم مريح متطور' : 'Advanced Ergonomic Design'}
            </h3>
          </motion.div>

          <motion.div 
            className={`absolute right-8 md:right-16 top-1/2 max-w-xs text-right transition-all duration-500 ${text2Visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <span className="text-primary text-xs tracking-[0.2em] uppercase mb-2 block">
              {language === 'ar' ? 'المرحلة ٠٢' : 'Phase 02'}
            </span>
            <h3 className="text-xl md:text-2xl font-light text-foreground">
              {language === 'ar' ? 'التكامل الرقمي الكامل' : 'Full Digital Integration'}
            </h3>
          </motion.div>

          <motion.div 
            className={`absolute left-8 md:left-16 bottom-1/4 max-w-xs transition-all duration-500 ${text3Visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <span className="text-primary text-xs tracking-[0.2em] uppercase mb-2 block">
              {language === 'ar' ? 'المرحلة النهائية' : 'Final Phase'}
            </span>
            <h3 className="text-xl md:text-2xl font-light text-foreground">
              {language === 'ar' ? 'مستعد للمستقبل' : 'Future Ready Experience'}
            </h3>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <div className="w-[30px] h-[50px] border-2 border-foreground/30 rounded-[15px] relative">
              <motion.div 
                className="w-1 h-2 bg-primary rounded-sm absolute left-1/2 -translate-x-1/2"
                animate={{ top: [8, 28, 8], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-foreground/60">
              {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll to Explore'}
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
