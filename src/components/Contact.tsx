import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactProps {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export const Contact = ({ address, phone, email, hours }: ContactProps) => {
  return (
    <section className="vibe-section py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30 mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent">Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">
            Contact Us
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <div className="vibe-card text-center p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-vibe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Clinic Address</h3>
            <p className="text-sm sm:text-base text-foreground/70">{address}</p>
          </div>
          
          <div className="vibe-card text-center p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-vibe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Phone</h3>
            <p className="text-sm sm:text-base text-foreground/70">{phone}</p>
          </div>
          
          <div className="vibe-card text-center p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-vibe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Email</h3>
            <p className="text-sm sm:text-base text-foreground/70 break-all">{email}</p>
          </div>
          
          <div className="vibe-card text-center p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-vibe rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Working Hours</h3>
            <p className="text-sm sm:text-base text-foreground/70">{hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
