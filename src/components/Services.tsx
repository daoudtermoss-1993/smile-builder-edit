import { Smile, Sparkles, Braces, Activity, Shield, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Comprehensive dental care tailored to your needs</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Our Services</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-card"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
