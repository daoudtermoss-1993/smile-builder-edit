import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
  ready?: boolean;
}

// Tooth icon component - small and elegant
const ToothIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z" />
  </svg>
);

export function IntroLoader({ onComplete, ready = true }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "exit">("loading");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!ready || startedRef.current) return;
    startedRef.current = true;

    // Fast progress animation - 800ms total
    const duration = 800;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth acceleration
      const eased = 1 - Math.pow(1 - newProgress, 3);
      setProgress(eased);
      
      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPhase("complete");
        setTimeout(() => setPhase("exit"), 200);
        setTimeout(() => onComplete(), 500);
      }
    };
    
    requestAnimationFrame(animate);
  }, [ready, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" || progress < 1 ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Subtle background gradient */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Center container */}
          <div className="relative flex flex-col items-center gap-6 md:gap-8 px-8 w-full max-w-xs md:max-w-sm">
            {/* Logo text */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                Dr. Yousif German
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Dental Clinic
              </p>
            </motion.div>

            {/* Loading bar container */}
            <div className="relative w-full">
              {/* Background track */}
              <motion.div
                className="h-0.5 md:h-1 w-full rounded-full bg-muted/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Progress bar with glow */}
              <motion.div
                className="absolute top-0 left-0 h-0.5 md:h-1 rounded-full bg-primary origin-left"
                style={{
                  width: "100%",
                  scaleX: progress,
                  boxShadow: "0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.3)",
                }}
              />

              {/* Moving tooth on the loading bar */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${progress * 100}%`,
                  x: "-50%",
                }}
              >
                {/* Glow behind tooth */}
                <motion.div
                  className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Tooth container */}
                <motion.div
                  className="relative w-5 h-5 md:w-6 md:h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                  style={{
                    boxShadow: "0 0 16px hsl(var(--primary) / 0.5), 0 2px 8px hsl(0 0% 0% / 0.2)",
                  }}
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ToothIcon size={12} />
                </motion.div>
              </motion.div>
            </div>

            {/* Percentage */}
            <motion.span
              className="text-xs md:text-sm font-medium text-muted-foreground tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {Math.round(progress * 100)}%
            </motion.span>
          </div>

          {/* Exit curtain effect */}
          {phase === "exit" && (
            <>
              <motion.div
                className="absolute inset-0 bg-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            </>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
