import { Instagram, Facebook, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-xl border-t border-primary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">Dr. Yousif German</h3>
            <p className="text-foreground/70">
              Advanced dental care with precision and comfort in Kuwait.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-foreground/70 hover:text-vibe-purple transition-colors">About</a></li>
              <li><a href="#services" className="text-foreground/70 hover:text-vibe-purple transition-colors">Services</a></li>
              <li><a href="#booking" className="text-foreground/70 hover:text-vibe-purple transition-colors">Booking</a></li>
              <li><a href="#contact" className="text-foreground/70 hover:text-vibe-purple transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/dr_german?igsh=MXE0NHU4bWdpYWlkNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-vibe rounded-full flex items-center justify-center hover:shadow-glow transition-all hover:-translate-y-1"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#"
                className="w-10 h-10 bg-gradient-vibe rounded-full flex items-center justify-center hover:shadow-glow transition-all hover:-translate-y-1"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#"
                className="w-10 h-10 bg-gradient-vibe rounded-full flex items-center justify-center hover:shadow-glow transition-all hover:-translate-y-1"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary/20 pt-8 text-center text-foreground/60">
          <p>&copy; 2024 Dr. Yousif German. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
