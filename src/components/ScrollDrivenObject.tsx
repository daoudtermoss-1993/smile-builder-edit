import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export const ScrollDrivenObject = () => {
  const [windowHeight, setWindowHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll();

  // Smooth spring physics for premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Position keyframes - object travels across the page
  const x = useTransform(
    smoothProgress,
    [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
    ["70vw", "20vw", "75vw", "15vw", "80vw", "25vw", "50vw"]
  );
  
  const y = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["15vh", "35vh", "55vh", "45vh", "65vh", "85vh"]
  );

  // Scale - starts large, shrinks, grows again at key moments
  const scale = useTransform(
    smoothProgress,
    [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    [1.2, 0.8, 1.1, 0.6, 0.9, 0.5, 0.7, 0.4]
  );

  // Rotation - continuous rotation with varying speeds
  const rotate = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 90, 180, 270, 360]
  );

  // 3D rotation for depth
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.33, 0.66, 1],
    [0, 15, -15, 0]
  );

  const rotateY = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 25, 0, -25, 0]
  );

  // Opacity - fades at certain points for dramatic effect
  const opacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.15, 0.85, 0.95, 1],
    [0, 1, 1, 1, 0.5, 0]
  );

  // Blur effect for depth
  const blur = useTransform(
    smoothProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0, 2, 0, 3, 5]
  );

  // Glow intensity
  const glowOpacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.4, 0.8, 0.5, 0.9, 0.3]
  );

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Main floating object */}
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
        {/* Outer glow ring */}
        <motion.div
          className="absolute -inset-8 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
            opacity: glowOpacity,
            filter: "blur(20px)"
          }}
        />
        
        {/* Main crystal/gem shape */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {/* Diamond facets */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, 
                  hsl(var(--primary) / 0.9) 0%, 
                  hsl(var(--primary) / 0.5) 25%,
                  hsl(180 100% 45% / 0.7) 50%,
                  hsl(var(--primary) / 0.6) 75%,
                  hsl(180 100% 35% / 0.8) 100%
                )
              `,
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
              boxShadow: `
                inset 0 0 30px hsl(var(--primary) / 0.5),
                0 0 40px hsl(var(--primary) / 0.4)
              `
            }}
          />
          
          {/* Inner highlight */}
          <motion.div
            className="absolute inset-4"
            style={{
              background: "linear-gradient(to bottom right, hsl(0 0% 100% / 0.6), transparent)",
              clipPath: "polygon(50% 15%, 85% 40%, 70% 85%, 30% 85%, 15% 40%)",
            }}
          />
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              boxShadow: "0 0 10px 2px white"
            }}
          />
        </div>
      </motion.div>

      {/* Trail particles that follow with delay */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            x: useSpring(useTransform(scrollYProgress, (v) => {
              const offset = (i + 1) * 0.02;
              return `calc(${70 - v * 50}vw + ${Math.sin(v * Math.PI * 4 + i) * 50}px)`;
            }), { stiffness: 30 - i * 4, damping: 15 }),
            y: useSpring(useTransform(scrollYProgress, (v) => {
              return `calc(${15 + v * 70}vh + ${Math.cos(v * Math.PI * 3 + i) * 30}px)`;
            }), { stiffness: 30 - i * 4, damping: 15 }),
            scale: useTransform(scrollYProgress, [0, 1], [0.8 - i * 0.1, 0.3]),
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.6 - i * 0.1, 0.4 - i * 0.08, 0]),
            background: `radial-gradient(circle, hsl(var(--primary) / ${0.8 - i * 0.15}) 0%, transparent 70%)`,
            filter: `blur(${i * 2}px)`,
            willChange: "transform, opacity"
          }}
        />
      ))}

      {/* Ambient floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${10 + i * 12}%`,
            top: useTransform(
              smoothProgress,
              [0, 1],
              [`${20 + i * 8}%`, `${80 - i * 5}%`]
            ),
            opacity: useTransform(
              smoothProgress,
              [i * 0.1, i * 0.1 + 0.1, 0.9 - i * 0.05, 1],
              [0, 0.6, 0.4, 0]
            ),
            scale: useTransform(
              smoothProgress,
              [0, 0.5, 1],
              [0.5, 1.5, 0.8]
            )
          }}
        />
      ))}
    </div>
  );
};
