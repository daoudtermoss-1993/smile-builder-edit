import { useState } from "react";
import { Menu, X, Globe, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin } = useAuth();

  const navLinks = [
    { href: "#home", key: "home" },
    { href: "#about", key: "about" },
    { href: "#services", key: "services" },
    { href: "#booking", key: "booking" },
    { href: "#contact", key: "contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#home" className="flex items-center gap-3">
              <div className="relative w-32 h-12 animate-fade-in">
                <img 
                  src={logo} 
                  alt="Dr. Yousif German" 
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(54%) sepia(89%) saturate(2718%) hue-rotate(145deg) brightness(91%) contrast(101%)'
                  }}
                />
              </div>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {t(link.key)}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border hover:bg-muted transition-colors"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t(link.key)}
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 py-2 text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <button 
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 py-2 mt-2"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
