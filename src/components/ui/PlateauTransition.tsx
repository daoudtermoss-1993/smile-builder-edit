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
      
      {/* Plateau curve - white shape with rounded corners */}
      <div className="relative" style={{ backgroundColor: darkColor }}>
        <svg 
          viewBox="0 0 1440 100" 
          fill="none" 
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* Main plateau shape - flat middle with rounded corners on sides */}
          <path 
            d="M0 0 
               L0 100 
               L1440 100 
               L1440 0 
               C1440 0 1420 0 1380 0 
               C1340 0 1300 60 1200 60 
               L240 60 
               C140 60 100 0 60 0 
               C20 0 0 0 0 0 
               Z" 
            fill="hsl(var(--background))"
          />
          {/* Subtle highlight line at the top of the plateau */}
          <path 
            d="M240 60 L1200 60" 
            stroke="hsl(175, 60%, 40%, 0.2)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}