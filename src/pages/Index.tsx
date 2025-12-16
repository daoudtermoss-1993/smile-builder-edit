import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Booking } from "@/components/Booking";
import { ContactMap } from "@/components/ContactMap";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { ScrollDrivenObject } from "@/components/ScrollDrivenObject";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import AdminAccessButton from "@/components/AdminAccessButton";
import { AdminEditToggle } from "@/components/admin/AdminEditToggle";
import { AdminEditConfirmDialog } from "@/components/admin/AdminEditConfirmDialog";
import heroImage from "@/assets/dr-yousif-hero.jpg";
import doctorImage from "@/assets/dr-yousif-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();
  useScrollAnimation();
  useVisitorTracking();
  
  const doctorName = language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German';
  
  return (
    <div className="min-h-screen relative">
      {/* Global gradient background */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(180 60% 97%) 0%, 
              hsl(180 40% 98%) 15%,
              hsl(0 0% 100%) 30%,
              hsl(180 30% 98%) 50%,
              hsl(0 0% 100%) 70%,
              hsl(180 40% 97%) 85%,
              hsl(180 50% 96%) 100%
            )
          `
        }}
      />
      
      {/* Decorative gradient orbs - behind floating object */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/[0.02] blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/[0.02] blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/[0.015] blur-[150px] -z-10 pointer-events-none" />
      
      <Navigation />
      <ScrollDrivenObject />
      <AdminAccessButton />
      <AdminEditToggle />
      <AdminEditConfirmDialog />
      
      <div id="home">
        <Hero
          backgroundImage={heroImage}
          title={doctorName}
          subtitle={language === 'ar' ? 'رعاية أسنان متقدمة بدقة وراحة.' : 'Advanced dental care with precision and comfort.'}
          badge={language === 'ar' ? 'طبيب أسنان' : 'Dentist'}
        />
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
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
