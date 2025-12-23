import { motion } from "framer-motion";

interface DecorativeLinesProps {
  className?: string;
  lineColor?: string;
  animated?: boolean;
}

export function DecorativeLines({ 
  className = "", 
  lineColor = "hsl(var(--muted-foreground) / 0.2)",
  animated = true 
}: DecorativeLinesProps) {
  const paths = [
    // Top Left Corner - L shape with rounded corner
    "M0 180 L0 80 Q0 0 80 0 L200 0",
    // Top Center - Curved line going down
    "M620 0 L620 60 Q620 120 680 120 L760 120 Q820 120 820 180 L820 200",
    // Top Right Corner - L shape with rounded corner
    "M1240 0 L1360 0 Q1440 0 1440 80 L1440 180",
    // Right side curved line
    "M1440 400 L1380 400 Q1320 400 1320 460 L1320 540 Q1320 600 1380 600 L1440 600",
    // Bottom Left Corner
    "M0 720 L0 820 Q0 900 80 900 L200 900",
    // Bottom Left - small curved connector
    "M280 900 L360 900 Q420 900 420 840 L420 760",
    // Bottom Right Corner
    "M1240 900 L1360 900 Q1440 900 1440 820 L1440 720",
    // Left side curved line
    "M0 400 L60 400 Q120 400 120 460 L120 540 Q120 600 60 600 L0 600"
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((d, i) => (
          animated ? (
            <motion.path
              key={i}
              d={d}
              stroke={lineColor}
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.5, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.3, delay: i * 0.15 }
              }}
            />
          ) : (
            <path
              key={i}
              d={d}
              stroke={lineColor}
              strokeWidth="1.5"
              fill="none"
            />
          )
        ))}
      </svg>
    </div>
  );
}
