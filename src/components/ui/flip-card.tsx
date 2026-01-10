import { useState, useCallback, useMemo, ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FlipCardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  flipDirection?: "horizontal" | "vertical";
  flipTrigger?: "hover" | "click" | "auto";
  animationDuration?: number;
  perspective?: number;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
}

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function FlipCard({
  frontContent,
  backContent,
  flipDirection = "horizontal",
  flipTrigger = "hover",
  animationDuration = 0.6,
  perspective = 1000,
  className,
  frontClassName,
  backClassName,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    if (flipTrigger === "click") {
      setIsFlipped((prev) => !prev);
    }
  }, [flipTrigger]);

  const handleMouseEnter = useCallback(() => {
    if (flipTrigger === "hover") {
      setIsFlipped(true);
    }
  }, [flipTrigger]);

  const handleMouseLeave = useCallback(() => {
    if (flipTrigger === "hover") {
      setIsFlipped(false);
    }
  }, [flipTrigger]);

  const rotationAxis = useMemo(() => {
    return flipDirection === "horizontal" ? "rotateY" : "rotateX";
  }, [flipDirection]);

  const frontRotation = useMemo(() => {
    return isFlipped ? `${rotationAxis}(180deg)` : `${rotationAxis}(0deg)`;
  }, [isFlipped, rotationAxis]);

  const backRotation = useMemo(() => {
    return isFlipped ? `${rotationAxis}(0deg)` : `${rotationAxis}(-180deg)`;
  }, [isFlipped, rotationAxis]);

  return (
    <div
      className={cn("relative w-full h-full cursor-pointer", className)}
      style={{ perspective: `${perspective}px` }}
      onClick={handleFlip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Front Side */}
      <motion.div
        className={cn(
          "absolute inset-0 w-full h-full rounded-2xl overflow-hidden",
          frontClassName
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
        animate={{ transform: frontRotation }}
        transition={{
          duration: animationDuration,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {frontContent}
      </motion.div>

      {/* Back Side */}
      <motion.div
        className={cn(
          "absolute inset-0 w-full h-full rounded-2xl overflow-hidden",
          backClassName
        )}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
        animate={{ transform: backRotation }}
        transition={{
          duration: animationDuration,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {backContent}
      </motion.div>
    </div>
  );
}

// Service-specific FlipCard component
export interface ServiceFlipCardData {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

interface ServiceFlipCardsProps {
  cards: ServiceFlipCardData[];
  className?: string;
}

export function ServiceFlipCards({ cards, className }: ServiceFlipCardsProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8", className)}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="h-[280px] sm:h-[300px] md:h-[320px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          <FlipCard
            flipTrigger={isMobile ? "click" : "hover"}
            animationDuration={0.7}
            perspective={1200}
            frontContent={
              <div 
                className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-terminal-muted/80 to-terminal-dark border border-white/10 rounded-2xl group"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* Icon Container */}
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-terminal-accent/20 to-terminal-accent/5 flex items-center justify-center mb-4 sm:mb-6 border border-terminal-accent/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-terminal-accent">
                    {card.icon}
                  </div>
                </motion.div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-white text-center mb-2">
                  {card.title}
                </h3>

                {/* Flip Hint - adapts to mobile/desktop */}
                <div className="flex items-center gap-2 text-white/40 text-xs sm:text-sm mt-auto">
                  {isMobile ? (
                    <>
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" 
                        />
                      </svg>
                      <span>Tap to flip</span>
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      </svg>
                      <span>Hover to flip</span>
                    </>
                  )}
                </div>

                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-terminal-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            }
            backContent={
              <div 
                className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-terminal-accent/90 to-terminal-accent/70 rounded-2xl cursor-pointer"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 209, 178, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
                onClick={card.onClick}
              >
                {/* Back Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                  <div className="text-white">
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed flex-1">
                  {card.description}
                </p>

                {/* CTA Button */}
                <motion.button
                  className="mt-4 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    card.onClick?.();
                  }}
                >
                  <span>En savoir plus</span>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                </motion.button>
              </div>
            }
          />
        </motion.div>
      ))}
    </div>
  );
}
