import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clinicLogo from "@/assets/clinic-logo.png";

interface IntroLoaderProps {
  onComplete: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Corner shape SVG paths - rounded corners pointing inward
  const CornerShape = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
    const rotations = {
      tl: 0,
      tr: 90,
      bl: -90,
      br: 180,
    };

    const positions = {
      tl: "top-0 left-0",
      tr: "top-0 right-0",
      bl: "bottom-0 left-0",
      br: "bottom-0 right-0",
    };

    return (
      <motion.div
        className={`absolute ${positions[position]} w-[35vw] h-[35vh]`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ transform: `rotate(${rotations[position]}deg)` }}
        >
          {/* Outer rounded corner line */}
          <motion.path
            d="M 0 80 Q 0 0 80 0 L 200 0 L 200 10 L 85 10 Q 10 10 10 85 L 10 200 L 0 200 Z"
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.15)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          />
          {/* Inner rounded rectangle shape */}
          <motion.path
            d="M 50 200 L 50 130 Q 50 50 130 50 L 200 50 L 200 65 L 135 65 Q 65 65 65 135 L 65 200 Z"
            fill="none"
            stroke="hsl(var(--muted-foreground) / 0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "hsl(var(--muted))" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Decorative corner shapes */}
          <CornerShape position="tl" />
          <CornerShape position="tr" />
          <CornerShape position="bl" />
          <CornerShape position="br" />

          {/* Center logo */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* Logo image */}
            <motion.img
              src={clinicLogo}
              alt="Clinic Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />

            {/* Clinic name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h1 
                className="text-2xl md:text-3xl font-semibold tracking-wide"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Dr. Yousif German
              </h1>
              <motion.p
                className="text-sm md:text-base mt-1 tracking-widest uppercase"
                style={{ color: "hsl(var(--muted-foreground))" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                Dental Clinic
              </motion.p>
            </motion.div>

            {/* Subtle loading indicator */}
            <motion.div
              className="mt-6 w-16 h-0.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.2)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "hsl(175 85% 35%)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Floating accent lines */}
          <motion.div
            className="absolute top-1/2 left-[15%] w-[8vw] h-px"
            style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.15)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          <motion.div
            className="absolute top-1/2 right-[15%] w-[8vw] h-px"
            style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.15)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
