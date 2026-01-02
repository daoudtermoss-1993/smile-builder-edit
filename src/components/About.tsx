import {
  motion,
  useScroll,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import React, { useRef, useState, useEffect, useId } from "react";
import { EditableMedia } from "@/components/admin/EditableMedia";


// ============================================
// CONFIGURATION - Modifiez ces valeurs selon vos besoins
// ============================================
const CONFIG = {
  // Frame / Cadre
  cornerRadius: 80,        // Rayon des coins principaux
  notchRadius: 50,         // Rayon des coins du notch
  notchDepth: 75,          // Profondeur du notch
  notchHeight: 140,        // Hauteur du notch
  borderInset: 1.5,        // Épaisseur de la bordure
  
  // Mobile config
  mobileNotchHeight: 100,  // Hauteur du notch sur mobile
  mobileNotchDepth: 50,    // Profondeur du notch sur mobile
  mobileCornerRadius: 40,  // Rayon des coins sur mobile
  mobileNotchRadius: 30,   // Rayon des coins du notch sur mobile
  
  // Couleurs
  borderColor: "hsl(var(--primary) / 0.95)", // Couleur de la bordure (teal)
  notchFillColor: "hsl(var(--background))", // Remplissage du notch (même que le fond)

  // Scroll ranges (0 à 1)
  titleRange: [0, 0.15],           // Quand le titre apparaît/disparaît
  infoItemsRange: [0.15, 0.65],    // Quand les info items défilent
};

// ============================================
// ANNOTATION COMPONENT - Labels animés sur l'image
// ============================================
interface AnnotationProps {
  label: string;
  value?: string;
  position: { x: string; y: string };
  delay?: number;
  accentColor?: string;
  scrollProgress?: number;
  showAt?: [number, number];
}

const ScrollAnnotation = ({ 
  label, 
  value, 
  position, 
  delay = 0, 
  accentColor = CONFIG.borderColor,
  scrollProgress = 0,
  showAt = [0, 1],
}: AnnotationProps) => {
  const isVisible = scrollProgress >= showAt[0] && scrollProgress <= showAt[1];
  
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 15,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ duration: 0.5, delay: isVisible ? delay : 0, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-0.5">
        <span 
          className="text-[10px] tracking-[0.2em] uppercase font-medium"
          style={{ color: accentColor }}
        >
          {label}
        </span>
        {value && (
          <span className="text-white/90 text-sm font-semibold tracking-wide">
            {value}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// TERMINAL CONTAINER - Cadre avec notch animé
// ============================================
interface TerminalContainerProps {
  children: React.ReactNode;
  className?: string;
  scrollProgress?: number;
  onNotchPositionChange?: (y: number) => void;
  isMobile?: boolean;
  notchPosition?: 'left' | 'bottom';
}

const TerminalContainer = ({ 
  children, 
  className = "", 
  scrollProgress = 0, 
  onNotchPositionChange,
  isMobile = false,
  notchPosition = 'left'
}: TerminalContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 800 });
  const [smoothNotchProgress, setSmoothNotchProgress] = useState(0);

  // Mesure les dimensions du conteneur
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Motion values pour un notch fluide et stable (évite l'effet "double notch" au scroll rapide)
  const rawProgress = useMotionValue(scrollProgress);
  const springProgress = useSpring(rawProgress, {
    stiffness: 220,
    damping: 34,
    mass: 0.8,
  });

  useEffect(() => {
    rawProgress.set(scrollProgress);
  }, [scrollProgress, rawProgress]);

  useMotionValueEvent(springProgress, "change", (v) => {
    setSmoothNotchProgress(v);
  });
  
  const { width, height } = dimensions;
  
  // Use mobile-specific values
  const cornerRadius = isMobile ? CONFIG.mobileCornerRadius : CONFIG.cornerRadius;
  const notchRadius = isMobile ? CONFIG.mobileNotchRadius : CONFIG.notchRadius;
  const notchDepth = isMobile ? CONFIG.mobileNotchDepth : CONFIG.notchDepth;
  const notchHeight = isMobile ? CONFIG.mobileNotchHeight : CONFIG.notchHeight;
  const borderInset = CONFIG.borderInset;
  
  // Easing pour le mouvement du notch - reste visible à la fin
  const easedProgress = smoothNotchProgress * smoothNotchProgress * (3 - 2 * smoothNotchProgress);
  const clampedProgress = Math.min(easedProgress, 1);
  
  // Different path generation based on notch position
  let framePath: string;
  let notchAreaPath: string;
  
  if (notchPosition === 'bottom') {
    // Notch on bottom, moves from left to right
    const minNotchLeft = 60;
    const maxNotchLeft = width - notchHeight - 60;
    const notchLeft = minNotchLeft + (clampedProgress * (maxNotchLeft - minNotchLeft));
    const notchRight = notchLeft + notchHeight;
    const notchCenterX = notchLeft + notchHeight / 2;
    
    useEffect(() => {
      if (onNotchPositionChange) {
        onNotchPositionChange(notchCenterX);
      }
    }, [notchCenterX, onNotchPositionChange]);
    
    // Frame path with notch on bottom
    framePath = `
      M ${borderInset} ${cornerRadius}
      Q ${borderInset} ${borderInset}, ${cornerRadius} ${borderInset}
      L ${width - cornerRadius} ${borderInset}
      Q ${width - borderInset} ${borderInset}, ${width - borderInset} ${cornerRadius}
      L ${width - borderInset} ${height - cornerRadius}
      Q ${width - borderInset} ${height - borderInset}, ${width - cornerRadius} ${height - borderInset}
      L ${notchRight + notchRadius} ${height - borderInset}
      Q ${notchRight} ${height - borderInset}, ${notchRight} ${height - notchRadius}
      L ${notchRight} ${height - notchDepth + notchRadius}
      Q ${notchRight} ${height - notchDepth}, ${notchRight - notchRadius} ${height - notchDepth}
      L ${notchLeft + notchRadius} ${height - notchDepth}
      Q ${notchLeft} ${height - notchDepth}, ${notchLeft} ${height - notchDepth + notchRadius}
      L ${notchLeft} ${height - notchRadius}
      Q ${notchLeft} ${height - borderInset}, ${notchLeft - notchRadius} ${height - borderInset}
      L ${cornerRadius} ${height - borderInset}
      Q ${borderInset} ${height - borderInset}, ${borderInset} ${height - cornerRadius}
      Z
    `;
    
    // Notch fill path
    notchAreaPath = `
      M ${notchLeft} ${height}
      L ${notchRight} ${height}
      L ${notchRight} ${height - notchDepth + notchRadius}
      Q ${notchRight} ${height - notchDepth}, ${notchRight - notchRadius} ${height - notchDepth}
      L ${notchLeft + notchRadius} ${height - notchDepth}
      Q ${notchLeft} ${height - notchDepth}, ${notchLeft} ${height - notchDepth + notchRadius}
      Z
    `;
  } else {
    // Original left-side notch
    const minNotchTop = 100;
    const maxNotchTop = height - notchHeight - 150;
    const notchTop = minNotchTop + (clampedProgress * (maxNotchTop - minNotchTop));
    const notchBottom = notchTop + notchHeight;
    const notchCenterY = notchTop + notchHeight / 2;
    
    useEffect(() => {
      if (onNotchPositionChange) {
        onNotchPositionChange(notchCenterY);
      }
    }, [notchCenterY, onNotchPositionChange]);
    
    framePath = `
      M ${borderInset} ${cornerRadius}
      Q ${borderInset} ${borderInset}, ${cornerRadius} ${borderInset}
      L ${width - cornerRadius} ${borderInset}
      Q ${width - borderInset} ${borderInset}, ${width - borderInset} ${cornerRadius}
      L ${width - borderInset} ${height - cornerRadius}
      Q ${width - borderInset} ${height - borderInset}, ${width - cornerRadius} ${height - borderInset}
      L ${cornerRadius} ${height - borderInset}
      Q ${borderInset} ${height - borderInset}, ${borderInset} ${height - cornerRadius}
      L ${borderInset} ${notchBottom + notchRadius}
      Q ${borderInset} ${notchBottom}, ${notchRadius} ${notchBottom}
      L ${notchDepth - notchRadius} ${notchBottom}
      Q ${notchDepth} ${notchBottom}, ${notchDepth} ${notchBottom - notchRadius}
      L ${notchDepth} ${notchTop + notchRadius}
      Q ${notchDepth} ${notchTop}, ${notchDepth - notchRadius} ${notchTop}
      L ${notchRadius} ${notchTop}
      Q ${borderInset} ${notchTop}, ${borderInset} ${notchTop - notchRadius}
      L ${borderInset} ${cornerRadius}
      Z
    `;
    
    notchAreaPath = `
      M 0 ${notchTop}
      L 0 ${notchBottom}
      Q 0 ${notchBottom}, ${notchRadius} ${notchBottom}
      L ${notchDepth - notchRadius} ${notchBottom}
      Q ${notchDepth} ${notchBottom}, ${notchDepth} ${notchBottom - notchRadius}
      L ${notchDepth} ${notchTop + notchRadius}
      Q ${notchDepth} ${notchTop}, ${notchDepth - notchRadius} ${notchTop}
      L ${notchRadius} ${notchTop}
      Q 0 ${notchTop}, 0 ${notchTop}
      Z
    `;
  }
  
  // ID unique pour le clipPath
  const reactId = useId();
  const safeId = reactId.replace(/[:]/g, "");
  const clipPathId = `terminal-clip-${safeId}`;
  const clipUrl = `url(#${clipPathId})`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Définition du clipPath SVG */}
      <svg
        className="absolute pointer-events-none"
        width={0}
        height={0}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
            <path d={framePath} />
          </clipPath>
        </defs>
      </svg>

      {/* Remplissage blanc du notch */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[25]"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <path d={notchAreaPath} fill={CONFIG.notchFillColor} />
      </svg>

      {/* Contenu clippé au cadre */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          clipPath: clipUrl,
          WebkitClipPath: clipUrl,
        }}
      >
        {children}
      </div>

      {/* Bordure animée */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[30]"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`terminalBorder-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary) / 0.95)" }} />
            <stop offset="40%" style={{ stopColor: "hsl(var(--primary) / 0.7)" }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--primary) / 0.35)" }} />
          </linearGradient>
        </defs>
        <motion.path
          d={framePath}
          fill="none"
          stroke={`url(#terminalBorder-${safeId})`}
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// ============================================
// SCROLL INFO ITEMS - Éléments qui défilent
// ============================================
interface ScrollInfoItem {
  id: string;
  label: string;
  value: string;
  description?: string;
}

const scrollInfoItems: ScrollInfoItem[] = [
  { id: "1", label: "EXPERIENCE", value: "15+ years", description: "of dental excellence" },
  { id: "2", label: "PATIENTS", value: "5,000+ smiles", description: "transformed with care" },
  { id: "3", label: "SPECIALTY", value: "Cosmetic dentistry", description: "premium aesthetics" },
];


// ============================================
// ABOUT COMPONENT - Section principale
// ============================================
interface AboutProps {
  doctorImage?: string;
  doctorName: string;
  description: string;
}

export const About = ({ 
  doctorImage = "/placeholder.svg",
  doctorName,
  description,
}: AboutProps) => {
  const aboutRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Progress du scroll pour la section pinnée
  const { scrollYProgress: pinnedScrollProgress } = useScroll({
    target: aboutRef,
    offset: ["start start", "end end"]
  });
  
  const [currentProgress, setCurrentProgress] = useState(0);
  
  useEffect(() => {
    let raf = 0;
    const unsubscribe = pinnedScrollProgress.on("change", (v) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCurrentProgress(v));
    });
    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, [pinnedScrollProgress]);
  
  const smoothProgress = Math.max(0, Math.min(1, currentProgress));
  
  return (
    <section 
      id="about" 
      ref={aboutRef} 
      className="relative bg-white"
      style={{ height: isMobile ? '250vh' : '350vh' }}
    >
      {/* Contenu pinnné */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-start">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-10 lg:px-[4vw] pt-16 sm:pt-20 md:pt-24 lg:pt-32">
        
          {/* Mobile Layout: Video first, then text */}
          {isMobile ? (
            <div className="flex flex-col gap-4">
              {/* Video Frame with bottom notch moving left to right */}
              <motion.div
                ref={mediaRef}
                className="relative w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <TerminalContainer 
                  className="w-full h-[280px] sm:h-[320px]"
                  scrollProgress={smoothProgress}
                  isMobile={true}
                  notchPosition="bottom"
                >
                  <div className="relative w-full h-full bg-[#0a0f14] overflow-hidden">
                    {/* Grille subtile */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-[1]"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px',
                      }}
                    />

                    {/* Image/Vidéo - avec hauteur et largeur forcées */}
                    <div className="absolute inset-0 z-[5]">
                      <EditableMedia
                        sectionKey="about"
                        field="doctorMedia"
                        defaultSrc={doctorImage}
                        alt={doctorName}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    {/* Overlays de gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/70 via-transparent to-[#0a0f14]/20 pointer-events-none z-[10]" />
                  </div>
                </TerminalContainer>
              </motion.div>

              {/* Stats cards appearing with notch movement */}
              <div className="relative h-[280px] sm:h-[320px]">
                {scrollInfoItems.map((item, index) => {
                  const [rangeStart, rangeEnd] = CONFIG.infoItemsRange;
                  const scrollRange = rangeEnd - rangeStart;
                  const totalItems = scrollInfoItems.length;
                  const itemWindow = scrollRange / totalItems;
                  const itemStart = rangeStart + index * itemWindow;
                  const itemEnd = itemStart + itemWindow;
                  
                  const rawProgress = (smoothProgress - itemStart) / itemWindow;
                  const itemProgress = Math.max(0, Math.min(1, rawProgress));
                  
                  const isFocused = smoothProgress >= itemStart && smoothProgress < itemEnd;
                  const isPast = smoothProgress >= itemEnd;
                  
                  let opacity = 0;
                  if (isFocused) {
                    if (itemProgress < 0.15) {
                      opacity = itemProgress / 0.15;
                    } else if (itemProgress > 0.85) {
                      opacity = 1 - ((itemProgress - 0.85) / 0.15);
                    } else {
                      opacity = 1;
                    }
                  }
                  
                  // Horizontal movement from left to right for mobile
                  let x = -100;
                  if (isFocused) {
                    x = -100 + (itemProgress * 200);
                  } else if (isPast) {
                    x = 120;
                  }

                  return (
                    <motion.div
                      key={item.id}
                      className="absolute top-4 left-0 right-0 terminal-text-reveal"
                      style={{
                        opacity,
                        transform: `translate3d(${x}px, 0, 0)`,
                        willChange: "transform, opacity",
                      }}
                    >
                      <div className="bg-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/20 terminal-card-glow mx-4">
                        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase mb-1 block">
                          <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
                            {item.label}
                          </span>
                        </span>
                        <h3 className="text-xl font-bold leading-tight terminal-glow-text">
                          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                            {item.value}
                          </span>
                        </h3>
                        {item.description && (
                          <span className="text-xs text-muted-foreground mt-1 block terminal-fade-text">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Title at bottom for mobile */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 px-4"
                  style={{
                    opacity: smoothProgress < 0.15 ? 1 : Math.max(0, 1 - (smoothProgress - 0.15) * 5),
                  }}
                >
                  <h2 className="text-xl font-bold leading-tight mb-2 terminal-glow-text">
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                      Meet {doctorName}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed terminal-fade-text line-clamp-2">
                    {description}
                  </p>
                </motion.div>
              </div>
            </div>
          ) : (
            /* Desktop Layout: Original side by side */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 sm:gap-8 lg:gap-8 items-start">
            
              {/* Côté gauche - Contenu texte avec animation Terminal Industries */}
              <div className="relative space-y-4 sm:space-y-6">
                <div className="max-w-lg relative h-48 sm:h-56 md:h-64 lg:h-72">
                  {/* Titre animé avec scanline/glow Terminal Industries */}
                  {(() => {
                    const [titleStart, titleEnd] = CONFIG.titleRange;
                    const titleRaw = (smoothProgress - titleStart) / (titleEnd - titleStart);
                    const titleProgress = Math.max(0, Math.min(1, titleRaw));
                    
                    let titleOpacity = 0;
                    let titleY = -80;
                    const isTitleActive = smoothProgress >= titleStart && smoothProgress < titleEnd;
                    
                    if (isTitleActive) {
                      if (titleProgress < 0.15) {
                        titleOpacity = titleProgress / 0.15;
                      } else if (titleProgress > 0.85) {
                        titleOpacity = 1 - ((titleProgress - 0.85) / 0.15);
                      } else {
                        titleOpacity = 1;
                      }
                      titleY = -80 + (titleProgress * 330);
                    }
                    
                    return (
                      <motion.div
                        className="absolute top-4 sm:top-6 md:top-8 left-0 w-full terminal-text-reveal"
                        style={{
                          opacity: titleOpacity,
                          transform: `translate3d(0, ${titleY}px, 0)`,
                          willChange: "transform, opacity",
                        }}
                      >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4 terminal-glow-text">
                          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                            Meet {doctorName}
                          </span>
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed terminal-fade-text">
                          {description}
                        </p>
                      </motion.div>
                    );
                  })()}
                </div>

                {/* Info items animés */}
                <div className="relative h-64 sm:h-72 md:h-80 lg:h-96">
                  {scrollInfoItems.map((item, index) => {
                    const [rangeStart, rangeEnd] = CONFIG.infoItemsRange;
                    const scrollRange = rangeEnd - rangeStart;
                    const totalItems = scrollInfoItems.length;
                    const itemWindow = scrollRange / totalItems;
                    const itemStart = rangeStart + index * itemWindow;
                    const itemEnd = itemStart + itemWindow;
                    
                    const rawProgress = (smoothProgress - itemStart) / itemWindow;
                    const itemProgress = Math.max(0, Math.min(1, rawProgress));
                    
                    const isFocused = smoothProgress >= itemStart && smoothProgress < itemEnd;
                    const isPast = smoothProgress >= itemEnd;
                    
                    let opacity = 0;
                    if (isFocused) {
                      if (itemProgress < 0.15) {
                        opacity = itemProgress / 0.15;
                      } else if (itemProgress > 0.85) {
                        opacity = 1 - ((itemProgress - 0.85) / 0.15);
                      } else {
                        opacity = 1;
                      }
                    }
                    
                    let y = -120;
                    if (isFocused) {
                      y = -120 + (itemProgress * 320);
                    } else if (isPast) {
                      y = 200;
                    }

                    return (
                      <motion.div
                        key={item.id}
                        className="absolute top-0 left-0 w-full max-w-md terminal-text-reveal"
                        style={{
                          opacity,
                          transform: `translate3d(0, ${y}px, 0)`,
                          willChange: "transform, opacity",
                        }}
                      >
                        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg border border-primary/20 terminal-card-glow">
                          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase mb-1 sm:mb-2 block">
                            <span className="bg-gradient-to-r from-primary via-primary/70 to-primary bg-clip-text text-transparent">
                              {item.label}
                            </span>
                          </span>
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight terminal-glow-text">
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                              {item.value}
                            </span>
                          </h3>
                          {item.description && (
                            <span className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1 sm:mt-2 block terminal-fade-text">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Côté droit - Image avec cadre */}
              <div className="relative lg:min-h-[800px]">
                <motion.div
                  ref={mediaRef}
                  className="relative"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <TerminalContainer 
                    className="w-full h-[400px] sm:h-[500px] md:h-[650px] lg:h-[800px]"
                    scrollProgress={smoothProgress}
                  >
                    <div className="relative w-full h-full bg-[#0a0f14]">
                      {/* Grille subtile */}
                      <div 
                        className="absolute inset-0 pointer-events-none z-[1]"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                          `,
                          backgroundSize: '40px 40px',
                        }}
                      />

                      {/* Points flottants animés */}
                      <div className="absolute inset-0 overflow-hidden z-[2]">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                              width: i % 3 === 0 ? 3 : 2,
                              height: i % 3 === 0 ? 3 : 2,
                              left: `${(i * 41 + 7) % 100}%`,
                              top: `${(i * 59 + 11) % 100}%`,
                              backgroundColor:
                                i % 4 === 0
                                  ? "hsl(var(--primary) / 0.6)"
                                  : "hsl(var(--primary-foreground) / 0.2)",
                            }}
                            animate={{
                              opacity: [0.3, 0.7, 0.3],
                              scale: [1, 1.15, 1],
                            }}
                            transition={{
                              duration: 3 + (i % 3),
                              repeat: Infinity,
                              delay: (i % 5) * 0.4,
                            }}
                          />
                        ))}
                      </div>

                      {/* Image/Vidéo (fixe) + édition admin */}
                      <div className="relative z-[5] h-full w-full">
                        <EditableMedia
                          sectionKey="about"
                          field="doctorMedia"
                          defaultSrc={doctorImage}
                          alt={doctorName}
                          className="h-full w-full"
                        />
                      </div>

                      {/* Overlays de gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/80 via-transparent to-[#0a0f14]/30 pointer-events-none z-[10]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f14]/70 via-transparent to-transparent pointer-events-none z-[10]" />

                      {/* Accent coin */}
                      <svg className="absolute bottom-3 right-3 w-10 h-10 z-[15]" viewBox="0 0 40 40" fill="none">
                        <motion.path 
                          d="M40 0 L40 24 Q40 40 24 40 L0 40" 
                          stroke="hsl(var(--primary) / 0.5)" 
                          strokeWidth="1.5" 
                          fill="none"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                        />
                      </svg>
                    </div>
                  </TerminalContainer>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
