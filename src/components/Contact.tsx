import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactProps {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export const Contact = ({ address, phone, email, hours }: ContactProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Get in touch with our clinic</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Contact Us</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-soft border border-border text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Clinic Address</h3>
            <p className="text-muted-foreground">{address}</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-soft border border-border text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Phone</h3>
            <p className="text-muted-foreground">{phone}</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-soft border border-border text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Email</h3>
            <p className="text-muted-foreground">{email}</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-soft border border-border text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Working Hours</h3>
            <p className="text-muted-foreground">{hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
