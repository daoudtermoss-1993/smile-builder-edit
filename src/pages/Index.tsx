import { Navigation } from "@/components/Navigation";
import { Booking } from "@/components/Booking";
import { Chatbot } from "@/components/Chatbot";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import AdminAccessButton from "@/components/AdminAccessButton";
import { AdminEditToggle } from "@/components/admin/AdminEditToggle";
import { AdminEditConfirmDialog } from "@/components/admin/AdminEditConfirmDialog";
import { TerminalHero } from "@/components/hero/TerminalHero";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { YOSSection } from "@/components/sections/YOSSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { TerminalFooter } from "@/components/sections/TerminalFooter";

const Index = () => {
  useScrollAnimation();
  useVisitorTracking();
  
  return (
    <div className="min-h-screen relative bg-[hsl(175_25%_8%)]">
      <Navigation />
      <AdminAccessButton />
      <AdminEditToggle />
      <AdminEditConfirmDialog />
      
      {/* Terminal Style Hero */}
      <div id="home">
        <TerminalHero />
      </div>
      
      {/* Features Split Sections */}
      <div id="about">
        <FeaturesSection />
      </div>
      
      {/* YOS Stats Section */}
      <div id="services">
        <YOSSection />
      </div>
      
      {/* Benefits Section */}
      <div id="gallery">
        <BenefitsSection />
      </div>
      
      {/* Booking Section */}
      <div id="booking" className="bg-white py-24">
        <Booking />
      </div>
      
      {/* Contact Section */}
      <div id="contact">
        <ContactSection />
      </div>
      
      <TerminalFooter />
      <Chatbot />
    </div>
  );
};

export default Index;
