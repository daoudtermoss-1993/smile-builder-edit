import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Booking } from "@/components/Booking";
import { ContactMap } from "@/components/ContactMap";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { DentalChair3D } from "@/components/hero/DentalChair3D";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import AdminAccessButton from "@/components/AdminAccessButton";
import { AdminEditToggle } from "@/components/admin/AdminEditToggle";
import { AdminEditConfirmDialog } from "@/components/admin/AdminEditConfirmDialog";
import doctorImage from "@/assets/dr-yousif-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
const Index = () => {
  const { language } = useLanguage();
  useScrollAnimation();
  useVisitorTracking();
  
  const doctorName = language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German';
  
  return (
    <div className="min-h-screen relative bg-background">
      <Navigation />
      <AdminAccessButton />
      <AdminEditToggle />
      <AdminEditConfirmDialog />
      
      {/* 3D Dental Chair Animation with Hero */}
      <div id="home">
        <DentalChair3D />
      </div>
      
      <div id="about">
        <About
          doctorImage={doctorImage}
          doctorName={doctorName}
          description={language === 'ar' 
            ? 'مع سنوات من الخبرة في طب الأسنان المتقدم، يوفر د. يوسف جيرمان رعاية شاملة للأسنان باستخدام أحدث التقنيات. عيادتنا في الكويت مجهزة بأحدث المرافق لضمان راحتك وسلامتك.'
            : 'With years of experience in advanced dentistry, Dr. Yousif German provides comprehensive dental care using the latest technology and techniques. Our clinic in Kuwait is equipped with state-of-the-art facilities to ensure your comfort and safety.'}
          stats={{
            years: "15+",
            patients: "5000+",
            treatments: "10000+"
          }}
        />
      </div>
      
      <div id="services">
        <Services />
      </div>
      
      <div id="gallery">
        <BeforeAfter />
      </div>
      
      <div id="booking">
        <Booking />
      </div>
      
      <div id="contact">
        <ContactMap
          address="Kuwait City, Kuwait"
          phone="+96561112299"
          email="info@dryousifgerman.com"
          hours="Sat-Thu: 9AM-8PM"
        />
      </div>
      
      <CTASection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
