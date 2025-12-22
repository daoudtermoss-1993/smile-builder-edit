import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // Phase 1: Enter animation (shapes draw in)
    const holdTimer = setTimeout(() => setPhase("hold"), 1200);
    
    // Phase 2: Start exit
    const exitTimer = setTimeout(() => setPhase("exit"), 2400);
    
    // Phase 3: Complete and hide
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 3200);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Corner shape - style Terminal Industries
  const CornerShape = ({ 
    position, 
    delay = 0 
  }: { 
    position: "tl" | "tr" | "bl" | "br";
    delay?: number;
  }) => {
    const transforms = {
      tl: { rotate: 0, origin: "top left" },
      tr: { rotate: 90, origin: "top right" },
      bl: { rotate: -90, origin: "bottom left" },
      br: { rotate: 180, origin: "bottom right" },
    };

    const positions = {
      tl: "top-0 left-0",
      tr: "top-0 right-0",
      bl: "bottom-0 left-0",
      br: "bottom-0 right-0",
    };

    // Exit animation direction
    const exitTransforms = {
      tl: { x: "-100%", y: "-100%" },
      tr: { x: "100%", y: "-100%" },
      bl: { x: "-100%", y: "100%" },
      br: { x: "100%", y: "100%" },
    };

    return (
      <motion.div
        className={`absolute ${positions[position]} w-[40vw] h-[40vh] pointer-events-none`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase === "exit" ? 0 : 1,
          x: phase === "exit" ? exitTransforms[position].x : 0,
          y: phase === "exit" ? exitTransforms[position].y : 0,
        }}
        transition={{ 
          duration: phase === "exit" ? 0.8 : 0.5, 
          delay: phase === "enter" ? delay : 0,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ 
            transform: `rotate(${transforms[position].rotate}deg)`,
            transformOrigin: transforms[position].origin
          }}
        >
          {/* Main rounded corner path */}
          <motion.path
            d="M 0 100 Q 0 0 100 0 L 200 0"
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase !== "exit" ? 1 : 0 }}
            transition={{ 
              duration: 1, 
              delay: phase === "enter" ? delay + 0.2 : 0,
              ease: "easeInOut" 
            }}
          />
          
          {/* Inner rounded rectangle - offset */}
          <motion.path
            d="M 45 200 L 45 140 Q 45 45 140 45 L 200 45"
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.12)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase !== "exit" ? 1 : 0 }}
            transition={{ 
              duration: 0.8, 
              delay: phase === "enter" ? delay + 0.5 : 0,
              ease: "easeInOut" 
            }}
          />

          {/* Decorative inner corner */}
          <motion.path
            d="M 90 200 L 90 155 Q 90 90 155 90 L 200 90"
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.08)"
            strokeWidth="0.75"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase !== "exit" ? 1 : 0 }}
            transition={{ 
              duration: 0.6, 
              delay: phase === "enter" ? delay + 0.7 : 0,
              ease: "easeInOut" 
            }}
          />
        </svg>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "hsl(220 15% 94%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Corner shapes with staggered delays */}
          <CornerShape position="tl" delay={0} />
          <CornerShape position="tr" delay={0.15} />
          <CornerShape position="bl" delay={0.1} />
          <CornerShape position="br" delay={0.2} />

          {/* Center text - Dr. Yousif German */}
          <motion.div
            className="relative z-10 flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: phase === "exit" ? 0 : 1, 
              scale: phase === "exit" ? 0.95 : 1,
              y: phase === "exit" ? -30 : 0,
            }}
            transition={{ 
              duration: phase === "exit" ? 0.6 : 0.8, 
              delay: phase === "enter" ? 0.4 : 0,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* Icon/symbol representing dental */}
            <motion.div
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "hsl(175 85% 35%)" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: phase === "exit" ? 0 : 1, 
                scale: phase === "exit" ? 0.8 : 1 
              }}
              transition={{ 
                duration: 0.5, 
                delay: phase === "enter" ? 0.6 : 0 
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 md:w-7 md:h-7"
                fill="white"
              >
                <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z"/>
              </svg>
            </motion.div>

            {/* Text */}
            <motion.h1 
              className="text-2xl md:text-4xl font-semibold tracking-tight"
              style={{ color: "hsl(220 25% 18%)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: phase === "exit" ? 0 : 1, 
                x: phase === "exit" ? -20 : 0 
              }}
              transition={{ 
                duration: 0.6, 
                delay: phase === "enter" ? 0.7 : 0 
              }}
            >
              Dr. Yousif German
            </motion.h1>
          </motion.div>

          {/* Horizontal decorative lines */}
          <motion.div
            className="absolute left-0 top-1/2 h-px origin-left"
            style={{ 
              backgroundColor: "hsl(var(--muted-foreground) / 0.1)",
              width: "15vw"
            }}
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: phase === "exit" ? 0 : 1,
            }}
            transition={{ 
              duration: 0.8, 
              delay: phase === "enter" ? 0.9 : 0,
              ease: "easeInOut" 
            }}
          />
          <motion.div
            className="absolute right-0 top-1/2 h-px origin-right"
            style={{ 
              backgroundColor: "hsl(var(--muted-foreground) / 0.1)",
              width: "15vw"
            }}
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: phase === "exit" ? 0 : 1,
            }}
            transition={{ 
              duration: 0.8, 
              delay: phase === "enter" ? 0.9 : 0,
              ease: "easeInOut" 
            }}
          />

          {/* Subtle "scroll to explore" hint */}
          <motion.p
            className="absolute bottom-8 text-xs tracking-[0.3em] uppercase"
            style={{ color: "hsl(var(--muted-foreground) / 0.5)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: phase === "hold" ? 1 : 0, 
              y: phase === "hold" ? 0 : 10 
            }}
            transition={{ duration: 0.4 }}
          >
            Welcome
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
