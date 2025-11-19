import { Instagram, Facebook, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Dr. Yousif German</h3>
            <p className="text-background/80">
              Advanced dental care with precision and comfort in Kuwait.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-background/80 hover:text-background transition-colors">About</a></li>
              <li><a href="#services" className="text-background/80 hover:text-background transition-colors">Services</a></li>
              <li><a href="#booking" className="text-background/80 hover:text-background transition-colors">Booking</a></li>
              <li><a href="#contact" className="text-background/80 hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/dr_german?igsh=MXE0NHU4bWdpYWlkNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>&copy; 2024 Dr. Yousif German. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
