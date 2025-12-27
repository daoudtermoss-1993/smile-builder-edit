import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useState, useEffect, useId } from "react";
import { EditableMedia } from "@/components/admin/EditableMedia";
import { useEditable } from "@/contexts/EditableContext";

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
  
  // Couleurs
  borderColor: "rgba(180,230,100,0.95)",  // Couleur de la bordure (lime/jaune-vert)
  notchFillColor: "white",                 // Couleur de remplissage du notch
  
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
}

const TerminalContainer = ({ 
  children, 
  className = "", 
  scrollProgress = 0, 
  onNotchPositionChange 
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
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Animation ultra-fluide du notch avec lerp
  useEffect(() => {
    let animationFrame: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    
    const animate = () => {
      setSmoothNotchProgress(prev => {
        const diff = Math.abs(scrollProgress - prev);
        const factor = diff > 0.1 ? 0.06 : 0.04;
        return lerp(prev, scrollProgress, factor);
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollProgress]);
  
  const { width, height } = dimensions;
  const { cornerRadius, notchRadius, notchDepth, notchHeight, borderInset } = CONFIG;
  
  // Easing pour le mouvement du notch
  const easedProgress = smoothNotchProgress * smoothNotchProgress * (3 - 2 * smoothNotchProgress);
  
  // Position du notch basée sur le scroll
  const minNotchTop = 100;
  const maxNotchTop = height - notchHeight - 150;
  const notchTop = minNotchTop + (easedProgress * (maxNotchTop - minNotchTop));
  const notchBottom = notchTop + notchHeight;
  const notchCenterY = notchTop + notchHeight / 2;
  
  useEffect(() => {
    if (onNotchPositionChange) {
      onNotchPositionChange(notchCenterY);
    }
  }, [notchCenterY, onNotchPositionChange]);
  
  // Chemin SVG pour le cadre (utilisé pour clip ET bordure)
  const framePath = `
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
  
  // Chemin pour le remplissage blanc du notch
  const notchAreaPath = `
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
        <path
          d={notchAreaPath}
          fill={CONFIG.notchFillColor}
          style={{ transition: 'd 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
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
            <stop offset="0%" stopColor="rgba(180,230,100,0.95)" />
            <stop offset="40%" stopColor="rgba(180,230,100,0.7)" />
            <stop offset="100%" stopColor="rgba(180,230,100,0.4)" />
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
          style={{ transition: 'd 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
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
  const { isEditMode } = useEditable();
  const [notchY, setNotchY] = useState(300);
  
  const aboutRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  
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
      style={{ height: '350vh' }}
    >
      {/* Contenu pinnné */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-start">
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-10 lg:px-[4vw] pt-28 lg:pt-32">
        
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-8 items-start">
          
            {/* Côté gauche - Contenu texte */}
            <div className="relative space-y-6">
              <div className="max-w-lg relative h-64 lg:h-72">
                <span className="text-sm font-medium text-gray-500 tracking-widest uppercase mb-6 block">
                  01 — About
                </span>
                
                {/* Titre animé */}
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
                    <div
                      className="absolute top-8 left-0 w-full"
                      style={{
                        opacity: titleOpacity,
                        transform: `translate3d(0, ${titleY}px, 0)`,
                        willChange: "transform, opacity",
                      }}
                    >
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Meet {doctorName}
                      </h2>
                      <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Info items animés */}
              <div className="relative h-80 lg:h-96">
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
                    <div
                      key={item.id}
                      className="absolute top-0 left-0 w-full max-w-md"
                      style={{
                        opacity,
                        transform: `translate3d(0, ${y}px, 0)`,
                        willChange: "transform, opacity",
                      }}
                    >
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 lg:p-6 shadow-lg border border-lime-200">
                        <span className="text-[10px] font-semibold text-lime-600 tracking-[0.25em] uppercase mb-2 block">
                          {item.label}
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                          {item.value}
                        </h3>
                        {item.description && (
                          <span className="text-sm lg:text-base text-gray-600 mt-2 block">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Indicateur de progression */}
                <div className="absolute -left-4 top-0 w-[2px] h-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="w-full bg-lime-500/60 rounded-full origin-top"
                    style={{ 
                      transform: `scaleY(${Math.min(1, (smoothProgress - 0.15) / 0.50)})`,
                    }}
                  />
                </div>
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
                  className="w-full h-[550px] md:h-[650px] lg:h-[800px]"
                  scrollProgress={smoothProgress}
                  onNotchPositionChange={setNotchY}
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
                            backgroundColor: i % 4 === 0 ? 'rgba(180,230,100,0.6)' : 'rgba(255,255,255,0.2)',
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

                    {/* Image/Vidéo avec effet parallax et édition admin */}
                    <motion.div 
                      className="relative z-[5] h-[120%] w-full"
                      style={{
                        y: useTransform(
                          pinnedScrollProgress,
                          [0, 1],
                          ['-10%', '10%']
                        ),
                      }}
                    >
                      <EditableMedia
                        sectionKey="about"
                        field="doctorMedia"
                        defaultSrc={doctorImage}
                        alt={doctorName}
                        className="h-full w-full"
                      />
                    </motion.div>

                    {/* Overlays de gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/80 via-transparent to-[#0a0f14]/30 pointer-events-none z-[10]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f14]/70 via-transparent to-transparent pointer-events-none z-[10]" />

                    {/* Accent coin */}
                    <svg className="absolute bottom-3 right-3 w-10 h-10 z-[15]" viewBox="0 0 40 40" fill="none">
                      <motion.path 
                        d="M40 0 L40 24 Q40 40 24 40 L0 40" 
                        stroke="rgba(180,230,100,0.5)" 
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
        </div>
      </div>
    </section>
  );
};
