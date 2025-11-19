import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Booking } from "@/components/Booking";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImage from "@/assets/hero-dental.jpg";
import doctorImage from "@/assets/doctor-portrait.jpg";

const Index = () => {
  useScrollAnimation();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
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
      
      <div id="booking">
        <Booking />
      </div>
      
      <div id="contact">
        <Contact
          address="Kuwait City, Kuwait"
          phone="+965 XXXX XXXX"
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
