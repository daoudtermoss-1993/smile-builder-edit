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
  const rows = 10;
  const cols = 20;
  
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Static grid lines background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      
      {/* Animated horizontal lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={`${(i / rows) * 100}%`}
            x2="100%"
            y2={`${(i / rows) * 100}%`}
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1.5, 
              delay: i * 0.05,
              ease: "easeOut" 
            }}
          />
        ))}
        
        {/* Animated vertical lines */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${(i / cols) * 100}%`}
            y1="0"
            x2={`${(i / cols) * 100}%`}
            y2="100%"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1.5, 
              delay: 0.3 + i * 0.03,
              ease: "easeOut" 
            }}
          />
        ))}
      </svg>
      
      {/* Animated dots at intersections */}
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
              whileInView={{ scale: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.3, 
                delay: 0.8 + (row + col) * 0.02,
                ease: "easeOut" 
              }}
            />
          ))
        )}
      </div>
      
      {/* Subtle corner accent lines */}
      <motion.svg 
        className="absolute top-0 left-0 w-32 h-32 opacity-30"
        viewBox="0 0 128 128"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.path
          d="M0 80 L0 0 L80 0"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
        />
      </motion.svg>
      
      <motion.svg 
        className="absolute bottom-0 right-0 w-32 h-32 opacity-30"
        viewBox="0 0 128 128"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.path
          d="M128 48 L128 128 L48 128"
          stroke="hsl(var(--terminal-accent))"
          strokeWidth="1"
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
