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
    const holdTimer = setTimeout(() => setPhase("hold"), 1000);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Simple L-shaped corner line with rounded corner - exactly like Terminal Industries
  const CornerLine = ({ 
    position, 
    delay = 0 
  }: { 
    position: "tl" | "tr" | "bl" | "br";
    delay?: number;
  }) => {
    // Each corner has a simple L-shape line
    const configs = {
      tl: {
        // Top-left: line comes from left, curves down
        path: "M 0 50 L 30 50 Q 50 50 50 70 L 50 100",
        position: "top-8 left-8 md:top-12 md:left-12",
        size: "w-32 h-32 md:w-48 md:h-48",
      },
      tr: {
        // Top-right: line comes from top, curves right
        path: "M 50 0 L 50 30 Q 50 50 70 50 L 100 50",
        position: "top-8 right-8 md:top-12 md:right-12",
        size: "w-32 h-32 md:w-48 md:h-48",
      },
      bl: {
        // Bottom-left: line comes from bottom, curves left
        path: "M 50 100 L 50 70 Q 50 50 30 50 L 0 50",
        position: "bottom-8 left-8 md:bottom-12 md:left-12",
        size: "w-32 h-32 md:w-48 md:h-48",
      },
      br: {
        // Bottom-right: line comes from right, curves down
        path: "M 100 50 L 70 50 Q 50 50 50 70 L 50 100",
        position: "bottom-8 right-8 md:bottom-12 md:right-12",
        size: "w-32 h-32 md:w-48 md:h-48",
      },
    };

    const config = configs[position];

    return (
      <motion.div
        className={`absolute ${config.position} ${config.size}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ 
          duration: phase === "exit" ? 0.4 : 0.3,
          delay: phase === "enter" ? delay : 0,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <motion.path
            d={config.path}
            stroke="hsl(220 10% 75%)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase !== "exit" ? 1 : 0 }}
            transition={{ 
              duration: phase === "exit" ? 0.3 : 0.8, 
              delay: phase === "enter" ? delay + 0.1 : 0,
              ease: "easeInOut" 
            }}
          />
        </svg>
      </motion.div>
    );
  };

  // Second layer of corner lines (the inner ones visible in the image)
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
        position: "top-20 left-20 md:top-28 md:left-28",
        size: "w-24 h-24 md:w-36 md:h-36",
      },
      tr: {
        path: "M 60 0 L 60 40 Q 60 60 80 60 L 100 60",
        position: "top-20 right-20 md:top-28 md:right-28",
        size: "w-24 h-24 md:w-36 md:h-36",
      },
      bl: {
        path: "M 60 100 L 60 60 Q 60 40 40 40 L 0 40",
        position: "bottom-20 left-20 md:bottom-28 md:left-28",
        size: "w-24 h-24 md:w-36 md:h-36",
      },
      br: {
        path: "M 100 40 L 60 40 Q 40 40 40 60 L 40 100",
        position: "bottom-20 right-20 md:bottom-28 md:right-28",
        size: "w-24 h-24 md:w-36 md:h-36",
      },
    };

    const config = configs[position];

    return (
      <motion.div
        className={`absolute ${config.position} ${config.size}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ 
          duration: phase === "exit" ? 0.3 : 0.3,
          delay: phase === "enter" ? delay : 0,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <motion.path
            d={config.path}
            stroke="hsl(220 10% 78%)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase !== "exit" ? 1 : 0 }}
            transition={{ 
              duration: phase === "exit" ? 0.25 : 0.6, 
              delay: phase === "enter" ? delay + 0.3 : 0,
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
          style={{ backgroundColor: "hsl(220 14% 92%)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Outer corner lines */}
          <CornerLine position="tl" delay={0} />
          <CornerLine position="tr" delay={0.1} />
          <CornerLine position="bl" delay={0.15} />
          <CornerLine position="br" delay={0.2} />

          {/* Inner corner lines */}
          <InnerCornerLine position="tl" delay={0.2} />
          <InnerCornerLine position="tr" delay={0.25} />
          <InnerCornerLine position="bl" delay={0.3} />
          <InnerCornerLine position="br" delay={0.35} />

          {/* Center content - just text, no logo */}
          <motion.div
            className="relative z-10 flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: phase === "exit" ? 0 : 1, 
              scale: phase === "exit" ? 0.98 : 1,
            }}
            transition={{ 
              duration: phase === "exit" ? 0.4 : 0.6, 
              delay: phase === "enter" ? 0.3 : 0,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
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
                x: phase === "exit" ? -10 : 0 
              }}
              transition={{ 
                duration: 0.5, 
                delay: phase === "enter" ? 0.6 : 0 
              }}
            >
              Dr. Yousif German
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
