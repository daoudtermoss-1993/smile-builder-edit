import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
  ready?: boolean;
  progress?: number; // 0-100
}

// Decorative lines component integrated with intro phases
const IntroDecorativeLines = ({ phase }: { phase: "loading" | "enter" | "hold" | "exit" }) => {
  const paths = [
    // Top Left Corner
    "M0 180 L0 80 Q0 0 80 0 L200 0",
    // Top Center
    "M620 0 L620 60 Q620 120 680 120 L760 120 Q820 120 820 180 L820 200",
    // Top Right Corner
    "M1240 0 L1360 0 Q1440 0 1440 80 L1440 180",
    // Right side curved
    "M1440 400 L1380 400 Q1320 400 1320 460 L1320 540 Q1320 600 1380 600 L1440 600",
    // Bottom Left Corner
    "M0 720 L0 820 Q0 900 80 900 L200 900",
    // Bottom Left connector
    "M280 900 L360 900 Q420 900 420 840 L420 760",
    // Bottom Right Corner
    "M1240 900 L1360 900 Q1440 900 1440 820 L1440 720",
    // Left side curved
    "M0 400 L60 400 Q120 400 120 460 L120 540 Q120 600 60 600 L0 600"
  ];

  const shouldAnimate = phase === "enter" || phase === "hold";
  const shouldExit = phase === "exit";

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-[5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldExit ? 0 : 1 }}
      transition={{ duration: shouldExit ? 0.8 : 0.3 }}
    >
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="hsl(175 60% 40% / 0.4)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: shouldAnimate ? 1 : 0, 
              opacity: shouldAnimate ? 1 : 0 
            }}
            transition={{
              pathLength: { 
                duration: 1.2, 
                delay: shouldAnimate ? 0.3 + i * 0.12 : 0, 
                ease: [0.4, 0, 0.2, 1] 
              },
              opacity: { 
                duration: 0.4, 
                delay: shouldAnimate ? 0.3 + i * 0.12 : 0 
              }
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

export function IntroLoader({ onComplete, ready = true, progress = 0 }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"loading" | "enter" | "hold" | "exit">("loading");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const startedRef = useRef(false);
  const targetProgressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const isWaiting = phase === "loading";

  // Update target progress without restarting the animation loop
  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  // Ping-pong animation loop (line goes forward then back to start)
  useEffect(() => {
    if (!isVisible) return;
    if (!isWaiting) return;

    startTimeRef.current = null;

    const tick = (t: number) => {
      if (startTimeRef.current === null) startTimeRef.current = t;

      const elapsed = t - startTimeRef.current;
      
      // Ping-pong cycle: 2 seconds forward, 2 seconds back
      const cycleDuration = 4000; // 4 seconds total cycle
      const halfCycle = cycleDuration / 2;
      const cycleTime = elapsed % cycleDuration;
      
      // Calculate position in cycle (0 to 1 to 0)
      let pingPongProgress: number;
      if (cycleTime < halfCycle) {
        // Going forward (0 to max)
        pingPongProgress = (cycleTime / halfCycle) * 30; // Max 30% of the path
      } else {
        // Going back (max to 0)
        pingPongProgress = (1 - (cycleTime - halfCycle) / halfCycle) * 30;
      }
      
      // Ease the movement with sine for smoother feel
      const easedProgress = pingPongProgress * Math.sin((cycleTime / cycleDuration) * Math.PI);
      
      setSmoothProgress(Math.max(0, easedProgress));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isVisible, isWaiting]);

  // Wait for page to be fully loaded
  useEffect(() => {
    const checkLoaded = () => {
      if (document.readyState === "complete") {
        // Add small delay to ensure Vite's loading bar is gone
        setTimeout(() => setIsPageLoaded(true), 300);
      }
    };

    if (document.readyState === "complete") {
      setTimeout(() => setIsPageLoaded(true), 300);
    } else {
      window.addEventListener("load", checkLoaded);
      return () => window.removeEventListener("load", checkLoaded);
    }
  }, []);

  // Start animation sequence only after page is loaded + hero is ready
  useEffect(() => {
    if (!isPageLoaded) return;
    if (!ready) return;
    if (startedRef.current) return;

    startedRef.current = true;

    // Start the animation sequence
    setPhase("enter");

    // Slower timing for opening animation
    const holdTimer = setTimeout(() => setPhase("hold"), 1800);
    const exitTimer = setTimeout(() => setPhase("exit"), 3200);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [isPageLoaded, ready, onComplete]);

  const openOffset = 200;

  // Convert smoothed progress (0-100) to pathLength (0-1)
  const progressPath = smoothProgress / 100;

  // Single continuous border line that traces around the entire frame
  const ContinuousBorderLine = () => {
    // Path starts from top-right, goes clockwise around the border back to start
    // Using rounded corners at each corner
    const margin = 40; // Distance from edge
    const cornerRadius = 50;

    const borderPath = `
      M 900 ${margin}
      L ${1000 - margin - cornerRadius} ${margin}
      Q ${1000 - margin} ${margin} ${1000 - margin} ${margin + cornerRadius}
      L ${1000 - margin} ${600 - margin - cornerRadius}
      Q ${1000 - margin} ${600 - margin} ${1000 - margin - cornerRadius} ${600 - margin}
      L ${margin + cornerRadius} ${600 - margin}
      Q ${margin} ${600 - margin} ${margin} ${600 - margin - cornerRadius}
      L ${margin} ${margin + cornerRadius}
      Q ${margin} ${margin} ${margin + cornerRadius} ${margin}
      L 900 ${margin}
    `;

    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Background path (faded) */}
          <path
            d={borderPath}
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.4}
            vectorEffect="non-scaling-stroke"
          />

          {/* Progress path */}
          {isWaiting ? (
            <motion.path
              d={borderPath}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: progressPath }}
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <motion.path
              d={borderPath}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: progressPath }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    );
  };

  // Size for the rounded cutouts (in viewBox units)
  const sideRadius = 8; // Semicircle radius on sides (smaller for better proportion)
  const centerRadius = 4; // Rounded corners in center

  // Top Panel - using SVG for precise curved shapes
  const TopPanel = () => {
    const createTopPath = (width: number, height: number) => {
      const sr = sideRadius;
      const cr = centerRadius;
      const centerX = width / 2;
      
      // Path with semicircle cutouts on sides and rounded corners at center
      return `
        M 0 0
        L ${width} 0
        L ${width} ${height - sr}
        A ${sr} ${sr} 0 0 1 ${width - sr} ${height}
        L ${centerX + cr * 3} ${height}
        Q ${centerX + cr} ${height} ${centerX + cr} ${height - cr * 2}
        L ${centerX + cr} ${height - cr * 2}
        Q ${centerX} ${height - cr * 3} ${centerX - cr} ${height - cr * 2}
        L ${centerX - cr} ${height - cr * 2}
        Q ${centerX - cr} ${height} ${centerX - cr * 3} ${height}
        L ${sr} ${height}
        A ${sr} ${sr} 0 0 1 0 ${height - sr}
        L 0 0
        Z
      `;
    };

    return (
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 overflow-visible pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: phase === "exit" ? -openOffset : 0 }}
        transition={{
          duration: phase === "exit" ? 2.4 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path
            d={createTopPath(100, 50)}
            fill="hsl(220 14% 92%)"
          />
        </svg>
      </motion.div>
    );
  };

  // Bottom Panel - mirror of top
  const BottomPanel = () => {
    const sr = sideRadius;
    const cr = centerRadius;
    
    const createBottomPath = (width: number, height: number) => {
      const centerX = width / 2;
      
      return `
        M 0 ${height}
        L ${width} ${height}
        L ${width} ${sr}
        A ${sr} ${sr} 0 0 0 ${width - sr} 0
        L ${centerX + cr * 3} 0
        Q ${centerX + cr} 0 ${centerX + cr} ${cr * 2}
        L ${centerX + cr} ${cr * 2}
        Q ${centerX} ${cr * 3} ${centerX - cr} ${cr * 2}
        L ${centerX - cr} ${cr * 2}
        Q ${centerX - cr} 0 ${centerX - cr * 3} 0
        L ${sr} 0
        A ${sr} ${sr} 0 0 0 0 ${sr}
        L 0 ${height}
        Z
      `;
    };

    return (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 overflow-visible pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: phase === "exit" ? openOffset : 0 }}
        transition={{
          duration: phase === "exit" ? 2.4 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <path
            d={createBottomPath(100, 50)}
            fill="hsl(220 14% 92%)"
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
          transition={{ duration: 0.2 }}
        >
          {/* Top and Bottom panels with curved edges */}
          <TopPanel />
          <BottomPanel />

          {/* Continuous border line animation - stays visible during exit */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            transition={{ duration: 1.2, delay: phase === "exit" ? 0.8 : 0 }}
          >
            <ContinuousBorderLine />
          </motion.div>

          {/* Decorative lines synchronized with intro */}
          <IntroDecorativeLines phase={phase} />

          {/* Center content with logo and name */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: phase === "exit" ? 0 : 1, 
              scale: phase === "exit" ? 1.05 : 1,
              y: phase === "exit" ? -30 : 0,
            }}
            transition={{ 
              duration: phase === "exit" ? 0.8 : 0.6, 
              delay: phase === "enter" ? 0.3 : 0,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="flex items-center gap-4">
              {/* Logo/Icon */}
              <motion.div
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "hsl(175 85% 35%)" }}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-9 md:h-9" fill="white">
                  <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z"/>
                </svg>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h1 
                  className="text-2xl md:text-4xl font-bold tracking-tight"
                  style={{ color: "hsl(200 25% 25%)" }}
                >
                  Dr. Yousif German
                </h1>
                <p 
                  className="text-sm md:text-base mt-1 tracking-wide"
                  style={{ color: "hsl(200 15% 45%)" }}
                >
                  Dental Clinic
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
