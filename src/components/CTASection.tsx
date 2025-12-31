import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Animated line with traveling dot component
const AnimatedLineWithDot = ({ 
  path, 
  className, 
  delay = 0,
  duration = 8,
  strokeOpacity = 0.25 
}: { 
  path: string; 
  className?: string; 
  delay?: number;
  duration?: number;
  strokeOpacity?: number;
}) => {
  return (
    <svg className={className} viewBox="0 0 1000 400" fill="none" preserveAspectRatio="xMidYMid slice">
      {/* Static line */}
      <motion.path
        d={path}
        stroke="hsl(var(--terminal-accent))"
        strokeWidth="1"
        strokeOpacity={strokeOpacity}
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay, ease: "easeOut" }}
      />
      
      {/* Glowing traveling dot */}
      <motion.circle
        r="4"
        fill="hsl(var(--terminal-accent))"
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ 
          duration: duration,
          repeat: Infinity,
          delay: delay + 2,
          ease: "linear"
        }}
      >
        <animateMotion
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={`${delay + 2}s`}
          path={path}
        />
      </motion.circle>
      
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export const CTASection = () => {
  const { language } = useLanguage();

  const lines = [
    // Top flowing curves
    { path: "M-50 80 Q 200 30, 400 100 T 800 60 T 1050 120", delay: 0, duration: 10 },
    { path: "M1050 50 Q 800 120, 600 40 T 200 100 T -50 60", delay: 0.5, duration: 12 },
    // Middle curves
    { path: "M-50 200 Q 150 150, 350 220 T 700 180 T 1050 240", delay: 0.3, duration: 11 },
    { path: "M1050 180 Q 850 250, 650 170 T 300 230 T -50 190", delay: 0.8, duration: 9 },
    // Bottom flowing curves
    { path: "M-50 320 Q 200 280, 400 350 T 800 300 T 1050 360", delay: 0.6, duration: 10 },
    { path: "M1050 350 Q 800 300, 600 370 T 200 320 T -50 380", delay: 1, duration: 11 },
  ];

  return (
    <section className="relative bg-terminal overflow-hidden py-16 sm:py-24 md:py-32 min-h-[350px] sm:min-h-[400px] md:min-h-[500px]">
      {/* Curved wave transition at top */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 md:h-24 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>

      {/* Animated lines with traveling dots - hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        {lines.map((line, index) => (
          <AnimatedLineWithDot
            key={index}
            path={line.path}
            delay={line.delay}
            duration={line.duration}
            className="absolute inset-0 w-full h-full"
            strokeOpacity={0.2 + (index % 2) * 0.1}
          />
        ))}
        
        {/* Additional decorative corner curves */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice">
          {/* Corner accent - top left */}
          <motion.path
            d="M0 150 Q 50 100, 100 100 L 200 100"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1.5 }}
          />
          <motion.circle
            r="3"
            fill="hsl(var(--terminal-accent))"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 3 }}
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin="3s"
              path="M0 150 Q 50 100, 100 100 L 200 100"
            />
          </motion.circle>
          
          {/* Corner accent - top right */}
          <motion.path
            d="M1000 150 Q 950 100, 900 100 L 800 100"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1.7 }}
          />
          <motion.circle
            r="3"
            fill="hsl(var(--terminal-accent))"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 3.5 }}
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin="3.5s"
              path="M1000 150 Q 950 100, 900 100 L 800 100"
            />
          </motion.circle>
          
          {/* Corner accent - bottom left */}
          <motion.path
            d="M0 250 Q 50 300, 100 300 L 200 300"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 1.9 }}
          />
          <motion.circle
            r="3"
            fill="hsl(var(--terminal-accent))"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 4 }}
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin="4s"
              path="M0 250 Q 50 300, 100 300 L 200 300"
            />
          </motion.circle>
          
          {/* Corner accent - bottom right */}
          <motion.path
            d="M1000 250 Q 950 300, 900 300 L 800 300"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            strokeOpacity="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 2.1 }}
          />
          <motion.circle
            r="3"
            fill="hsl(var(--terminal-accent))"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 4.5 }}
          >
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              begin="4.5s"
              path="M1000 250 Q 950 300, 900 300 L 800 300"
            />
          </motion.circle>
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto mb-6 sm:mb-8 italic px-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {language === 'ar' 
            ? 'ابتسامتك المثالية تبدأ اليوم.'
            : 'Your perfect smile starts today.'}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="bg-terminal-muted hover:bg-terminal-muted/80 text-white border-0 px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-base font-semibold tracking-wide uppercase group"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {language === 'ar' ? 'احجز موعدك الآن' : 'Book Your Appointment'}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
