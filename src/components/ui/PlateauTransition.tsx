import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface PlateauTransitionProps {
  className?: string;
  darkColor?: string;
}

export function PlateauTransition({ 
  className = "",
  darkColor = "hsl(180, 35%, 8%)"
}: PlateauTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-10%" });

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      {/* Plateau curve at TOP - white background with plateau shape curving into dark */}
      <div className="relative bg-background">
        <svg 
          viewBox="0 0 1440 100" 
          fill="none" 
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* White background fills top */}
          <rect x="0" y="0" width="1440" height="100" fill="hsl(var(--background))" />
          {/* Dark plateau shape rising from bottom */}
          <path 
            d="M0 100 
               L0 40 
               C0 40 20 40 60 40 
               C100 40 140 100 240 100 
               L1200 100 
               C1300 100 1340 40 1380 40 
               C1420 40 1440 40 1440 40 
               L1440 100 
               Z" 
            fill={darkColor}
          />
          {/* Subtle highlight line at the edge of the plateau */}
          <path 
            d="M240 100 L1200 100" 
            stroke="hsl(175, 60%, 40%, 0.2)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Dark section with grid */}
      <div 
        className="relative py-16 md:py-24"
        style={{ backgroundColor: darkColor }}
      >
        {/* Grid pattern */}
        {isInView && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Vertical lines */}
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(175,60%,40%,0.12)] to-transparent"
                style={{ left: `${(i + 1) * 6}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
              />
            ))}
            
            {/* Horizontal lines */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(175,60%,40%,0.1)] to-transparent"
                style={{ top: `${(i + 1) * 25}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}