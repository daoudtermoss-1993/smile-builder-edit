import { useState } from "react";
import { Menu, X, Globe, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

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
        <div className="flex items-center justify-between h-36">
          <div className="flex items-center">
            <a href="#home" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,179,179,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(0,179,179,0.5)] transition-all duration-300 group-hover:scale-105 animate-fade-in">
                Dr. Yousif German
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              >
                <span className="relative z-10">{t(link.key)}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full" />
                <span className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </a>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium group"
              >
                <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Admin
              </Link>
            )}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border hover:bg-muted hover:border-primary/30 hover:scale-105 transition-all duration-300 group"
            >
              <Globe className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
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
