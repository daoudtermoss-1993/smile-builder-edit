import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

interface TealGridTransitionProps {
  className?: string;
}

export function TealGridTransition({ className = "" }: TealGridTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20%" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div 
      ref={containerRef}
      className={`relative h-[30vh] w-full overflow-hidden ${className}`}
    >
      {/* Teal dark background */}
      <motion.div 
        className="absolute inset-0 bg-[hsl(180,35%,8%)]"
        style={{ opacity, scale }}
      />
      
      {/* Animated Grid Lines */}
      {isInView && (
        <motion.div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity }}
        >
          {/* Vertical lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 w-px bg-gradient-to-b from-transparent via-[hsl(175,60%,40%,0.2)] to-transparent"
              style={{ left: `${(i + 1) * 8}%` }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100%', opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.03,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          ))}
          
          {/* Horizontal lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 h-px bg-gradient-to-r from-transparent via-[hsl(175,60%,40%,0.15)] to-transparent"
              style={{ top: `${(i + 1) * 20}%` }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ 
                duration: 1, 
                delay: 0.2 + i * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          ))}
          
          {/* Corner dots */}
          {Array.from({ length: 3 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <motion.div
                key={`dot-${row}-${col}`}
                className="absolute w-1 h-1 rounded-full bg-[hsl(175,60%,45%,0.35)]"
                style={{ 
                  top: `${(row + 1) * 25}%`, 
                  left: `${(col + 1) * 9}%` 
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.4 + (row + col) * 0.02,
                  ease: "easeOut"
                }}
              />
            ))
          )}
        </motion.div>
      )}

      {/* Top curve */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-[3] h-8 rotate-180"
        style={{ opacity }}
      >
        <svg 
          viewBox="0 0 1440 32" 
          fill="none" 
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 32V32H160C160 32 180 32 200 24C220 16 250 10 300 10H1140C1190 10 1220 16 1240 24C1260 32 1280 32 1280 32H1440V32H0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </motion.div>

      {/* Bottom curve */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-[3] h-8"
        style={{ opacity }}
      >
        <svg 
          viewBox="0 0 1440 32" 
          fill="none" 
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 32V32H160C160 32 180 32 200 24C220 16 250 10 300 10H1140C1190 10 1220 16 1240 24C1260 32 1280 32 1280 32H1440V32H0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </motion.div>
    </div>
  );
}
