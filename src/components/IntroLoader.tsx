import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
  ready?: boolean;
  progress?: number;
}

// Elegant animated lines component
const AnimatedLines = ({ phase }: { phase: "loading" | "enter" | "exit" }) => {
  const lines = [
    // Horizontal lines
    { x1: "0%", y1: "20%", x2: "35%", y2: "20%", delay: 0 },
    { x1: "65%", y1: "20%", x2: "100%", y2: "20%", delay: 0.1 },
    { x1: "0%", y1: "80%", x2: "35%", y2: "80%", delay: 0.05 },
    { x1: "65%", y1: "80%", x2: "100%", y2: "80%", delay: 0.15 },
    // Vertical lines
    { x1: "20%", y1: "0%", x2: "20%", y2: "35%", delay: 0.08 },
    { x1: "20%", y1: "65%", x2: "20%", y2: "100%", delay: 0.12 },
    { x1: "80%", y1: "0%", x2: "80%", y2: "35%", delay: 0.03 },
    { x1: "80%", y1: "65%", x2: "80%", y2: "100%", delay: 0.18 },
    // Corner accents
    { x1: "5%", y1: "5%", x2: "15%", y2: "5%", delay: 0.2 },
    { x1: "5%", y1: "5%", x2: "5%", y2: "15%", delay: 0.22 },
    { x1: "85%", y1: "5%", x2: "95%", y2: "5%", delay: 0.24 },
    { x1: "95%", y1: "5%", x2: "95%", y2: "15%", delay: 0.26 },
    { x1: "5%", y1: "95%", x2: "15%", y2: "95%", delay: 0.28 },
    { x1: "5%", y1: "85%", x2: "5%", y2: "95%", delay: 0.3 },
    { x1: "85%", y1: "95%", x2: "95%", y2: "95%", delay: 0.32 },
    { x1: "95%", y1: "85%", x2: "95%", y2: "95%", delay: 0.34 },
  ];

  const isAnimating = phase === "enter";
  const isExiting = phase === "exit";

  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      {lines.map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="hsl(175 60% 45% / 0.3)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isAnimating ? 1 : isExiting ? 0 : 0,
            opacity: isAnimating ? 1 : isExiting ? 0 : 0,
          }}
          transition={{
            pathLength: { duration: 0.4, delay: line.delay, ease: "easeOut" },
            opacity: { duration: 0.2, delay: line.delay },
          }}
        />
      ))}
    </svg>
  );
};

// Particle burst effect
const ParticleBurst = ({ active }: { active: boolean }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    delay: i * 0.02,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
          animate={active ? {
            scale: [0, 1, 0],
            x: Math.cos((p.angle * Math.PI) / 180) * 80,
            y: Math.sin((p.angle * Math.PI) / 180) * 80,
            opacity: [0, 1, 0],
          } : {}}
          transition={{
            duration: 0.6,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export function IntroLoader({ onComplete, ready = true }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"loading" | "enter" | "exit">("loading");
  const [showBurst, setShowBurst] = useState(false);
  const startedRef = useRef(false);

  // Start animation when ready
  useEffect(() => {
    if (!ready || startedRef.current) return;
    startedRef.current = true;

    // Quick animation sequence
    const enterTimer = setTimeout(() => setPhase("enter"), 100);
    const burstTimer = setTimeout(() => setShowBurst(true), 600);
    const exitTimer = setTimeout(() => setPhase("exit"), 1200);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(burstTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [ready, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated lines background */}
          <AnimatedLines phase={phase} />

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "enter" ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer ring */}
            <motion.div
              className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-primary/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: phase === "exit" ? 1.5 : 1,
                opacity: phase === "exit" ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Inner ring with progress */}
            <svg className="absolute w-28 h-28 md:w-36 md:h-36" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(175 60% 45% / 0.4)"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{
                  pathLength: phase === "enter" || phase === "exit" ? 1 : 0,
                  rotate: -90,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
              />
            </svg>

            {/* Logo container */}
            <motion.div
              className="relative flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: phase === "exit" ? 0 : 1,
                scale: phase === "exit" ? 0.9 : 1,
                y: phase === "exit" ? -20 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Tooth icon */}
              <motion.div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "backOut" }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8" fill="white">
                  <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z" />
                </svg>
              </motion.div>

              {/* Name */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
                  Dr. Yousif German
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Dental Clinic
                </p>
              </motion.div>
            </motion.div>

            {/* Particle burst */}
            <ParticleBurst active={showBurst} />
          </div>

          {/* Split panels for exit */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-background origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-background origin-bottom"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
          />

          {/* Final wipe */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
