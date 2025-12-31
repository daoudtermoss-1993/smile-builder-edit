import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Card3DData {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  onClick?: () => void;
}

interface Interactive3DCardsProps {
  cards: Card3DData[];
  className?: string;
}

const springTransition = {
  type: "spring" as const,
  damping: 28,
  mass: 1,
  stiffness: 280,
};

const smoothTransition = {
  type: "spring" as const,
  damping: 35,
  mass: 0.8,
  stiffness: 200,
};

export function Interactive3DCards({
  cards,
  className,
}: Interactive3DCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Show all 6 cards
  const visibleCards = cards.slice(0, 6);
  const totalCards = visibleCards.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Card Stack Container - responsive height */}
      <div 
        className="relative flex items-center justify-center h-[420px] sm:h-[480px] md:h-[540px]"
        style={{ 
          perspective: 1400,
        }}
      >
        {/* Navigation Arrows - smaller on mobile */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 md:left-12 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          aria-label="Previous card"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 md:right-12 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          aria-label="Next card"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div 
          className="relative w-[280px] h-[360px] sm:w-[300px] sm:h-[400px] md:w-[340px] md:h-[440px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <AnimatePresence mode="sync">
            {visibleCards.map((card, index) => (
              <StackedCard
                key={card.id}
                card={card}
                index={index}
                activeIndex={activeIndex}
                totalCards={visibleCards.length}
                onSelect={() => setActiveIndex(index)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
        {visibleCards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out",
              activeIndex === index
                ? "bg-primary w-6 sm:w-10"
                : "bg-white/20 w-1.5 sm:w-2 hover:bg-white/40"
            )}
            aria-label={`View ${card.title}`}
          />
        ))}
      </div>
      
      {/* Card Counter */}
      <div className="flex justify-center mt-3 sm:mt-4">
        <span className="text-xs sm:text-sm text-white/50 font-medium">
          {String(activeIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

interface StackedCardProps {
  card: Card3DData;
  index: number;
  activeIndex: number;
  totalCards: number;
  onSelect: () => void;
}

function StackedCard({
  card,
  index,
  activeIndex,
  totalCards,
  onSelect,
}: StackedCardProps) {
  const isActive = index === activeIndex;
  const isBehind = index < activeIndex;
  const isAhead = index > activeIndex;
  
  // Calculate position in stack
  const stackOffset = index - activeIndex;
  
  // Base 3D rotation for stacked effect
  const baseRotateX = -20;
  const baseRotateY = -40;
  
  // Calculate positions based on stack order
  const getTransform = () => {
    if (isActive) {
      return {
        x: 0,
        y: 0,
        z: 100,
        rotateX: 0,
        rotateY: 0,
        scale: 1.15,
        opacity: 1,
        brightness: 1,
      };
    }
    
    // Cards behind the active card
    if (isBehind) {
      const distance = activeIndex - index;
      return {
        x: -30 * distance,
        y: 20 * distance,
        z: -50 * distance,
        rotateX: baseRotateX,
        rotateY: baseRotateY,
        scale: 1 - 0.05 * distance,
        opacity: 0.5 - 0.15 * distance,
        brightness: 0.5,
      };
    }
    
    // Cards ahead of the active card  
    const distance = index - activeIndex;
    return {
      x: 40 * distance,
      y: -15 * distance,
      z: -40 * distance,
      rotateX: baseRotateX,
      rotateY: baseRotateY,
      scale: 1 - 0.03 * distance,
      opacity: 0.9 - 0.2 * distance,
      brightness: 0.7,
    };
  };

  const transform = getTransform();

  return (
    <motion.div
      className="absolute inset-0 cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        zIndex: isActive ? 50 : totalCards - Math.abs(stackOffset),
      }}
      initial={false}
      animate={{
        x: transform.x,
        y: transform.y,
        z: transform.z,
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: transform.scale,
        opacity: transform.opacity,
      }}
      transition={smoothTransition}
      onMouseEnter={onSelect}
      onClick={() => {
        if (isActive && card.onClick) {
          card.onClick();
        } else {
          onSelect();
        }
      }}
    >
      <div 
        className={cn(
          "w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden",
          "border border-white/20",
          "shadow-2xl",
          isActive && "shadow-primary/40"
        )}
        style={{
          filter: `brightness(${transform.brightness})`,
          transition: "filter 0.3s ease",
        }}
      >
        {/* Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-terminal-muted/90 via-terminal-dark/95 to-terminal-dark backdrop-blur-xl" />
        
        {/* Decorative Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
        
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>

        {/* Content - responsive padding */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6 md:p-8">
          {/* Icon - responsive size */}
          {card.icon && (
            <motion.div 
              className={cn(
                "mb-3 sm:mb-4 md:mb-5 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center",
                "bg-primary/20 backdrop-blur-sm border border-primary/30",
                "text-primary"
              )}
              animate={{
                scale: isActive ? 1.1 : 1,
                boxShadow: isActive 
                  ? "0 0 30px hsl(var(--primary) / 0.4)" 
                  : "0 0 0px transparent",
              }}
              transition={springTransition}
            >
              {card.icon}
            </motion.div>
          )}

          {/* Title - responsive text */}
          <motion.h3 
            className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3"
            animate={{
              y: isActive ? 0 : 10,
              opacity: isActive ? 1 : 0.8,
            }}
            transition={springTransition}
          >
            {card.title}
          </motion.h3>

          {/* Description - responsive text */}
          <motion.p 
            className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3"
            animate={{
              y: isActive ? 0 : 15,
              opacity: isActive ? 1 : 0,
            }}
            transition={springTransition}
          >
            {card.description}
          </motion.p>

          {/* CTA Arrow - responsive */}
          <motion.div
            className="mt-4 sm:mt-5 md:mt-6 flex items-center gap-2 text-primary"
            animate={{
              y: isActive ? 0 : 20,
              opacity: isActive ? 1 : 0,
            }}
            transition={{
              ...springTransition,
              delay: isActive ? 0.1 : 0,
            }}
          >
            <span className="text-xs sm:text-sm font-medium">
              {card.onClick ? "En savoir plus" : "View Details"}
            </span>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
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
          </motion.div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.08) 45%, transparent 55%)",
          }}
          animate={{
            x: isActive ? ["-100%", "200%"] : "-100%",
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: isActive ? Infinity : 0,
            repeatDelay: 2,
          }}
        />
      </div>
    </motion.div>
  );
}
