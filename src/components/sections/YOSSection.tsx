import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function YOSSection() {
  const { language } = useLanguage();

  return (
    <section className="min-h-screen bg-[hsl(175_25%_8%)] relative flex items-center justify-center overflow-hidden py-24">
      {/* Grid Pattern */}
      <div className="absolute inset-0 terminal-grid-bg opacity-50" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-white/50 text-lg md:text-xl"
        >
          {language === 'ar' ? 'هذا هو' : "That's the"}
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-[6rem] font-bold text-white mt-4 tracking-tight"
        >
          {language === 'ar' ? 'نظام رعاية الأسنان.' : 'Dental Care System.'}
        </motion.h2>

        {/* Animated Counter Section */}
        <motion.div 
          className="mt-16 flex justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { number: "15+", labelEn: "Years Experience", labelAr: "سنوات خبرة" },
            { number: "5000+", labelEn: "Happy Patients", labelAr: "مريض سعيد" },
            { number: "10000+", labelEn: "Treatments", labelAr: "علاج" },
          ].map((stat, index) => (
            <motion.div 
              key={stat.number}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-white/50 mt-2">
                {language === 'ar' ? stat.labelAr : stat.labelEn}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
