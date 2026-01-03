import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
  ready?: boolean;
  progress?: number;
}

// Enhanced animated lines component with more patterns
const AnimatedLines = ({ phase }: { phase: "loading" | "enter" | "exit" }) => {
  const lines = [
    // Outer frame - horizontal
    { x1: "0%", y1: "10%", x2: "25%", y2: "10%", delay: 0, stroke: 0.8 },
    { x1: "75%", y1: "10%", x2: "100%", y2: "10%", delay: 0.05, stroke: 0.8 },
    { x1: "0%", y1: "90%", x2: "25%", y2: "90%", delay: 0.1, stroke: 0.8 },
    { x1: "75%", y1: "90%", x2: "100%", y2: "90%", delay: 0.15, stroke: 0.8 },
    // Outer frame - vertical
    { x1: "10%", y1: "0%", x2: "10%", y2: "25%", delay: 0.02, stroke: 0.8 },
    { x1: "10%", y1: "75%", x2: "10%", y2: "100%", delay: 0.07, stroke: 0.8 },
    { x1: "90%", y1: "0%", x2: "90%", y2: "25%", delay: 0.12, stroke: 0.8 },
    { x1: "90%", y1: "75%", x2: "90%", y2: "100%", delay: 0.17, stroke: 0.8 },
    // Middle frame - horizontal
    { x1: "15%", y1: "25%", x2: "40%", y2: "25%", delay: 0.08, stroke: 0.5 },
    { x1: "60%", y1: "25%", x2: "85%", y2: "25%", delay: 0.13, stroke: 0.5 },
    { x1: "15%", y1: "75%", x2: "40%", y2: "75%", delay: 0.18, stroke: 0.5 },
    { x1: "60%", y1: "75%", x2: "85%", y2: "75%", delay: 0.23, stroke: 0.5 },
    // Middle frame - vertical
    { x1: "25%", y1: "15%", x2: "25%", y2: "40%", delay: 0.06, stroke: 0.5 },
    { x1: "25%", y1: "60%", x2: "25%", y2: "85%", delay: 0.11, stroke: 0.5 },
    { x1: "75%", y1: "15%", x2: "75%", y2: "40%", delay: 0.16, stroke: 0.5 },
    { x1: "75%", y1: "60%", x2: "75%", y2: "85%", delay: 0.21, stroke: 0.5 },
    // Inner frame - horizontal
    { x1: "35%", y1: "40%", x2: "45%", y2: "40%", delay: 0.14, stroke: 0.6 },
    { x1: "55%", y1: "40%", x2: "65%", y2: "40%", delay: 0.19, stroke: 0.6 },
    { x1: "35%", y1: "60%", x2: "45%", y2: "60%", delay: 0.24, stroke: 0.6 },
    { x1: "55%", y1: "60%", x2: "65%", y2: "60%", delay: 0.29, stroke: 0.6 },
    // Inner frame - vertical
    { x1: "40%", y1: "35%", x2: "40%", y2: "45%", delay: 0.12, stroke: 0.6 },
    { x1: "40%", y1: "55%", x2: "40%", y2: "65%", delay: 0.17, stroke: 0.6 },
    { x1: "60%", y1: "35%", x2: "60%", y2: "45%", delay: 0.22, stroke: 0.6 },
    { x1: "60%", y1: "55%", x2: "60%", y2: "65%", delay: 0.27, stroke: 0.6 },
    // Corner accents - top left
    { x1: "2%", y1: "2%", x2: "8%", y2: "2%", delay: 0.2, stroke: 1 },
    { x1: "2%", y1: "2%", x2: "2%", y2: "8%", delay: 0.22, stroke: 1 },
    // Corner accents - top right
    { x1: "92%", y1: "2%", x2: "98%", y2: "2%", delay: 0.24, stroke: 1 },
    { x1: "98%", y1: "2%", x2: "98%", y2: "8%", delay: 0.26, stroke: 1 },
    // Corner accents - bottom left
    { x1: "2%", y1: "98%", x2: "8%", y2: "98%", delay: 0.28, stroke: 1 },
    { x1: "2%", y1: "92%", x2: "2%", y2: "98%", delay: 0.3, stroke: 1 },
    // Corner accents - bottom right
    { x1: "92%", y1: "98%", x2: "98%", y2: "98%", delay: 0.32, stroke: 1 },
    { x1: "98%", y1: "92%", x2: "98%", y2: "98%", delay: 0.34, stroke: 1 },
    // Diagonal accents
    { x1: "5%", y1: "15%", x2: "15%", y2: "5%", delay: 0.36, stroke: 0.4 },
    { x1: "85%", y1: "5%", x2: "95%", y2: "15%", delay: 0.38, stroke: 0.4 },
    { x1: "5%", y1: "85%", x2: "15%", y2: "95%", delay: 0.4, stroke: 0.4 },
    { x1: "85%", y1: "95%", x2: "95%", y2: "85%", delay: 0.42, stroke: 0.4 },
    // Center cross lines
    { x1: "48%", y1: "30%", x2: "48%", y2: "38%", delay: 0.25, stroke: 0.3 },
    { x1: "52%", y1: "30%", x2: "52%", y2: "38%", delay: 0.27, stroke: 0.3 },
    { x1: "48%", y1: "62%", x2: "48%", y2: "70%", delay: 0.29, stroke: 0.3 },
    { x1: "52%", y1: "62%", x2: "52%", y2: "70%", delay: 0.31, stroke: 0.3 },
  ];

  const isAnimating = phase === "enter";
  const isExiting = phase === "exit";

  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <defs>
        <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={`hsl(175 60% 45% / ${line.stroke})`}
          strokeWidth="1.5"
          filter="url(#lineGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isAnimating ? 1 : isExiting ? 0 : 0,
            opacity: isAnimating ? 1 : isExiting ? 0 : 0,
          }}
          transition={{
            pathLength: { duration: 0.5, delay: line.delay, ease: "easeOut" },
            opacity: { duration: 0.25, delay: line.delay },
          }}
        />
      ))}
    </svg>
  );
};

