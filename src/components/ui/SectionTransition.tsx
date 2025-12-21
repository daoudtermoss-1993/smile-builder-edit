import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Grid lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Grid dots at intersections */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--terminal-accent)) 1.5px, transparent 1.5px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0',
        }}
      />
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
