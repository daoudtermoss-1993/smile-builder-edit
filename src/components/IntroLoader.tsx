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
  const startedRef = useRef(false);

  const isWaiting = phase === "loading";

  // Wait for page to be fully loaded
  useEffect(() => {
    const checkLoaded = () => {
      if (document.readyState === "complete") {
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

  // Terminal-style border path with rounded corners
  const TerminalBorderLines = () => {
    // Corner radius for the curved sections
    const margin = 60;
    const cornerRadius = 80;
    
    // Create separate path segments for each corner area (like Terminal image)
    // Top-left corner path
    const topLeftPath = `
      M ${margin} ${margin + 200}
      L ${margin} ${margin + cornerRadius}
      Q ${margin} ${margin} ${margin + cornerRadius} ${margin}
      L ${margin + 250} ${margin}
    `;
    
    // Top-right corner path
    const topRightPath = `
      M ${1000 - margin - 250} ${margin}
      L ${1000 - margin - cornerRadius} ${margin}
      Q ${1000 - margin} ${margin} ${1000 - margin} ${margin + cornerRadius}
      L ${1000 - margin} ${margin + 200}
    `;
    
    // Bottom-right corner path
    const bottomRightPath = `
      M ${1000 - margin} ${600 - margin - 200}
      L ${1000 - margin} ${600 - margin - cornerRadius}
      Q ${1000 - margin} ${600 - margin} ${1000 - margin - cornerRadius} ${600 - margin}
      L ${1000 - margin - 250} ${600 - margin}
    `;
    
    // Bottom-left corner path
    const bottomLeftPath = `
      M ${margin + 250} ${600 - margin}
      L ${margin + cornerRadius} ${600 - margin}
      Q ${margin} ${600 - margin} ${margin} ${600 - margin - cornerRadius}
      L ${margin} ${600 - margin - 200}
    `;

    // Combined path for the teal progress line
    const fullPath = `
      ${topLeftPath.replace('M', 'M')}
      ${topRightPath.replace('M', ' M')}
      ${bottomRightPath.replace('M', ' M')}
      ${bottomLeftPath.replace('M', ' M')}
    `;

    return (
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background paths (light gray like Terminal) */}
          <path
            d={topLeftPath}
            stroke="hsl(220 10% 75%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={topRightPath}
            stroke="hsl(220 10% 75%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={bottomRightPath}
            stroke="hsl(220 10% 75%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={bottomLeftPath}
            stroke="hsl(220 10% 75%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* Teal progress line that travels along the path */}
          {isWaiting ? (
            <>
              {/* Top-left progress */}
              <motion.path
                d={topLeftPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                vectorEffect="non-scaling-stroke"
              />
              {/* Top-right progress */}
              <motion.path
                d={topRightPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                vectorEffect="non-scaling-stroke"
              />
              {/* Bottom-right progress */}
              <motion.path
                d={bottomRightPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                vectorEffect="non-scaling-stroke"
              />
              {/* Bottom-left progress */}
              <motion.path
                d={bottomLeftPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : (
            <>
              {/* Complete all paths when loading is done */}
              <motion.path
                d={topLeftPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: progress / 100 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={topRightPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: progress / 100 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={bottomRightPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: progress / 100 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={bottomLeftPath}
                stroke="hsl(175 85% 35%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: progress / 100 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
      </div>
    );
  };

  const openOffset = 200;

  // Top Panel
  const TopPanel = () => {
    return (
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 overflow-visible pointer-events-none"
        style={{ backgroundColor: "hsl(220 14% 92%)" }}
        initial={{ y: 0 }}
        animate={{ y: phase === "exit" ? -openOffset : 0 }}
        transition={{
          duration: phase === "exit" ? 2.4 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    );
  };

  // Bottom Panel
  const BottomPanel = () => {
    return (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 overflow-visible pointer-events-none"
        style={{ backgroundColor: "hsl(220 14% 92%)" }}
        initial={{ y: 0 }}
        animate={{ y: phase === "exit" ? openOffset : 0 }}
        transition={{
          duration: phase === "exit" ? 2.4 : 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
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
          {/* Top and Bottom panels */}
          <TopPanel />
          <BottomPanel />

          {/* Terminal-style border lines with teal progress */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            transition={{ duration: 1.2, delay: phase === "exit" ? 0.8 : 0 }}
          >
            <TerminalBorderLines />
          </motion.div>

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
