import { Smile, Sparkles, Braces, Activity, Shield, AlertCircle, LucideIcon } from "lucide-react";

export interface ServiceDetail {
  id: string;
  icon: LucideIcon;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  fullDescriptionEn: string;
  fullDescriptionAr: string;
  priceRange: string;
  duration: string;
  durationAr: string;
  benefits: { en: string; ar: string }[];
  beforeAfterImages: {
    before: string;
    after: string;
    captionEn: string;
    captionAr: string;
  }[];
  image: string;
}

export const servicesData: ServiceDetail[] = [
  {
    id: "dental-implants",
    icon: Smile,
    titleEn: "Dental Implants",
    titleAr: "زراعة الأسنان",
    descriptionEn: "Permanent tooth replacement solutions with natural-looking results",
    descriptionAr: "حلول دائمة لاستبدال الأسنان بنتائج طبيعية المظهر",
    fullDescriptionEn: "Dental implants are the gold standard for replacing missing teeth. Our advanced implant procedures use titanium posts that fuse with your jawbone, creating a strong foundation for custom-made crowns that look, feel, and function like natural teeth. Dr. Yousif German uses state-of-the-art 3D imaging and guided surgery techniques for precise placement and optimal results.",
    fullDescriptionAr: "زراعة الأسنان هي المعيار الذهبي لاستبدال الأسنان المفقودة. تستخدم إجراءات الزراعة المتقدمة لدينا أعمدة التيتانيوم التي تندمج مع عظم الفك، مما يخلق أساسًا قويًا للتيجان المصنوعة خصيصًا والتي تبدو وتشعر وتعمل مثل الأسنان الطبيعية.",
    priceRange: "800 - 2,500 KWD",
    duration: "3-6 months",
    durationAr: "3-6 أشهر",
    benefits: [
      { en: "Permanent solution that lasts a lifetime", ar: "حل دائم يدوم مدى الحياة" },
      { en: "Preserves jawbone and facial structure", ar: "يحافظ على عظم الفك وبنية الوجه" },
      { en: "No damage to adjacent teeth", ar: "لا ضرر للأسنان المجاورة" },
      { en: "Natural look and feel", ar: "مظهر وشعور طبيعي" }
    ],
    beforeAfterImages: [
      {
        before: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
        after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
        captionEn: "Single tooth implant replacement",
        captionAr: "استبدال سن واحد بالزراعة"
      }
    ],
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "cosmetic-dentistry",
    icon: Sparkles,
    titleEn: "Cosmetic Dentistry",
    titleAr: "طب الأسنان التجميلي",
    descriptionEn: "Veneers, whitening, and Hollywood smile transformations",
    descriptionAr: "الفينير والتبييض وتحويلات ابتسامة هوليوود",
    fullDescriptionEn: "Transform your smile with our comprehensive cosmetic dentistry services. From professional teeth whitening to porcelain veneers and complete Hollywood smile makeovers, we use the latest techniques and materials to create stunning, natural-looking results. Our digital smile design technology allows you to preview your new smile before treatment begins.",
    fullDescriptionAr: "حوّل ابتسامتك مع خدمات طب الأسنان التجميلي الشاملة لدينا. من تبييض الأسنان الاحترافي إلى قشور البورسلين وتحولات ابتسامة هوليوود الكاملة، نستخدم أحدث التقنيات والمواد لإنشاء نتائج مذهلة وطبيعية المظهر.",
    priceRange: "200 - 3,000 KWD",
    duration: "1-4 weeks",
    durationAr: "1-4 أسابيع",
    benefits: [
      { en: "Instant confidence boost", ar: "تعزيز فوري للثقة" },
      { en: "Custom-designed for your face", ar: "مصمم خصيصًا لوجهك" },
      { en: "Long-lasting results", ar: "نتائج طويلة الأمد" },
      { en: "Minimally invasive options available", ar: "خيارات طفيفة التوغل متاحة" }
    ],
    beforeAfterImages: [
      {
        before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
        after: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
        captionEn: "Complete Hollywood smile transformation",
        captionAr: "تحول كامل لابتسامة هوليوود"
      }
    ],
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "orthodontics",
    icon: Braces,
    titleEn: "Orthodontics",
    titleAr: "تقويم الأسنان",
    descriptionEn: "Braces and aligners for perfect smile alignment",
    descriptionAr: "التقويم والمحاذيات للحصول على ابتسامة مثالية",
    fullDescriptionEn: "Achieve the perfectly aligned smile you've always wanted with our orthodontic treatments. We offer traditional braces, ceramic braces, and clear aligners like Invisalign. Our treatment plans are customized using 3D scanning technology to ensure precise, predictable results with maximum comfort.",
    fullDescriptionAr: "احصل على الابتسامة المتناسقة تمامًا التي طالما أردتها مع علاجات تقويم الأسنان لدينا. نقدم التقويم التقليدي والتقويم الخزفي والمحاذيات الشفافة مثل إنفزلاين.",
    priceRange: "500 - 2,000 KWD",
    duration: "6-24 months",
    durationAr: "6-24 شهر",
    benefits: [
      { en: "Corrects bite problems", ar: "يصحح مشاكل العضة" },
      { en: "Improves oral health", ar: "يحسن صحة الفم" },
      { en: "Clear aligner options available", ar: "خيارات المحاذيات الشفافة متاحة" },
      { en: "Suitable for all ages", ar: "مناسب لجميع الأعمار" }
    ],
    beforeAfterImages: [
      {
        before: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400",
        after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400",
        captionEn: "Teeth alignment with clear aligners",
        captionAr: "محاذاة الأسنان بالمحاذيات الشفافة"
      }
    ],
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "root-canal",
    icon: Activity,
    titleEn: "Root Canal Treatment",
    titleAr: "علاج قناة الجذر",
    descriptionEn: "Pain-free root canal procedures with advanced techniques",
    descriptionAr: "إجراءات علاج قناة الجذر بدون ألم بتقنيات متقدمة",
    fullDescriptionEn: "Our advanced root canal treatments save teeth that would otherwise need to be extracted. Using modern rotary instruments and apex locators, we ensure thorough cleaning and shaping of the root canal system. With our gentle techniques and effective anesthesia, most patients experience little to no discomfort.",
    fullDescriptionAr: "تنقذ علاجات قناة الجذر المتقدمة لدينا الأسنان التي كانت ستحتاج إلى الخلع. باستخدام الأدوات الدوارة الحديثة ومحددات القمة، نضمن التنظيف والتشكيل الشامل لنظام قناة الجذر.",
    priceRange: "150 - 400 KWD",
    duration: "1-2 visits",
    durationAr: "1-2 زيارة",
    benefits: [
      { en: "Saves natural teeth", ar: "ينقذ الأسنان الطبيعية" },
      { en: "Virtually pain-free procedure", ar: "إجراء خالٍ من الألم تقريبًا" },
      { en: "Prevents infection spread", ar: "يمنع انتشار العدوى" },
      { en: "Quick recovery time", ar: "وقت تعافي سريع" }
    ],
    beforeAfterImages: [],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "cleaning-checkups",
    icon: Shield,
    titleEn: "Cleaning & Check-ups",
    titleAr: "التنظيف والفحوصات",
    descriptionEn: "Regular maintenance and preventive care",
    descriptionAr: "الصيانة الدورية والرعاية الوقائية",
    fullDescriptionEn: "Prevention is the best medicine. Our comprehensive dental check-ups include thorough cleaning, digital X-rays, oral cancer screening, and personalized hygiene recommendations. Regular visits help catch problems early when they're easier and less expensive to treat.",
    fullDescriptionAr: "الوقاية خير من العلاج. تشمل فحوصاتنا الشاملة للأسنان التنظيف الشامل والأشعة السينية الرقمية وفحص سرطان الفم وتوصيات النظافة الشخصية.",
    priceRange: "30 - 80 KWD",
    duration: "30-60 minutes",
    durationAr: "30-60 دقيقة",
    benefits: [
      { en: "Early problem detection", ar: "الكشف المبكر عن المشاكل" },
      { en: "Prevents gum disease", ar: "يمنع أمراض اللثة" },
      { en: "Fresher breath", ar: "نفس أنقى" },
      { en: "Brighter smile", ar: "ابتسامة أكثر إشراقًا" }
    ],
    beforeAfterImages: [],
    image: "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "emergency-care",
    icon: AlertCircle,
    titleEn: "Emergency Care",
    titleAr: "رعاية الطوارئ",
    descriptionEn: "24/7 emergency dental services",
    descriptionAr: "خدمات طوارئ الأسنان على مدار الساعة",
    fullDescriptionEn: "Dental emergencies don't wait for convenient hours. Our emergency dental services are available around the clock to handle severe tooth pain, knocked-out teeth, broken restorations, and other urgent dental issues. We prioritize emergency patients to provide rapid relief and treatment.",
    fullDescriptionAr: "حالات الطوارئ لا تنتظر ساعات مناسبة. خدمات طوارئ الأسنان لدينا متاحة على مدار الساعة للتعامل مع آلام الأسنان الشديدة والأسنان المخلوعة والترميمات المكسورة وغيرها من مشاكل الأسنان العاجلة.",
    priceRange: "50 - 300 KWD",
    duration: "Same day",
    durationAr: "نفس اليوم",
    benefits: [
      { en: "24/7 availability", ar: "متاح على مدار الساعة" },
      { en: "Rapid pain relief", ar: "تخفيف سريع للألم" },
      { en: "Same-day appointments", ar: "مواعيد في نفس اليوم" },
      { en: "Expert emergency care", ar: "رعاية طوارئ متخصصة" }
    ],
    beforeAfterImages: [],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60"
  }
];

export const getServiceById = (id: string): ServiceDetail | undefined => {
  return servicesData.find(service => service.id === id);
};
