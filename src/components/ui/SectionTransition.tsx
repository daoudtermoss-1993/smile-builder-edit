import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionTransitionProps {
  variant: "white-to-dark" | "dark-to-white";
  className?: string;
}

export function SectionTransition({ variant, className }: SectionTransitionProps) {
  const isWhiteToDark = variant === "white-to-dark";
  
  return (
    <div 
      className={cn(
        "relative w-full h-[80px] md:h-[120px] overflow-hidden pointer-events-none",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {isWhiteToDark ? (
          <>
            {/* White background on top, curve reveals dark below */}
            <rect width="1440" height="120" fill="hsl(var(--terminal-dark))" />
            <path
              d="M0,0 L0,60 Q360,120 720,60 Q1080,0 1440,60 L1440,0 Z"
              fill="hsl(var(--background))"
            />
          </>
        ) : (
          <>
            {/* Dark background on top, curve reveals white below */}
            <rect width="1440" height="120" fill="hsl(var(--background))" />
            <path
              d="M0,0 L0,60 Q360,120 720,60 Q1080,0 1440,60 L1440,0 Z"
              fill="hsl(var(--terminal-dark))"
            />
          </>
        )}
      </svg>
    </div>
  );
}

export function GridPattern({ className }: { className?: string }) {
  const gridSize = 80;
  const rows = 8;
  const cols = 18;
  
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Static grid lines background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      
      {/* Animated grid lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {/* Horizontal lines */}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${(i / rows) * 100}%`}
            x2="100%"
            y2={`${(i / rows) * 100}%`}
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="0.5"
            strokeOpacity="0.12"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
          />
        ))}
        
        {/* Vertical lines */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${(i / cols) * 100}%`}
            y1="0"
            x2={`${(i / cols) * 100}%`}
            y2="100%"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="0.5"
            strokeOpacity="0.12"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.03, ease: "easeOut" }}
          />
        ))}
      </svg>
      
      {/* Animated curved lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        {/* Top left curve */}
        <motion.path
          d="M-50 100 Q 150 50, 300 150 T 600 100"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.25"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* Top right curve */}
        <motion.path
          d="M1050 80 Q 850 150, 700 50 T 400 120"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.7, ease: "easeInOut" }}
        />
        
        {/* Bottom left curve */}
        <motion.path
          d="M-30 500 Q 200 400, 350 500 T 700 450"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.9, ease: "easeInOut" }}
        />
        
        {/* Bottom right curve */}
        <motion.path
          d="M1050 520 Q 800 450, 650 550 T 300 480"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.25"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1.1, ease: "easeInOut" }}
        />
        
        {/* Center flowing curve */}
        <motion.path
          d="M-50 300 Q 250 200, 500 300 T 1050 280"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
        />
        
        {/* Diagonal curve top-left to bottom-right */}
        <motion.path
          d="M50 50 Q 300 150, 400 300 T 800 550"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="0.8"
          fill="none"
          strokeOpacity="0.18"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1.3, ease: "easeInOut" }}
        />
        
        {/* Diagonal curve top-right to bottom-left */}
        <motion.path
          d="M950 80 Q 700 200, 600 350 T 200 550"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="0.8"
          fill="none"
          strokeOpacity="0.18"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Pulsing dots at intersections */}
      <div className="absolute inset-0">
        {Array.from({ length: rows + 1 }).map((_, row) => 
          Array.from({ length: cols + 1 }).map((_, col) => (
            <motion.div
              key={`dot-${row}-${col}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-terminal-accent"
              style={{
                left: `calc(${(col / cols) * 100}% - 3px)`,
                top: `calc(${(row / rows) * 100}% - 3px)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 1, 0],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{ 
                duration: 4,
                delay: (row + col) * 0.15,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          ))
        )}
      </div>
      
      {/* Corner accent lines */}
      <motion.svg 
        className="absolute top-0 left-0 w-40 h-40 opacity-30"
        viewBox="0 0 160 160"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.path
          d="M0 100 L0 0 L100 0"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        />
      </motion.svg>
      
      <motion.svg 
        className="absolute bottom-0 right-0 w-40 h-40 opacity-30"
        viewBox="0 0 160 160"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.path
          d="M160 60 L160 160 L60 160"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
        />
      </motion.svg>
    </div>
  );
}

export function DarkSection({ 
  children, 
  className,
  showGrid = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  showGrid?: boolean;
}) {
  return (
    <section className={cn("relative bg-[hsl(var(--terminal-dark))] text-white", className)}>
      {showGrid && <GridPattern />}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

export function LightSection({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <section className={cn("relative bg-[hsl(var(--background))]", className)}>
      {children}
    </section>
  );
}

export function SplitLayout({
  children,
  reverse = false,
  className,
}: {
  children: [React.ReactNode, React.ReactNode];
  reverse?: boolean;
  className?: string;
}) {
  const [leftContent, rightContent] = children;
  
  return (
    <div className={cn(
      "grid grid-cols-1 lg:grid-cols-2 min-h-[600px]",
      reverse && "lg:[&>*:first-child]:order-2",
      className
    )}>
      <div className="flex items-center justify-center p-8 lg:p-16">
        {leftContent}
      </div>
      <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[3rem] m-4 lg:m-8 bg-[hsl(var(--terminal-dark))]">
        <GridPattern />
        <div className="relative z-10 h-full flex items-center justify-center p-8">
          {rightContent}
        </div>
      </div>
    </div>
  );
}
