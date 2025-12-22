import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    // Phase timing
    const holdTimer = setTimeout(() => setPhase("hold"), 1200);
    const exitTimer = setTimeout(() => setPhase("exit"), 2400);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Simple L-shaped corner line
  const CornerLine = ({ 
    position, 
    delay = 0 
  }: { 
    position: "tl" | "tr" | "bl" | "br";
    delay?: number;
  }) => {
    const configs = {
      tl: {
        path: "M 0 50 L 30 50 Q 50 50 50 70 L 50 100",
        position: "top-8 left-8 md:top-16 md:left-16",
        exitY: "-100%",
      },
      tr: {
        path: "M 50 0 L 50 30 Q 50 50 70 50 L 100 50",
        position: "top-8 right-8 md:top-16 md:right-16",
        exitY: "-100%",
      },
      bl: {
        path: "M 50 100 L 50 70 Q 50 50 30 50 L 0 50",
        position: "bottom-8 left-8 md:bottom-16 md:left-16",
        exitY: "100%",
      },
      br: {
        path: "M 100 50 L 70 50 Q 50 50 50 70 L 50 100",
        position: "bottom-8 right-8 md:bottom-16 md:right-16",
        exitY: "100%",
      },
    };

    const config = configs[position];
    const isTop = position === "tl" || position === "tr";

    return (
      <motion.div
        className={`absolute ${config.position} w-28 h-28 md:w-40 md:h-40`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase === "exit" ? 0 : 1,
          y: phase === "exit" ? config.exitY : 0,
        }}
        transition={{ 
          duration: phase === "exit" ? 0.6 : 0.3,
          delay: phase === "enter" ? delay : (isTop ? 0 : 0.1),
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <motion.path
            d={config.path}
            stroke="hsl(220 10% 75%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase === "enter" || phase === "hold" ? 1 : 1 }}
            transition={{ 
              duration: 0.8, 
              delay: phase === "enter" ? delay + 0.1 : 0,
              ease: "easeInOut" 
            }}
          />
        </svg>
      </motion.div>
    );
  };

  // Inner corner lines
  const InnerCornerLine = ({ 
    position, 
    delay = 0 
  }: { 
    position: "tl" | "tr" | "bl" | "br";
    delay?: number;
  }) => {
    const configs = {
      tl: {
        path: "M 0 40 L 40 40 Q 60 40 60 60 L 60 100",
        position: "top-20 left-20 md:top-32 md:left-32",
        exitY: "-100%",
      },
      tr: {
        path: "M 60 0 L 60 40 Q 60 60 80 60 L 100 60",
        position: "top-20 right-20 md:top-32 md:right-32",
        exitY: "-100%",
      },
      bl: {
        path: "M 60 100 L 60 60 Q 60 40 40 40 L 0 40",
        position: "bottom-20 left-20 md:bottom-32 md:left-32",
        exitY: "100%",
      },
      br: {
        path: "M 100 40 L 60 40 Q 40 40 40 60 L 40 100",
        position: "bottom-20 right-20 md:bottom-32 md:right-32",
        exitY: "100%",
      },
    };

    const config = configs[position];
    const isTop = position === "tl" || position === "tr";

    return (
      <motion.div
        className={`absolute ${config.position} w-20 h-20 md:w-28 md:h-28`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase === "exit" ? 0 : 1,
          y: phase === "exit" ? config.exitY : 0,
        }}
        transition={{ 
          duration: phase === "exit" ? 0.5 : 0.3,
          delay: phase === "enter" ? delay : (isTop ? 0.05 : 0.15),
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <motion.path
            d={config.path}
            stroke="hsl(220 10% 80%)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase === "enter" || phase === "hold" ? 1 : 1 }}
            transition={{ 
              duration: 0.6, 
              delay: phase === "enter" ? delay + 0.2 : 0,
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
          className="fixed inset-0 z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top half - slides up on exit */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden"
            style={{ backgroundColor: "hsl(220 14% 92%)" }}
            initial={{ y: 0 }}
            animate={{ y: phase === "exit" ? "-100%" : 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Top corner lines */}
            <CornerLine position="tl" delay={0} />
            <CornerLine position="tr" delay={0.1} />
            <InnerCornerLine position="tl" delay={0.15} />
            <InnerCornerLine position="tr" delay={0.2} />
          </motion.div>

          {/* Bottom half - slides down on exit */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden"
            style={{ backgroundColor: "hsl(220 14% 92%)" }}
            initial={{ y: 0 }}
            animate={{ y: phase === "exit" ? "100%" : 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Bottom corner lines */}
            <CornerLine position="bl" delay={0.05} />
            <CornerLine position="br" delay={0.15} />
            <InnerCornerLine position="bl" delay={0.2} />
            <InnerCornerLine position="br" delay={0.25} />
          </motion.div>

          {/* Center content - stays centered, fades out */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: phase === "exit" ? 0 : 1, 
              scale: phase === "exit" ? 1.05 : 1,
            }}
            transition={{ 
              duration: phase === "exit" ? 0.4 : 0.6, 
              delay: phase === "enter" ? 0.3 : 0,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="flex items-center gap-3">
              {/* Icon box */}
              <motion.div
                className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "hsl(200 25% 20%)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: phase === "exit" ? 0 : 1, 
                  scale: phase === "exit" ? 0.9 : 1 
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: phase === "enter" ? 0.5 : 0 
                }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="white"
                >
                  <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z"/>
                </svg>
              </motion.div>

              {/* Text */}
              <motion.h1 
                className="text-xl md:text-3xl font-semibold tracking-tight"
                style={{ color: "hsl(200 25% 20%)" }}
                initial={{ opacity: 0, x: 15 }}
                animate={{ 
                  opacity: phase === "exit" ? 0 : 1, 
                  x: phase === "exit" ? 0 : 0 
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: phase === "enter" ? 0.6 : 0 
                }}
              >
                Dr. Yousif German
              </motion.h1>
            </div>
          </motion.div>

          {/* Center dividing line that appears on exit */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 z-20"
            style={{ backgroundColor: "hsl(220 10% 85%)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: phase === "exit" ? 1 : 0,
              opacity: phase === "exit" ? 1 : 0,
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
