interface PlateauTransitionProps {
  className?: string;
  darkColor?: string;
}

export function PlateauTransition({ 
  className = "",
  darkColor = "hsl(180, 35%, 8%)"
}: PlateauTransitionProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Dark section with plateau shape - white curves up from bottom */}
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