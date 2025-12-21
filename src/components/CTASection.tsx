import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  const { language } = useLanguage();

  return (
    <section className="relative bg-terminal overflow-hidden py-32 min-h-[500px]">
      {/* Curved wave transition at top */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
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

      {/* Animated decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left curved line */}
        <motion.svg
          className="absolute top-20 left-0 w-[600px] h-[400px] opacity-20"
          viewBox="0 0 600 400"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <motion.path
            d="M-50 350 C 100 350, 150 250, 200 200 S 350 50, 550 100"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </motion.svg>

        {/* Top right curved line */}
        <motion.svg
          className="absolute top-10 right-0 w-[500px] h-[350px] opacity-20"
          viewBox="0 0 500 350"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        >
          <motion.path
            d="M550 50 C 400 50, 350 150, 300 200 S 150 350, -50 300"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          />
        </motion.svg>

        {/* Bottom left curved line */}
        <motion.svg
          className="absolute bottom-20 left-10 w-[400px] h-[300px] opacity-15"
          viewBox="0 0 400 300"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        >
          <motion.path
            d="M-50 50 C 50 100, 100 200, 200 250 S 400 300, 450 200"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        </motion.svg>

        {/* Bottom right curved line */}
        <motion.svg
          className="absolute bottom-10 right-20 w-[350px] h-[250px] opacity-15"
          viewBox="0 0 350 250"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.7 }}
        >
          <motion.path
            d="M400 200 C 300 180, 250 100, 150 80 S -50 50, -100 150"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.7 }}
          />
        </motion.svg>

        {/* Subtle center arc */}
        <motion.svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10"
          viewBox="0 0 800 400"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
        >
          <motion.path
            d="M0 350 Q 400 50, 800 350"
            stroke="hsl(var(--terminal-accent))"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
          />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto mb-8"
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
            className="bg-terminal-muted hover:bg-terminal-muted/80 text-white border-0 px-8 py-6 text-base font-semibold tracking-wide uppercase group"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {language === 'ar' ? 'احجز موعدك الآن' : 'Book Your Appointment'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
