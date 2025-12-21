import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Benefit {
  number: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

const benefits: Benefit[] = [
  {
    number: "Benefit 01",
    titleEn: "A single solution for maximum dental care",
    titleAr: "حل واحد لأقصى رعاية للأسنان",
    descriptionEn: "Comprehensive dental services from preventive care to advanced cosmetic procedures. All under one roof with seamless coordination between treatments for the best possible outcomes.",
    descriptionAr: "خدمات طب أسنان شاملة من الرعاية الوقائية إلى الإجراءات التجميلية المتقدمة. كل شيء تحت سقف واحد مع تنسيق سلس بين العلاجات للحصول على أفضل النتائج."
  },
  {
    number: "Benefit 02",
    titleEn: "Easy, comfortable experience",
    titleAr: "تجربة سهلة ومريحة",
    descriptionEn: "Modern facilities designed for your comfort with the latest technology. From online booking to relaxing treatment rooms, we prioritize your experience at every step.",
    descriptionAr: "مرافق حديثة مصممة لراحتك مع أحدث التقنيات. من الحجز عبر الإنترنت إلى غرف العلاج المريحة، نولي الأولوية لتجربتك في كل خطوة."
  },
  {
    number: "Benefit 03",
    titleEn: "Lasting results you can trust",
    titleAr: "نتائج دائمة يمكنك الوثوق بها",
    descriptionEn: "Using premium materials and proven techniques to ensure your dental work stands the test of time. We back our work with comprehensive aftercare and follow-up.",
    descriptionAr: "نستخدم مواد عالية الجودة وتقنيات مثبتة لضمان صمود عملك السني أمام اختبار الزمن. ندعم عملنا برعاية شاملة ومتابعة."
  }
];

export function BenefitsSection() {
  const { language } = useLanguage();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.number}
              className={`py-16 ${index !== benefits.length - 1 ? 'border-b border-gray-100' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <span className="text-primary text-sm font-medium tracking-wider">
                {benefit.number}
              </span>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                {language === 'ar' ? benefit.titleAr : benefit.titleEn}
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {language === 'ar' ? benefit.descriptionAr : benefit.descriptionEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
