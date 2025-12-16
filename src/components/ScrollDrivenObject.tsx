import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const ScrollDrivenObject = () => {
  const { scrollYProgress } = useScroll();

  // Smooth spring physics for premium cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    restDelta: 0.001
  });

  // Section-synchronized keyframes:
  // 0.00 - 0.15: Hero (starts large, centered-right)
  // 0.15 - 0.30: About (moves left, shrinks)
  // 0.30 - 0.45: Services (moves right, grows slightly)
  // 0.45 - 0.60: Gallery/BeforeAfter (moves left)
  // 0.60 - 0.80: Booking (moves right, shrinks)
  // 0.80 - 1.00: Contact (fades out to center)

  const x = useTransform(
    smoothProgress,
    [0, 0.15, 0.30, 0.45, 0.60, 0.80, 1],
    ["65vw", "15vw", "75vw", "10vw", "80vw", "20vw", "50vw"]
  );
  
  const y = useTransform(
    smoothProgress,
    [0, 0.15, 0.30, 0.45, 0.60, 0.80, 1],
    ["25vh", "50vh", "45vh", "55vh", "50vh", "60vh", "75vh"]
  );

  // Scale - large in hero, smaller as we scroll
  const scale = useTransform(
    smoothProgress,
    [0, 0.10, 0.15, 0.30, 0.45, 0.60, 0.80, 1],
    [1.5, 1.3, 0.9, 1.0, 0.7, 0.8, 0.5, 0.3]
  );

  // Rotation synchronized with sections
  const rotate = useTransform(
    smoothProgress,
    [0, 0.15, 0.30, 0.45, 0.60, 0.80, 1],
    [0, 15, -10, 20, -15, 10, 0]
  );

  // 3D rotations for depth
  const rotateY = useTransform(
    smoothProgress,
    [0, 0.15, 0.30, 0.45, 0.60, 0.80, 1],
    [0, 30, -20, 25, -30, 15, 0]
  );

  const rotateX = useTransform(
    smoothProgress,
    [0, 0.30, 0.60, 1],
    [0, 10, -10, 5]
  );

  // Opacity - visible in hero, fades slightly in middle, fades out at end
  const opacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.12, 0.85, 0.95, 1],
    [0, 0.85, 0.7, 0.5, 0.2, 0]
  );

  // Glow intensity per section
  const glowOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.30, 0.45, 0.60, 0.80, 1],
    [0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.3]
  );

  // Blur for depth effect
  const blur = useTransform(
    smoothProgress,
    [0, 0.15, 0.45, 0.80, 1],
    [0, 1, 2, 3, 5]
  );

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Main floating tooth */}
      <motion.div
        className="absolute"
        style={{
          x,
          y,
          scale,
          rotate,
          rotateX,
          rotateY,
          opacity,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
          transformStyle: "preserve-3d",
          willChange: "transform, opacity, filter"
        }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-12 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 60%)",
            opacity: glowOpacity,
            filter: "blur(25px)"
          }}
        />
        
        {/* Tooth shape - stylized molar */}
        <div className="relative w-28 h-32 md:w-36 md:h-40">
          {/* Main tooth body */}
          <motion.svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.5))" }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(180 100% 98%)" />
                <stop offset="30%" stopColor="hsl(180 60% 95%)" />
                <stop offset="60%" stopColor="hsl(180 40% 90%)" />
                <stop offset="100%" stopColor="hsl(180 50% 85%)" />
              </linearGradient>
              <linearGradient id="toothHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="toothShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(180 100% 35%)" stopOpacity="0" />
                <stop offset="100%" stopColor="hsl(180 100% 35%)" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Tooth crown (top part) */}
            <path
              d="M20 45 
                 Q20 15, 50 10 
                 Q80 15, 80 45
                 Q80 55, 75 60
                 L70 65
                 Q65 70, 60 68
                 L55 65
                 Q50 62, 45 65
                 L40 68
                 Q35 70, 30 65
                 L25 60
                 Q20 55, 20 45Z"
              fill="url(#toothGradient)"
              stroke="hsl(180 40% 80%)"
              strokeWidth="1"
              filter="url(#glow)"
            />
            
            {/* Left root */}
            <path
              d="M30 65
                 Q28 75, 25 90
                 Q23 105, 28 110
                 Q33 112, 35 105
                 Q38 90, 40 68Z"
              fill="url(#toothGradient)"
              stroke="hsl(180 40% 80%)"
              strokeWidth="1"
            />
            
            {/* Right root */}
            <path
              d="M60 68
                 Q62 85, 65 95
                 Q68 108, 72 110
                 Q77 108, 75 100
                 Q73 85, 70 65Z"
              fill="url(#toothGradient)"
              stroke="hsl(180 40% 80%)"
              strokeWidth="1"
            />
            
            {/* Crown highlight */}
            <path
              d="M25 40 
                 Q25 20, 50 15 
                 Q70 18, 72 35
                 Q65 25, 50 22
                 Q35 25, 25 40Z"
              fill="url(#toothHighlight)"
            />
            
            {/* Crown shadow/depth */}
            <path
              d="M50 35
                 Q45 40, 40 38
                 Q35 36, 38 42
                 Q42 48, 50 45
                 Q58 48, 62 42
                 Q65 36, 60 38
                 Q55 40, 50 35Z"
              fill="hsl(180 30% 85%)"
              opacity="0.5"
            />
          </motion.svg>
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute top-4 left-6 w-3 h-3 bg-white rounded-full"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.3, 0.8]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              boxShadow: "0 0 12px 4px white"
            }}
          />
          
          {/* Secondary sparkle */}
          <motion.div
            className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.6, 1.1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{
              boxShadow: "0 0 8px 2px white"
            }}
          />
        </div>
      </motion.div>

      {/* Trail particles following the tooth */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            x: useSpring(useTransform(smoothProgress, (v) => {
              const baseX = 65 - v * 45 + Math.sin(v * Math.PI * 3 + i * 1.5) * 40;
              return `${baseX}vw`;
            }), { stiffness: 25 - i * 3, damping: 12 }),
            y: useSpring(useTransform(smoothProgress, (v) => {
              const baseY = 25 + v * 50 + Math.cos(v * Math.PI * 2.5 + i) * 25;
              return `${baseY}vh`;
            }), { stiffness: 25 - i * 3, damping: 12 }),
            scale: useTransform(smoothProgress, [0, 1], [0.6 - i * 0.1, 0.2]),
            opacity: useTransform(
              smoothProgress, 
              [0, 0.08, 0.88, 1], 
              [0, 0.5 - i * 0.1, 0.3 - i * 0.05, 0]
            ),
            background: `radial-gradient(circle, hsl(180 100% 90% / ${0.7 - i * 0.12}) 0%, transparent 70%)`,
            filter: `blur(${i + 1}px)`,
            willChange: "transform, opacity"
          }}
        />
      ))}
    </div>
  );
};