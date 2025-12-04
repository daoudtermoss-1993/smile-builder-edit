import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Booking } from "@/components/Booking";
import { ContactMap } from "@/components/ContactMap";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import AdminAccessButton from "@/components/AdminAccessButton";
import { AdminEditToggle } from "@/components/admin/AdminEditToggle";
import { AdminEditConfirmDialog } from "@/components/admin/AdminEditConfirmDialog";
import heroImage from "@/assets/dr-yousif-hero.jpg";
import doctorImage from "@/assets/dr-yousif-hero.jpg";

const Index = () => {
  useScrollAnimation();
  useVisitorTracking();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <AdminAccessButton />
      <AdminEditToggle />
      <AdminEditConfirmDialog />
      
      <div id="home">
        <Hero
          backgroundImage={heroImage}
          title="Dr. Yousif German"
          subtitle="Advanced dental care with precision and comfort."
          badge="Dentist"
        />
      </div>
      
      <div id="about">
        <About
          doctorImage={doctorImage}
          doctorName="Dr. Yousif German"
          description="With years of experience in advanced dentistry, Dr. Yousif German provides comprehensive dental care using the latest technology and techniques. Our clinic in Kuwait is equipped with state-of-the-art facilities to ensure your comfort and safety."
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
