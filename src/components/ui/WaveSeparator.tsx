import { motion, useScroll, useTransform } from "framer-motion";
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
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  if (variant === "white-to-dark") {
    return (
      <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
        {/* White background section */}
        <div className="h-16 bg-background" />
        
        {/* Wave SVG */}
        <motion.div style={{ opacity }} className="relative">
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            className="w-full h-auto block"
            preserveAspectRatio="none"
          >
            <path 
              d="M0 0H1440V60C1440 60 1320 120 1080 100C840 80 720 20 480 40C240 60 120 120 0 100V0Z" 
              fill="hsl(var(--background))"
            />
          </svg>
          <div 
            className="absolute inset-0 -z-10" 
            style={{ backgroundColor: darkColor }}
          />
        </motion.div>
        
        {/* Dark section continuation */}
        <div className="h-8" style={{ backgroundColor: darkColor }} />
      </div>
    );
  }

  // dark-to-white variant
  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      {/* Dark background section */}
      <div className="h-8" style={{ backgroundColor: darkColor }} />
      
      {/* Wave SVG */}
      <motion.div style={{ opacity }} className="relative">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          className="w-full h-auto block rotate-180"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 0H1440V60C1440 60 1320 120 1080 100C840 80 720 20 480 40C240 60 120 120 0 100V0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
        <div 
          className="absolute inset-0 -z-10" 
          style={{ backgroundColor: darkColor }}
        />
      </motion.div>
      
      {/* White section continuation */}
      <div className="h-16 bg-background" />
    </div>
  );
}
