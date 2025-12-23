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
  
  // Convert progress (0-100) to pathLength (0-1)
  const progressPath = progress / 100;

  // Outer corner decorative lines
  const CornerLine = ({ 
    position, 
    delay = 0 
  }: { 
    position: "tl" | "tr" | "bl" | "br";
    delay?: number;
  }) => {
    const configs = {
      tl: { path: "M 0 50 L 30 50 Q 50 50 50 70 L 50 100", pos: "top-6 left-6 md:top-10 md:left-10" },
      tr: { path: "M 50 0 L 50 30 Q 50 50 70 50 L 100 50", pos: "top-6 right-6 md:top-10 md:right-10" },
      bl: { path: "M 50 100 L 50 70 Q 50 50 30 50 L 0 50", pos: "bottom-6 left-6 md:bottom-10 md:left-10" },
      br: { path: "M 100 50 L 70 50 Q 50 50 50 70 L 50 100", pos: "bottom-6 right-6 md:bottom-10 md:right-10" },
    };
    const config = configs[position];

    return (
      <div className={`absolute ${config.pos} w-24 h-24 md:w-32 md:h-32`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Background path (faded) */}
          <path
            d={config.path}
            stroke="hsl(220 10% 85%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.3}
          />
          {/* Animated progress path */}
          <motion.path
            d={config.path}
            stroke="hsl(220 10% 65%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isWaiting ? progressPath : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </svg>
      </div>
    );
  };

  // Inner corner lines (closer to center)
  const InnerCornerLine = ({ 
    position, 
    delay = 0 
  }: { 
    position: "tl" | "tr" | "bl" | "br";
    delay?: number;
  }) => {
    const configs = {
      tl: { path: "M 0 40 L 40 40 Q 60 40 60 60 L 60 100", pos: "top-16 left-16 md:top-24 md:left-24" },
      tr: { path: "M 60 0 L 60 40 Q 60 60 80 60 L 100 60", pos: "top-16 right-16 md:top-24 md:right-24" },
      bl: { path: "M 60 100 L 60 60 Q 60 40 40 40 L 0 40", pos: "bottom-16 left-16 md:bottom-24 md:left-24" },
      br: { path: "M 100 40 L 60 40 Q 40 40 40 60 L 40 100", pos: "bottom-16 right-16 md:bottom-24 md:right-24" },
    };
    const config = configs[position];

    return (
      <div className={`absolute ${config.pos} w-16 h-16 md:w-24 md:h-24`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Background path (faded) */}
          <path
            d={config.path}
            stroke="hsl(220 10% 88%)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity={0.3}
          />
          {/* Animated progress path */}
          <motion.path
            d={config.path}
            stroke="hsl(220 10% 70%)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isWaiting ? progressPath : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
        {/* Outer corner decorative lines */}
        <CornerLine position={position} delay={delays[position]} />
        <InnerCornerLine position={position} delay={delays[position]} />

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
