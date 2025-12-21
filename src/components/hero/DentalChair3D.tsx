import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Import cabinet images
import cabinetScene1 from "@/assets/cabinet-scene-1.jpg";
import cabinetScene2 from "@/assets/cabinet-scene-2.jpg";
import cabinetScene3 from "@/assets/cabinet-scene-3.jpg";
import cabinetChair from "@/assets/cabinet-chair.png";

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
  
  // Card 1: 0-50% of scroll (cinematic cabinet transitions)
  // Card 2: 50-100% of scroll (wireframe transformation)
  const isCard1 = p < 0.5;
  const card1Progress = clamp(mapRange(p, 0, 0.5, 0, 1), 0, 1);
  const card2Progress = clamp(mapRange(p, 0.5, 1, 0, 1), 0, 1);
  
  // Cabinet transitions within Card 1 (cinematic crossfade between 3 cabinets)
  // Cabinet 1: 0-33%, Cabinet 2: 33-66%, Cabinet 3: 66-100%
  let cabinet1Opacity = 0;
  let cabinet2Opacity = 0;
  let cabinet3Opacity = 0;
  
  if (card1Progress < 0.33) {
    cabinet1Opacity = 1;
    cabinet2Opacity = mapRange(card1Progress, 0.2, 0.33, 0, 0.3);
  } else if (card1Progress < 0.66) {
    cabinet1Opacity = mapRange(card1Progress, 0.33, 0.45, 1, 0);
    cabinet2Opacity = 1;
    cabinet3Opacity = mapRange(card1Progress, 0.55, 0.66, 0, 0.3);
  } else {
    cabinet2Opacity = mapRange(card1Progress, 0.66, 0.8, 1, 0);
    cabinet3Opacity = 1;
  }
  
  // Chair rotation and scale
  const rotateY = p * 180;
  const rotateX = Math.sin(p * Math.PI) * 10;
  const scale = isCard1 ? mapRange(card1Progress, 0, 1, 0.9, 1.1) : mapRange(card2Progress, 0, 1, 1.1, 0.9);
  
  // Crossfade to wireframe in Card 2
  const solidOpacity = isCard1 ? 1 : mapRange(card2Progress, 0, 0.6, 1, 0);
  const wireOpacity = isCard1 ? 0 : mapRange(card2Progress, 0.3, 0.8, 0, 1);
  
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
        className="h-[400vh] relative z-0"
        id="hero-3d"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex justify-center items-center" style={{ perspective: '1200px' }}>
          {/* Dark Background - Original colors */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, hsl(180 20% 8%) 0%, hsl(180 30% 3%) 70%)'
            }}
          />
          
          {/* Background Cabinet Scenes - Cinematic transitions */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Cabinet Scene 1 */}
            <motion.div 
              className="absolute inset-0"
              style={{ opacity: cabinet1Opacity }}
            >
              <img 
                src={cabinetScene1}
                alt="Cabinet Scene 1"
                className="w-full h-full object-cover"
                style={{ 
                  transform: `scale(${1 + card1Progress * 0.1})`,
                  filter: `brightness(${0.6 + (1 - cabinet1Opacity) * 0.2})`
                }}
              />
            </motion.div>
            
            {/* Cabinet Scene 2 */}
            <motion.div 
              className="absolute inset-0"
              style={{ opacity: cabinet2Opacity }}
            >
              <img 
                src={cabinetScene2}
                alt="Cabinet Scene 2"
                className="w-full h-full object-cover"
                style={{ 
                  transform: `scale(${1 + card1Progress * 0.05})`,
                  filter: `brightness(${0.6 + (1 - cabinet2Opacity) * 0.2})`
                }}
              />
            </motion.div>
            
            {/* Cabinet Scene 3 */}
            <motion.div 
              className="absolute inset-0"
              style={{ opacity: cabinet3Opacity }}
            >
              <img 
                src={cabinetScene3}
                alt="Cabinet Scene 3"
                className="w-full h-full object-cover"
                style={{ 
                  transform: `scale(${1 + card1Progress * 0.03})`,
                  filter: `brightness(${0.5 + cabinet3Opacity * 0.3})`
                }}
              />
            </motion.div>
          </div>
          
          {/* Vignette overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
            }}
          />

          {/* 3D Chair Element */}
          <div 
            className="relative z-10 flex items-center justify-center"
            style={{ 
              transformStyle: 'preserve-3d',
              opacity: isCard1 ? 0 : card2Progress,
            }}
          >
            <div 
              className="relative transition-transform duration-100"
              style={{
                transform: `
                  scale(${scale})
                  rotateX(${rotateX}deg) 
                  rotateY(${rotateY}deg)
                `,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Solid Chair */}
              <img 
                src={cabinetChair}
                alt="Cabinet Dentaire"
                className="w-auto h-[50vh] max-w-[70vw] object-contain drop-shadow-2xl"
                style={{ 
                  opacity: solidOpacity,
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                }}
                draggable={false}
              />
              {/* Wireframe effect overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: wireOpacity }}
              >
                <img 
                  src={cabinetChair}
                  alt="Cabinet Dentaire Wireframe"
                  className="w-auto h-[50vh] max-w-[70vw] object-contain"
                  style={{ 
                    filter: 'invert(1) brightness(2) contrast(1.5) drop-shadow(0 0 20px rgba(0,200,255,0.5))',
                    mixBlendMode: 'screen',
                  }}
                  draggable={false}
                />
              </div>
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
              <p className="text-primary text-sm md:text-base tracking-[0.3em] uppercase mb-2">
                {language === 'ar' ? 'الدقة الرقمية والعناية' : 'Digital Precision & Care'}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase text-white/90">
                {language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German'}
              </h1>
            </motion.div>
          </div>

          {/* Phase indicators */}
          <motion.div 
            className={`absolute left-8 md:left-16 bottom-1/3 max-w-xs transition-all duration-700 ${isCard1 && card1Progress > 0.1 && card1Progress < 0.35 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <span className="text-primary text-xs tracking-[0.2em] uppercase mb-2 block">
              {language === 'ar' ? 'المرحلة ٠١' : 'Phase 01'}
            </span>
            <h3 className="text-xl md:text-2xl font-light text-white">
              {language === 'ar' ? 'بيئة مريحة' : 'Comfortable Environment'}
            </h3>
          </motion.div>

          <motion.div 
            className={`absolute right-8 md:right-16 bottom-1/3 max-w-xs text-right transition-all duration-700 ${isCard1 && card1Progress > 0.4 && card1Progress < 0.7 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <span className="text-primary text-xs tracking-[0.2em] uppercase mb-2 block">
              {language === 'ar' ? 'المرحلة ٠٢' : 'Phase 02'}
            </span>
            <h3 className="text-xl md:text-2xl font-light text-white">
              {language === 'ar' ? 'تقنية متقدمة' : 'Advanced Technology'}
            </h3>
          </motion.div>

          <motion.div 
            className={`absolute left-8 md:left-16 bottom-1/4 max-w-xs transition-all duration-700 ${!isCard1 && card2Progress > 0.3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <span className="text-primary text-xs tracking-[0.2em] uppercase mb-2 block">
              {language === 'ar' ? 'التحول الرقمي' : 'Digital Transformation'}
            </span>
            <h3 className="text-xl md:text-2xl font-light text-white">
              {language === 'ar' ? 'مستعد للمستقبل' : 'Future Ready'}
            </h3>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-[15px] relative">
              <motion.div 
                className="w-1 h-2 bg-primary rounded-sm absolute left-1/2 -translate-x-1/2"
                animate={{ top: [8, 28, 8], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-white/60">
              {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll to Explore'}
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
