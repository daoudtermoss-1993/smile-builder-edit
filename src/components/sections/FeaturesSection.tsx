import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, Scan, Shield, Sparkles, Clock, Users } from "lucide-react";

interface Feature {
  number: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: React.ElementType;
}

const features: Feature[] = [
  {
    number: "01",
    titleEn: "Digital Precision",
    titleAr: "دقة رقمية",
    descriptionEn: "Advanced digital imaging and 3D scanning technology for precise diagnosis and treatment planning. Every detail matters for your perfect smile.",
    descriptionAr: "تقنية التصوير الرقمي المتقدم والمسح ثلاثي الأبعاد للتشخيص الدقيق وتخطيط العلاج. كل التفاصيل مهمة لابتسامتك المثالية.",
    icon: Scan
  },
  {
    number: "02",
    titleEn: "Personalized Care",
    titleAr: "رعاية شخصية",
    descriptionEn: "Tailored treatment plans designed specifically for your unique dental needs. We listen, understand, and deliver results that exceed expectations.",
    descriptionAr: "خطط علاج مصممة خصيصًا لاحتياجاتك الفريدة. نستمع ونفهم ونقدم نتائج تفوق التوقعات.",
    icon: Users
  },
  {
    number: "03",
    titleEn: "Safe & Comfortable",
    titleAr: "آمن ومريح",
    descriptionEn: "State-of-the-art sterilization and safety protocols combined with a relaxing environment. Your comfort and safety are our top priorities.",
    descriptionAr: "بروتوكولات التعقيم والسلامة المتطورة مع بيئة مريحة. راحتك وسلامتك أولوياتنا القصوى.",
    icon: Shield
  }
];

export function FeaturesSection() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Split Section - White Left, Dark Right */}
      {features.map((feature, index) => (
        <div 
          key={feature.number}
          className={`min-h-screen flex flex-col lg:flex-row ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
        >
          {/* White Side */}
          <div className="lg:w-1/2 bg-white py-16 lg:py-0 flex items-center">
            <motion.div 
              className="container mx-auto px-6 lg:px-12 max-w-xl"
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-gray-400 tracking-wider">
                {feature.number}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                {language === 'ar' ? feature.titleAr : feature.titleEn}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {language === 'ar' ? feature.descriptionAr : feature.descriptionEn}
              </p>

              {/* Feature List */}
              <div className="mt-8 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-gray-700 text-sm">
                      {language === 'ar' ? 'ميزة متقدمة' : `Advanced feature ${item}`}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dark Side with Grid */}
          <div className="lg:w-1/2 bg-[hsl(175_25%_8%)] py-24 lg:py-0 flex items-center relative">
            {/* Grid Pattern */}
            <div className="absolute inset-0 terminal-grid-bg opacity-40" />
            
            <motion.div 
              className="container mx-auto px-6 lg:px-12 flex items-center justify-center relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {/* Large Icon Display */}
              <div className="relative">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl border border-primary/20 bg-primary/5 flex items-center justify-center backdrop-blur-sm">
                  <feature.icon className="w-20 h-20 md:w-28 md:h-28 text-primary/80" strokeWidth={1} />
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-white/10"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}
