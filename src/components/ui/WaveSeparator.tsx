import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

interface WaveSeparatorProps {
  variant?: "white-to-dark" | "dark-to-white";
  className?: string;
  darkColor?: string;
}

export function WaveSeparator({ 
  variant = "white-to-dark", 
  className = "",
  darkColor = "hsl(180, 35%, 8%)"
}: WaveSeparatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  if (variant === "dark-to-white") {
    return (
      <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
        {/* Dark section with grid */}
        <div 
          className="relative py-12"
          style={{ backgroundColor: darkColor }}
        >
          {/* Grid pattern */}
          {isInView && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Vertical lines */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(175,60%,40%,0.15)] to-transparent"
                  style={{ left: `${(i + 1) * 8}%` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                />
              ))}
              
              {/* Horizontal lines */}
              {Array.from({ length: 2 }).map((_, i) => (
                <motion.div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(175,60%,40%,0.12)] to-transparent"
                  style={{ top: `${(i + 1) * 33}%` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                />
              ))}
              
              {/* Dots at intersections */}
              {Array.from({ length: 12 }).map((_, col) => (
                <motion.div
                  key={`dot-${col}`}
                  className="absolute w-1 h-1 rounded-full bg-[hsl(175,60%,45%,0.4)]"
                  style={{ 
                    top: '15%', 
                    left: `${(col + 1) * 8}%` 
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + col * 0.02 }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Curved wave transition */}
        <motion.div style={{ opacity }} className="relative">
          <svg 
            viewBox="0 0 1440 80" 
            fill="none" 
            className="w-full h-auto block -mt-1"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 0H1440V0C1440 0 1400 0 1350 20C1280 50 1200 80 720 80C240 80 160 50 90 20C40 0 0 0 0 0V0Z" 
              fill={darkColor}
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  // white-to-dark variant
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      {/* Curved wave transition */}
      <motion.div style={{ opacity }} className="relative">
        <svg 
          viewBox="0 0 1440 80" 
          fill="none" 
          className="w-full h-auto block mb-[-1px]"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 80H1440V80C1440 80 1400 80 1350 60C1280 30 1200 0 720 0C240 0 160 30 90 60C40 80 0 80 0 80V80Z" 
            fill={darkColor}
          />
        </svg>
      </motion.div>
      
      {/* Dark section with grid */}
      <div 
        className="relative py-12"
        style={{ backgroundColor: darkColor }}
      >
        {/* Grid pattern */}
        {isInView && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Vertical lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(175,60%,40%,0.15)] to-transparent"
                style={{ left: `${(i + 1) * 8}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
              />
            ))}
            
            {/* Horizontal lines */}
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(175,60%,40%,0.12)] to-transparent"
                style={{ top: `${(i + 1) * 33}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              />
            ))}
            
            {/* Dots at intersections */}
            {Array.from({ length: 12 }).map((_, col) => (
              <motion.div
                key={`dot-${col}`}
                className="absolute w-1 h-1 rounded-full bg-[hsl(175,60%,45%,0.4)]"
                style={{ 
                  top: '50%', 
                  left: `${(col + 1) * 8}%` 
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + col * 0.02 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
