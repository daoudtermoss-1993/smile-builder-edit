import { Smile, Sparkles, Braces, Activity, Shield, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";

const servicesData = [
  {
    icon: Smile,
    titleEn: "Dental Implants",
    titleAr: "زراعة الأسنان",
    descriptionEn: "Permanent tooth replacement solutions with natural-looking results",
    descriptionAr: "حلول دائمة لاستبدال الأسنان بنتائج طبيعية المظهر"
  },
  {
    icon: Sparkles,
    titleEn: "Cosmetic Dentistry",
    titleAr: "طب الأسنان التجميلي",
    descriptionEn: "Veneers, whitening, and Hollywood smile transformations",
    descriptionAr: "الفينير والتبييض وتحويلات ابتسامة هوليوود"
  },
  {
    icon: Braces,
    titleEn: "Orthodontics",
    titleAr: "تقويم الأسنان",
    descriptionEn: "Braces and aligners for perfect smile alignment",
    descriptionAr: "التقويم والمحاذيات للحصول على ابتسامة مثالية"
  },
  {
    icon: Activity,
    titleEn: "Root Canal Treatment",
    titleAr: "علاج قناة الجذر",
    descriptionEn: "Pain-free root canal procedures with advanced techniques",
    descriptionAr: "إجراءات علاج قناة الجذر بدون ألم بتقنيات متقدمة"
  },
  {
    icon: Shield,
    titleEn: "Cleaning & Check-ups",
    titleAr: "التنظيف والفحوصات",
    descriptionEn: "Regular maintenance and preventive care",
    descriptionAr: "الصيانة الدورية والرعاية الوقائية"
  },
  {
    icon: AlertCircle,
    titleEn: "Emergency Care",
    titleAr: "رعاية الطوارئ",
    descriptionEn: "24/7 emergency dental services",
    descriptionAr: "خدمات طوارئ الأسنان على مدار الساعة"
  }
];

export const Services = () => {
  const { language, t } = useLanguage();
  
  return (
    <section className="vibe-section py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30 mb-6">
            <EditableText 
              sectionKey="services" 
              field="badge" 
              defaultValue={t('servicesTitle')}
              className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">
            <EditableText 
              sectionKey="services" 
              field="title" 
              defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Dental Care'}
              as="span"
            />
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            <EditableText 
              sectionKey="services" 
              field="subtitle" 
              defaultValue={language === 'ar' 
                ? 'نقدم مجموعة واسعة من خدمات طب الأسنان لتلبية جميع احتياجات صحة فمك'
                : 'We offer a wide range of dental services to meet all your oral health needs'}
              as="span"
            />
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="vibe-card">
                <div className="w-12 h-12 rounded-xl bg-gradient-vibe flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                  {language === 'ar' ? service.titleAr : service.titleEn}
                </h3>
                <p className="text-foreground/70">
                  {language === 'ar' ? service.descriptionAr : service.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};