import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";

export function TerminalHero() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[hsl(175_25%_8%)]"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 terminal-grid-bg opacity-60" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(175_25%_8%)]" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <motion.div 
        className="relative z-10 container mx-auto px-6"
        style={{ opacity, scale, y }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Small intro text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-8"
          >
            {language === 'ar' ? 'مستقبل طب الأسنان' : 'The Future of Dentistry'}
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-white mb-6"
          >
            <span className="block">
              {language === 'ar' ? 'أعدنا اختراع' : 'We have reinvented'}
            </span>
            <span className="block text-primary/90">
              {language === 'ar' ? 'ابتسامتك.' : 'your smile.'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12"
          >
            {language === 'ar' 
              ? 'نقدم رعاية أسنان متقدمة باستخدام أحدث التقنيات.'
              : 'Delivering advanced dental care through cutting-edge technology.'}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a 
              href="#booking"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300 group"
            >
              <span>{language === 'ar' ? 'احجز موعدك' : 'Book Your Appointment'}</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className="text-xs text-white/40 tracking-[0.2em] uppercase">
          {language === 'ar' ? 'مرر للاستكشاف' : 'Scroll to explore'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
