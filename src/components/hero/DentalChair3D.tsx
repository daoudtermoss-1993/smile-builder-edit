import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

// Chair images from external URLs
const CHAIR_SOLID_URL = "https://a.lovart.ai/artifacts/agent/eCYhzwystv5TzpHS.png";
const CHAIR_WIRE_URL = "https://a.lovart.ai/artifacts/agent/UhM1KsXb5FdhwtEw.png";

// Utility functions
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const mapRange = (value: number, low1: number, high1: number, low2: number, high2: number) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

// Particle type
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  color: string;
}

// Generate particles
const generateParticles = (count: number): Particle[] => {
  const colors = [
    'hsl(180, 70%, 50%)', // Cyan
    'hsl(160, 60%, 45%)', // Teal
    'hsl(200, 80%, 55%)', // Light blue
    'hsl(140, 50%, 40%)', // Green
    'hsl(220, 70%, 60%)', // Blue
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

export function DentalChair3D() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothedProgress, setSmoothedProgress] = useState(0);
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  
  const { scrollY } = useScroll();
  
  // Generate particles once
  const particles = useMemo(() => generateParticles(50), []);
  
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
      // Smooth scroll tracking
      currentScrollRef.current = lerp(currentScrollRef.current, targetScrollRef.current, 0.08);
      
      if (containerRef.current) {
        const triggerHeight = containerRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollDistance = triggerHeight - viewportHeight;
        const rawProgress = (currentScrollRef.current - containerRef.current.offsetTop) / scrollDistance;
        
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
    handleScroll(); // Initial call
    animate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Calculate 3D transforms based on progress
  const p = smoothedProgress;
  
  // Rotation
  const rotateY = p * 360;
  const rotateX = Math.sin(p * Math.PI * 2) * 20;
  const rotateZ = Math.sin(p * Math.PI) * 10;
  
  // Scale - Start 0.8, Mid 1.3, End 1.0
  let scale: number;
  if (p < 0.5) {
    scale = mapRange(p, 0, 0.5, 0.8, 1.3);
  } else {
    scale = mapRange(p, 0.5, 1.0, 1.3, 1.0);
  }
  
  // TranslateZ
  const translateZ = mapRange(p, 0, 1, -200, 200);
  
  // Opacity crossfade between solid and wireframe
  let solidOpacity: number;
  let wireOpacity: number;
  
  if (p < 0.3) {
    solidOpacity = 1;
    wireOpacity = 0;
  } else if (p > 0.7) {
    solidOpacity = 0;
    wireOpacity = 1;
  } else {
    const fadeProgress = mapRange(p, 0.3, 0.7, 0, 1);
    solidOpacity = 1 - fadeProgress;
    wireOpacity = fadeProgress;
  }
  
  // Parallax background
  const parallaxY = p * 200;
  
  // Text visibility
  const text1Visible = p > 0.1 && p < 0.3;
  const text2Visible = p > 0.4 && p < 0.6;
  const text3Visible = p > 0.8 && p < 0.98;
  
  // Hero content fade out
  const heroOpacity = useTransform(smoothScrollY, [0, window.innerHeight * 0.5], [1, 0]);
  const heroY = useTransform(smoothScrollY, [0, window.innerHeight * 0.5], [0, -50]);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div 
          className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero Section */}
      <header className="h-screen w-full flex flex-col justify-center items-center relative z-10 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsl(180 20% 12%) 0%, hsl(180 30% 3%) 70%)'
          }}
        />
        
        <motion.div 
          className="relative z-10 text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.h1 
            className="font-bold text-[clamp(3rem,10vw,7.5rem)] leading-[1.1] tracking-tight uppercase bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German'}
          </motion.h1>
          <motion.p 
            className="text-primary text-lg md:text-2xl tracking-[0.25em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {language === 'ar' ? 'الدقة الرقمية والعناية' : 'Digital Precision & Care'}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="w-[30px] h-[50px] border-2 border-white/30 rounded-[15px] relative">
            <motion.div 
              className="w-1 h-2 bg-primary rounded-sm absolute left-1/2 -translate-x-1/2"
              animate={{ top: [10, 30, 10], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <span className="text-sm tracking-[0.15em] uppercase text-white/70">
            {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll to Explore'}
          </span>
        </motion.div>
      </header>

      {/* 3D Scroll Trigger Section */}
      <section 
        ref={containerRef}
        className="dental-3d-trigger h-[400vh] relative z-0"
        id="scrollTrigger"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex justify-center items-center dental-3d-perspective">
          {/* Background Elements */}
          <div 
            className="dental-bg-element dental-bg-1"
            style={{
              transform: `translateY(${-parallaxY}px) scale(${1 + p * 0.2})`
            }}
          />
          <div 
            className="dental-bg-element dental-bg-2"
            style={{
              transform: `translateY(${parallaxY}px) scale(${1 - p * 0.1})`
            }}
          />
          <div className="dental-grid-lines" />

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  width: particle.size,
                  height: particle.size,
                  background: particle.color,
                  boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                  filter: 'blur(0.5px)',
                }}
                animate={{
                  y: [0, -window.innerHeight],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: particle.speed,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* 3D Scene */}
          <div className="dental-scene-3d">
            {/* Glow effect behind chair */}
            <div 
              className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, 
                  hsla(${180 + p * 40}, 70%, 50%, ${0.3 + p * 0.2}) 0%, 
                  hsla(${160 + p * 60}, 60%, 40%, ${0.1 + p * 0.1}) 40%, 
                  transparent 70%)`,
                transform: `scale(${1 + p * 0.5})`,
                filter: 'blur(30px)',
              }}
            />
            
            <div 
              className="dental-chair-container"
              style={{
                transform: `
                  scale(${scale})
                  rotateX(${rotateX}deg) 
                  rotateY(${rotateY}deg) 
                  rotateZ(${rotateZ}deg)
                  translateZ(${translateZ}px)
                `,
                filter: `drop-shadow(0 0 ${20 + p * 30}px hsla(${180 + p * 40}, 70%, 50%, ${0.4 + p * 0.3}))`,
              }}
            >
              {/* Solid Chair */}
              <img 
                src={CHAIR_SOLID_URL}
                alt="Dental Chair Solid"
                className="dental-chair-img dental-chair-solid"
                style={{ 
                  opacity: solidOpacity,
                  filter: `hue-rotate(${p * 30}deg) saturate(${1 + p * 0.5})`,
                }}
                draggable={false}
              />
              {/* Wireframe Chair */}
              <img 
                src={CHAIR_WIRE_URL}
                alt="Dental Chair Wireframe"
                className="dental-chair-img dental-chair-wire"
                style={{ 
                  opacity: wireOpacity,
                  filter: `hue-rotate(${-p * 20}deg) brightness(${1.2 + p * 0.3})`,
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Floating Text Elements */}
          <div 
            className={`dental-feature-text dental-text-1 ${text1Visible ? 'visible' : ''}`}
          >
            <span>{language === 'ar' ? 'المرحلة ٠١' : 'Phase 01'}</span>
            {language === 'ar' ? 'تصميم مريح' : 'Ergonomic Design'}
          </div>
          <div 
            className={`dental-feature-text dental-text-2 ${text2Visible ? 'visible' : ''}`}
          >
            <span>{language === 'ar' ? 'المرحلة ٠٢' : 'Phase 02'}</span>
            {language === 'ar' ? 'التكامل الرقمي' : 'Digital Integration'}
          </div>
          <div 
            className={`dental-feature-text dental-text-3 ${text3Visible ? 'visible' : ''}`}
          >
            <span>{language === 'ar' ? 'المرحلة النهائية' : 'Final Phase'}</span>
            {language === 'ar' ? 'جاهز للمستقبل' : 'Ready for Future'}
          </div>
        </div>
      </section>
    </>
  );
}
