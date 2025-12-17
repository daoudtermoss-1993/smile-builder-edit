import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { key: "home", href: "#home", label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { key: "about", href: "#about", label: language === 'ar' ? 'عنّا' : 'About' },
    { key: "services", href: "#services", label: language === 'ar' ? 'الخدمات' : 'Services' },
    { key: "booking", href: "#booking", label: language === 'ar' ? 'الحجز' : 'Booking' },
    { key: "contact", href: "#contact", label: language === 'ar' ? 'تواصل' : 'Contact' },
  ];

  return (
    <div className="relative w-full">
      {/* Desktop Navigation - Mont-fort style minimal */}
      <motion.nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-8'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo - Minimal text */}
            <motion.a
              href="#home"
              className="group relative"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-lg md:text-xl font-light tracking-[0.3em] text-slate-700 uppercase">
                {language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. German'}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.a>

            {/* Desktop Links - Ultra minimal */}
            <div className="hidden md:flex items-center gap-12">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  className="group relative text-sm font-light tracking-[0.15em] text-slate-500 uppercase hover:text-slate-900 transition-colors duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-6">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-light tracking-[0.1em] text-primary uppercase hover:text-primary/80 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
              
              <motion.button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm font-light tracking-[0.1em] text-slate-500 uppercase hover:text-slate-900 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'العربية' : 'EN'}
              </motion.button>

              <motion.a
                href="#booking"
                className="group relative px-6 py-3 text-sm font-light tracking-[0.15em] text-slate-700 uppercase border border-slate-300 hover:border-primary hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {language === 'en' ? 'Book' : 'احجز'}
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex items-center p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center md:hidden"
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              className="absolute top-8 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6 text-slate-700" />
            </motion.button>

            <div className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.key}
                  href={item.href}
                  className="text-2xl font-light tracking-[0.2em] text-slate-700 uppercase hover:text-primary transition-colors"
                  onClick={toggleMenu}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  {item.label}
                </motion.a>
              ))}

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-xl text-primary font-light tracking-[0.2em] uppercase"
                    onClick={toggleMenu}
                  >
                    <Shield className="w-5 h-5" />
                    Admin
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-8 flex items-center gap-4"
              >
                <button 
                  onClick={() => {
                    toggleLanguage();
                    toggleMenu();
                  }}
                  className="flex items-center gap-3 text-lg font-light tracking-[0.15em] text-slate-500 uppercase"
                >
                  <Globe className="w-5 h-5" />
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
              </motion.div>

              <motion.a
                href="#booking"
                className="mt-8 px-10 py-4 text-lg font-light tracking-[0.2em] text-white uppercase bg-primary hover:bg-primary/90 transition-colors"
                onClick={toggleMenu}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {language === 'en' ? 'Book Now' : 'احجز الآن'}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};