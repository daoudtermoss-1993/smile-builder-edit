import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    services: 'Services',
    booking: 'Booking',
    contact: 'Contact',
    
    // Hero
    dentist: 'Dentist',
    heroTitle: 'Dr. Yousif German',
    heroSubtitle: 'Advanced dental care with precision and comfort.',
    bookAppointment: 'Book Appointment',
    contactClinic: 'Contact Clinic',
    
    // About
    aboutTitle: 'About Dr. Yousif German',
    aboutDescription: 'With years of experience in advanced dentistry, Dr. Yousif German provides comprehensive dental care using the latest technology and techniques. Our clinic in Kuwait is equipped with state-of-the-art facilities to ensure your comfort and safety.',
    yearsExperience: 'Years Experience',
    happyPatients: 'Happy Patients',
    successfulTreatments: 'Successful Treatments',
    
    // Services
    servicesTitle: 'Our Services',
    servicesSubtitle: 'Comprehensive dental care for all your needs',
    
    // Booking
    bookingTitle: 'Book Your Appointment',
    bookingSubtitle: 'Schedule your visit with Dr. Yousif German',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Email Address',
    service: 'Select Service',
    selectService: 'Choose a service',
    date: 'Preferred Date',
    time: 'Preferred Time',
    notes: 'Additional Notes',
    submit: 'Book Appointment',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'Get in touch with our clinic',
    address: 'Address',
    hours: 'Working Hours',
    followUs: 'Follow Us',
    callAIAssistant: 'Call AI Assistant',
    speakWithAI: 'Speak with our AI assistant 24/7',
    voiceConnected: 'Voice assistant connected',
    voiceError: 'Voice assistant error: ',
    appointmentBooked: 'Appointment booked successfully!',
    configureAgentFirst: 'Please configure your ElevenLabs Agent ID first',
    failedToStart: 'Failed to start conversation',
    
    // Before/After Gallery
    beforeAfterTitle: 'Transforming Smiles',
    beforeAfterSubtitle: 'See the incredible results our patients have achieved with our advanced dental treatments',
    teethWhitening: 'Teeth Whitening',
    teethWhiteningDesc: 'Professional whitening for a brighter smile',
    dentalImplants: 'Dental Implants',
    dentalImplantsDesc: 'Natural-looking permanent tooth replacement',
    veneers: 'Porcelain Veneers',
    veneersDesc: 'Custom veneers for a perfect smile',
    patientTestimonials: 'What Our Patients Say',
    testimonial1Name: 'Sarah Al-Ahmed',
    testimonial1Text: 'Dr. German completely transformed my smile with teeth whitening. The results exceeded my expectations and the process was completely painless. I can\'t stop smiling now!',
    testimonial2Name: 'Mohammed Al-Rashid',
    testimonial2Text: 'After years of missing teeth, Dr. German gave me my confidence back with dental implants. The procedure was smooth and the results look completely natural. Highly recommended!',
    testimonial3Name: 'Fatima Al-Sabah',
    testimonial3Text: 'The porcelain veneers I got from Dr. German have changed my life. My smile looks amazing and everyone asks me what I did. Professional service from start to finish!',
    configureVoice: 'Configure Voice Assistant',
    enterAgentId: 'Enter your ElevenLabs Agent ID. You can create one at',
    save: 'Save',
    cancel: 'Cancel',
    agentIdSaved: 'Agent ID saved!',
    agentIdReset: 'Agent ID reset successfully',
    changeAgentId: 'Change ID',
    drYousifAssistant: 'Dr. Yousif Voice Assistant',
    listening: 'Listening...',
    speakNow: 'Speak now',
    clickToStart: 'Click to start voice consultation',
    connecting: 'Connecting...',
    startCall: 'Start Call',
    endCall: 'End Call',
    available247: 'Available 24/7 for consultations, appointments, and emergencies',
    
    // Footer
    footerDescription: 'Advanced dental care with precision and comfort in Kuwait.',
    quickLinks: 'Quick Links',
    allRightsReserved: 'All rights reserved.',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'عن الدكتور',
    services: 'الخدمات',
    booking: 'حجز موعد',
    contact: 'اتصل بنا',
    
    // Hero
    dentist: 'طبيب أسنان',
    heroTitle: 'د. يوسف جيرمان',
    heroSubtitle: 'رعاية أسنان متقدمة بدقة وراحة.',
    bookAppointment: 'احجز موعد',
    contactClinic: 'اتصل بالعيادة',
    
    // About
    aboutTitle: 'عن د. يوسف جيرمان',
    aboutDescription: 'مع سنوات من الخبرة في طب الأسنان المتقدم، يوفر د. يوسف جيرمان رعاية شاملة للأسنان باستخدام أحدث التقنيات. عيادتنا في الكويت مجهزة بأحدث المرافق لضمان راحتك وسلامتك.',
    yearsExperience: 'سنوات خبرة',
    happyPatients: 'مرضى سعداء',
    successfulTreatments: 'علاجات ناجحة',
    
    // Services
    servicesTitle: 'خدماتنا',
    servicesSubtitle: 'رعاية أسنان شاملة لجميع احتياجاتك',
    
    // Booking
    bookingTitle: 'احجز موعدك',
    bookingSubtitle: 'حدد موعد زيارتك مع د. يوسف جيرمان',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    service: 'اختر الخدمة',
    selectService: 'اختر خدمة',
    date: 'التاريخ المفضل',
    time: 'الوقت المفضل',
    notes: 'ملاحظات إضافية',
    submit: 'احجز موعد',
    
    // Contact
    contactTitle: 'اتصل بنا',
    contactSubtitle: 'تواصل مع عيادتنا',
    address: 'العنوان',
    hours: 'ساعات العمل',
    followUs: 'تابعنا',
    callAIAssistant: 'اتصل بالمساعد الذكي',
    speakWithAI: 'تحدث مع مساعدنا الذكي على مدار الساعة',
    voiceConnected: 'تم الاتصال بالمساعد الصوتي',
    voiceError: 'خطأ في المساعد الصوتي: ',
    appointmentBooked: 'تم حجز الموعد بنجاح!',
    configureAgentFirst: 'يرجى تكوين معرف الوكيل أولاً',
    failedToStart: 'فشل بدء المحادثة',
    
    // Before/After Gallery
    beforeAfterTitle: 'تحويل الابتسامات',
    beforeAfterSubtitle: 'شاهد النتائج المذهلة التي حققها مرضانا من خلال علاجاتنا السنية المتقدمة',
    teethWhitening: 'تبييض الأسنان',
    teethWhiteningDesc: 'تبييض احترافي لابتسامة أكثر إشراقاً',
    dentalImplants: 'زراعة الأسنان',
    dentalImplantsDesc: 'استبدال الأسنان الدائم بمظهر طبيعي',
    veneers: 'عدسات الأسنان',
    veneersDesc: 'عدسات مخصصة لابتسامة مثالية',
    patientTestimonials: 'آراء مرضانا',
    testimonial1Name: 'سارة الأحمد',
    testimonial1Text: 'د. يوسف حول ابتسامتي تماماً بتبييض الأسنان. النتائج فاقت توقعاتي والعملية كانت غير مؤلمة تماماً. لا أستطيع التوقف عن الابتسام الآن!',
    testimonial2Name: 'محمد الراشد',
    testimonial2Text: 'بعد سنوات من فقدان الأسنان، أعاد لي د. يوسف ثقتي بنفسي من خلال زراعة الأسنان. كانت العملية سلسة والنتائج تبدو طبيعية تماماً. أنصح به بشدة!',
    testimonial3Name: 'فاطمة الصباح',
    testimonial3Text: 'عدسات الأسنان التي حصلت عليها من د. يوسف غيرت حياتي. ابتسامتي تبدو رائعة والجميع يسألني عما فعلت. خدمة احترافية من البداية إلى النهاية!',
    configureVoice: 'تكوين المساعد الصوتي',
    enterAgentId: 'أدخل معرف وكيل ElevenLabs. يمكنك إنشاء واحد في',
    save: 'حفظ',
    cancel: 'إلغاء',
    agentIdSaved: 'تم حفظ معرف الوكيل!',
    agentIdReset: 'تمت إعادة تعيين معرف الوكيل بنجاح',
    changeAgentId: 'تغيير المعرف',
    drYousifAssistant: 'المساعد الصوتي للدكتور يوسف',
    listening: 'جاري الاستماع...',
    speakNow: 'تحدث الآن',
    clickToStart: 'انقر لبدء الاستشارة الصوتية',
    connecting: 'جاري الاتصال...',
    startCall: 'بدء المكالمة',
    endCall: 'إنهاء المكالمة',
    available247: 'متاح على مدار الساعة للاستشارات والمواعيد والطوارئ',
    
    // Footer
    footerDescription: 'رعاية أسنان متقدمة بدقة وراحة في الكويت.',
    quickLinks: 'روابط سريعة',
    allRightsReserved: 'جميع الحقوق محفوظة.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
