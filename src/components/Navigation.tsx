import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#booking", label: "Booking" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-vibe rounded-full flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">YG</span>
              </div>
              <span className="font-display font-bold text-xl bg-gradient-vibe bg-clip-text text-transparent">Dr. Yousif German</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-vibe-purple transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-vibe after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30">
              <span className="text-sm">🇰🇼</span>
              <span className="text-sm text-foreground">العربية</span>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center text-foreground hover:text-vibe-purple transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-foreground hover:text-vibe-purple transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm">🇰🇼</span>
              <span className="text-sm text-foreground">العربية</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
