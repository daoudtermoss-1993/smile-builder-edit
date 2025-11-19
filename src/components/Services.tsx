import { Smile, Sparkles, Braces, Activity, Shield, AlertCircle } from "lucide-react";

const services = [
  {
    icon: Smile,
    title: "Dental Implants",
    description: "Permanent tooth replacement solutions with natural-looking results"
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    description: "Veneers, whitening, and Hollywood smile transformations"
  },
  {
    icon: Braces,
    title: "Orthodontics",
    description: "Braces and aligners for perfect smile alignment"
  },
  {
    icon: Activity,
    title: "Root Canal Treatment",
    description: "Pain-free root canal procedures with advanced techniques"
  },
  {
    icon: Shield,
    title: "Cleaning & Check-ups",
    description: "Regular maintenance and preventive care"
  },
  {
    icon: AlertCircle,
    title: "Emergency Care",
    description: "24/7 emergency dental services"
  }
];

export const Services = () => {
  return (
    <section className="vibe-section py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30 mb-6">
            <span className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">
            Comprehensive Dental Care
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            We offer a wide range of dental services to meet all your oral health needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="vibe-card">
                <div className="w-12 h-12 rounded-xl bg-gradient-vibe flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">{service.title}</h3>
                <p className="text-foreground/70">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