// Orbiting dots around the logo
const OrbitingDots = ({ active }: { active: boolean }) => {
  const dots = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * 360,
    radius: 70,
    size: i % 2 === 0 ? 3 : 2,
    delay: i * 0.05,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            width: dot.size,
            height: dot.size,
            boxShadow: "0 0 8px hsl(175 60% 45% / 0.8)",
          }}
          initial={{
            x: Math.cos((dot.angle * Math.PI) / 180) * dot.radius,
            y: Math.sin((dot.angle * Math.PI) / 180) * dot.radius,
            scale: 0,
            opacity: 0,
          }}
          animate={
            active
              ? {
                  x: Math.cos((dot.angle * Math.PI) / 180) * dot.radius,
                  y: Math.sin((dot.angle * Math.PI) / 180) * dot.radius,
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 0.8],
                }
              : {}
          }
          transition={{
            duration: 0.4,
            delay: dot.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Particle burst effect
const ParticleBurst = ({ active }: { active: boolean }) => {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * 360,
    delay: i * 0.015,
    distance: 60 + (i % 3) * 20,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, hsl(175 60% 50%), hsl(175 80% 70%))",
            boxShadow: "0 0 6px hsl(175 60% 50% / 0.6)",
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
          animate={
            active
              ? {
                  scale: [0, 1, 0],
                  x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                  y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                  opacity: [0, 1, 0],
                }
              : {}
          }
          transition={{
            duration: 0.7,
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
  const [showOrbit, setShowOrbit] = useState(false);
  const startedRef = useRef(false);

  // Start animation when ready
  useEffect(() => {
    if (!ready || startedRef.current) return;
    startedRef.current = true;

    // Quick animation sequence
    const enterTimer = setTimeout(() => setPhase("enter"), 100);
    const orbitTimer = setTimeout(() => setShowOrbit(true), 300);
    const burstTimer = setTimeout(() => setShowBurst(true), 700);
    const exitTimer = setTimeout(() => setPhase("exit"), 1400);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(orbitTimer);
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
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, hsl(175 60% 45% / 0.08) 0%, transparent 60%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: phase === "enter" ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer glow ring */}
            <motion.div
              className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(175 60% 45% / 0.15) 0%, transparent 70%)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: phase === "exit" ? 2 : 1,
                opacity: phase === "exit" ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Animated ring */}
            <motion.div
              className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border border-primary/30"
              style={{
                boxShadow: "0 0 20px hsl(175 60% 45% / 0.2), inset 0 0 20px hsl(175 60% 45% / 0.1)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: phase === "exit" ? 1.5 : 1,
                opacity: phase === "exit" ? 0 : 1,
                rotate: phase === "enter" ? 360 : 0,
              }}
              transition={{
                scale: { duration: 0.5, ease: "easeOut" },
                opacity: { duration: 0.4 },
                rotate: { duration: 2, ease: "linear", repeat: Infinity },
              }}
            />

            {/* Inner progress ring */}
            <svg className="absolute w-28 h-28 md:w-36 md:h-36" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(175 60% 55%)" />
                  <stop offset="100%" stopColor="hsl(175 80% 40%)" />
                </linearGradient>
                <filter id="ringGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#ringGlow)"
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{
                  pathLength: phase === "enter" || phase === "exit" ? 1 : 0,
                  rotate: -90,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
              />
            </svg>

            {/* Orbiting dots */}
            <OrbitingDots active={showOrbit} />

            {/* Logo container with glow */}
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
              {/* Tooth icon with enhanced glow */}
              <motion.div
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary flex items-center justify-center"
                style={{
                  boxShadow: `
                    0 0 30px hsl(175 60% 45% / 0.5),
                    0 0 60px hsl(175 60% 45% / 0.3),
                    0 0 90px hsl(175 60% 45% / 0.15),
                    inset 0 1px 0 hsl(175 80% 70% / 0.3)
                  `,
                }}
                initial={{ scale: 0, rotate: -20 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  boxShadow: phase === "enter" ? [
                    "0 0 30px hsl(175 60% 45% / 0.5), 0 0 60px hsl(175 60% 45% / 0.3), 0 0 90px hsl(175 60% 45% / 0.15), inset 0 1px 0 hsl(175 80% 70% / 0.3)",
                    "0 0 40px hsl(175 60% 45% / 0.7), 0 0 80px hsl(175 60% 45% / 0.4), 0 0 120px hsl(175 60% 45% / 0.2), inset 0 1px 0 hsl(175 80% 70% / 0.4)",
                    "0 0 30px hsl(175 60% 45% / 0.5), 0 0 60px hsl(175 60% 45% / 0.3), 0 0 90px hsl(175 60% 45% / 0.15), inset 0 1px 0 hsl(175 80% 70% / 0.3)",
                  ] : undefined,
                }}
                transition={{
                  scale: { duration: 0.4, delay: 0.15, ease: "backOut" },
                  rotate: { duration: 0.4, delay: 0.15 },
                  boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {/* Inner glow overlay */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, hsl(175 80% 70% / 0.4), transparent 60%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <svg viewBox="0 0 24 24" className="relative w-8 h-8 md:w-9 md:h-9" fill="white">
                  <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z" />
                </svg>
              </motion.div>

              {/* Name with subtle glow */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <h1
                  className="text-lg md:text-xl font-semibold text-foreground tracking-tight"
                  style={{
                    textShadow: "0 0 20px hsl(175 60% 45% / 0.3)",
                  }}
                >
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
