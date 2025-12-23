import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
  ready?: boolean;
  progress?: number; // 0-100
}

export function IntroLoader({ onComplete, ready = true, progress = 0 }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"loading" | "enter" | "hold" | "exit">("loading");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const startedRef = useRef(false);
  const targetProgressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Update target progress without restarting the animation loop
  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  // Smooth progress animation loop (runs once)
  useEffect(() => {
    if (!isVisible) return;

    const tick = (t: number) => {
      if (startTimeRef.current === null) startTimeRef.current = t;

      const elapsed = t - startTimeRef.current;
      const real = targetProgressRef.current;

      // Kickoff: avoid early "stop-go" before real progress starts
      const kickoffCap = real <= 1 ? 18 : 0; // up to 18% while real progress is ~0
      const kickoff = kickoffCap ? Math.min(kickoffCap, (elapsed / 900) * kickoffCap) : 0;

      const target = Math.min(100, Math.max(real, kickoff));

      setSmoothProgress((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.05) return target;

        // Exponential smoothing + minimum step so it never "freezes"
        const easedStep = diff * 0.12;
        const minStep = diff > 0 ? 0.18 : -0.18;
        const step = diff > 0 ? Math.max(minStep, easedStep) : Math.min(minStep, easedStep);

        const next = prev + step;
        return diff > 0 ? Math.min(target, next) : Math.max(target, next);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isVisible]);

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

    const holdTimer = setTimeout(() => setPhase("hold"), 1200);
    const exitTimer = setTimeout(() => setPhase("exit"), 2400);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3300);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [isPageLoaded, ready, onComplete]);

  const openOffset = 180;
  const circleSize = 80;
  const isWaiting = phase === "loading";
  
  // Convert smoothed progress (0-100) to pathLength (0-1)
  const progressPath = smoothProgress / 100;

  // Single continuous border line that traces around the entire frame
  const ContinuousBorderLine = () => {
    // Path starts from top-right, goes clockwise around the border back to start
    // Using rounded corners at each corner
    const margin = 40; // Distance from edge
    const cornerRadius = 50;
    
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
            d={`
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
            `}
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.4}
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated progress path */}
          <motion.path
            d={`
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
            `}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isWaiting ? progressPath : 1 }}
            transition={
              isWaiting
                ? { duration: 0.08, ease: "linear" }
                : { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            }
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  };

  // Quadrant panel component
  const QuadrantPanel = ({ 
    position 
  }: { 
    position: "tl" | "tr" | "bl" | "br" 
  }) => {
    const isTop = position === "tl" || position === "tr";
    const isLeft = position === "tl" || position === "bl";

    const positionStyles = {
      tl: "top-0 left-0",
      tr: "top-0 right-0",
      bl: "bottom-0 left-0",
      br: "bottom-0 right-0",
    };

    const exitY = isTop ? -openOffset : openOffset;

    const delays = {
      tl: 0,
      tr: 0.02,
      bl: 0,
      br: 0.02,
    };

    // Inner corner radius position (corner nearest to center)
    const innerCornerStyles = {
      tl: "bottom-0 right-0",
      tr: "bottom-0 left-0",
      bl: "top-0 right-0",
      br: "top-0 left-0",
    };

    return (
      <motion.div
        className={`absolute ${positionStyles[position]} w-1/2 h-1/2 overflow-visible`}
        style={{ backgroundColor: "hsl(220 14% 92%)" }}
        initial={{ y: 0 }}
        animate={{
          y: phase === "exit" ? exitY : 0,
        }}
        transition={{
          duration: 0.8,
          delay: phase === "exit" ? delays[position] : 0,
          ease: [0.76, 0, 0.24, 1],
        }}
      >

        {/* Inner corner rounded cutout - creates the rounded corner effect near center */}
        <motion.div
          className={`absolute ${innerCornerStyles[position]}`}
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "hsl(220 14% 92%)",
            borderRadius: "9999px",
            border: "1px solid hsl(220 10% 82%)",
            transform: `translate(${isLeft ? "50%" : "-50%"}, ${isTop ? "50%" : "-50%"})`,
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </motion.div>
    );
  };

  // Side semicircle component (left and right edges)
  const SideCircle = ({ side }: { side: "left" | "right" }) => {
    const isLeft = side === "left";

    return (
      <>
        {/* Top half circle */}
        <motion.div
          className={`absolute ${isLeft ? "left-0" : "right-0"} top-0 h-1/2`}
          style={{
            width: `${circleSize}px`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          initial={{ y: 0 }}
          animate={{
            y: phase === "exit" ? -openOffset : 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              backgroundColor: "hsl(220 14% 92%)",
              borderRadius: "9999px",
              border: "1px solid hsl(220 10% 82%)",
              transform: `translateX(${isLeft ? "-50%" : "50%"}) translateY(50%)`,
            }}
          />
        </motion.div>

        {/* Bottom half circle */}
        <motion.div
          className={`absolute ${isLeft ? "left-0" : "right-0"} bottom-0 h-1/2`}
          style={{
            width: `${circleSize}px`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          initial={{ y: 0 }}
          animate={{
            y: phase === "exit" ? openOffset : 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              backgroundColor: "hsl(220 14% 92%)",
              borderRadius: "9999px",
              border: "1px solid hsl(220 10% 82%)",
              transform: `translateX(${isLeft ? "-50%" : "50%"}) translateY(-50%)`,
            }}
          />
        </motion.div>
      </>
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
          {/* 4 Quadrant panels */}
          <QuadrantPanel position="tl" />
          <QuadrantPanel position="tr" />
          <QuadrantPanel position="bl" />
          <QuadrantPanel position="br" />

          {/* Continuous border line animation */}
          <ContinuousBorderLine />

          {/* Side semicircles */}
          <SideCircle side="left" />
          <SideCircle side="right" />

          {/* Center content */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: phase === "exit" ? 0 : 1, 
              scale: phase === "exit" ? 1.02 : 1,
            }}
            transition={{ 
              duration: phase === "exit" ? 0.3 : 0.6, 
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
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6" fill="white">
                  <path d="M12 2C9.5 2 7.5 3.5 7.5 5.5C7.5 7 8.5 8.5 10 9L9 22H15L14 9C15.5 8.5 16.5 7 16.5 5.5C16.5 3.5 14.5 2 12 2Z"/>
                </svg>
              </motion.div>

              {/* Text */}
              <motion.h1 
                className="text-xl md:text-3xl font-semibold tracking-tight"
                style={{ color: "hsl(200 25% 20%)" }}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Dr. Yousif German
              </motion.h1>
            </div>
          </motion.div>

          {/* Center cross lines */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 z-5"
            style={{ backgroundColor: "hsl(220 10% 82%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 z-5"
            style={{ backgroundColor: "hsl(220 10% 82%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
