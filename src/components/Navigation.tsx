import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  href: string;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ setActive, active, item, href, children }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.a
        href={href}
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-foreground/80 hover:text-gold font-medium transition-colors duration-300 relative group"
      >
        {item}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-300" />
      </motion.a>
      {active !== null && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1rem)] left-1/2 transform -translate-x-1/2 pt-2">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-card/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-gold/20 shadow-xl shadow-gold/10"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

interface NavMenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}

const NavMenu: React.FC<NavMenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex items-center space-x-8"
    >
      {children}
    </nav>
  );
};

const HoveredLink: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => {
  return (
    <a 
      href={href} 
      className="block text-muted-foreground hover:text-gold transition-colors duration-200 py-1"
    >
      {children}
    </a>
  );
};

export const Navigation = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isAdmin } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative w-full">
      <div className="fixed top-6 inset-x-0 max-w-5xl mx-auto z-50 px-4">
        <motion.div 
          className="relative flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-xl rounded-full border border-gold/20 shadow-2xl shadow-primary/10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 via-primary/10 to-gold/20 -z-10 blur-sm" />
          
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <defs>
                  <linearGradient id="tooth-gradient-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(175, 85%, 25%)" />
                  </linearGradient>
                  <linearGradient id="tooth-shine-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="hsl(42, 90%, 95%)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="hsl(42, 80%, 85%)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="gold-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--gold))" />
                    <stop offset="50%" stopColor="hsl(var(--gold-light))" />
                    <stop offset="100%" stopColor="hsl(var(--gold))" />
                  </linearGradient>
                  <filter id="tooth-shadow-nav" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(var(--gold))" floodOpacity="0.3"/>
                  </filter>
                </defs>
                {/* Gold ring */}
                <circle cx="24" cy="24" r="23" fill="none" stroke="url(#gold-ring)" strokeWidth="1.5" opacity="0.6" />
                {/* Background circle */}
                <circle cx="24" cy="24" r="20" fill="url(#tooth-gradient-nav)" filter="url(#tooth-shadow-nav)" />
                {/* Stylized tooth */}
                <path
                  d="M24 10 C18 10 14 14 14 19 C14 24 16 26 17 30 C18 34 18 38 19 38 C20 38 21 34 22 30 C22.5 28 23.5 28 24 28 C24.5 28 25.5 28 26 30 C27 34 28 38 29 38 C30 38 30 34 31 30 C32 26 34 24 34 19 C34 14 30 10 24 10 Z"
                  fill="url(#tooth-shine-nav)"
                  stroke="hsl(var(--gold-light))"
                  strokeWidth="0.5"
                />
                {/* Tooth shine highlight */}
                <ellipse cx="20" cy="16" rx="3" ry="4" fill="white" opacity="0.5" />
                {/* Gold sparkle */}
                <circle cx="30" cy="13" r="1.5" fill="hsl(var(--gold))" opacity="0.8" />
                <path d="M30 11 L30 15 M28 13 L32 13" stroke="hsl(var(--gold-light))" strokeWidth="0.8" opacity="0.7" strokeLinecap="round" />
              </svg>
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent">
                {language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German'}
              </span>
              <span className="text-[10px] text-gold/70 font-medium tracking-widest uppercase">
                Premium Dental Care
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavMenu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item={t("home")} href="#home" />
              <MenuItem setActive={setActive} active={active} item={t("about")} href="#about" />
              <MenuItem setActive={setActive} active={active} item={t("services")} href="#services" />
              <MenuItem setActive={setActive} active={active} item={t("booking")} href="#booking" />
              <MenuItem setActive={setActive} active={active} item={t("contact")} href="#contact" />
            </NavMenu>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-full hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 font-medium text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </motion.div>
            )}
            
            <motion.button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-card rounded-full border border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4 text-gold" />
              <span className="text-sm text-foreground font-medium">
                {language === 'en' ? 'العربية' : 'EN'}
              </span>
            </motion.button>

            <motion.a
              href="#booking"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm rounded-full font-semibold overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Gold gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold" />
              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Sparkles className="w-4 h-4 relative z-10 text-primary-foreground" />
              <span className="relative z-10 text-primary-foreground">
                {language === 'en' ? 'Book Now' : 'احجز الآن'}
              </span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden flex items-center p-2 rounded-full border border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-6 w-6 text-gold" />
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-background via-background to-primary/5 z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            
            <motion.button
              className="absolute top-6 right-6 p-3 bg-card rounded-full border border-gold/20 hover:border-gold/40 transition-all"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gold" />
            </motion.button>

            <div className="flex flex-col space-y-6">
              {[
                { key: "home", href: "#home" },
                { key: "about", href: "#about" },
                { key: "services", href: "#services" },
                { key: "booking", href: "#booking" },
                { key: "contact", href: "#contact" },
              ].map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <a
                    href={item.href}
                    className="text-xl text-foreground font-medium hover:text-gold transition-colors relative group inline-block"
                    onClick={toggleMenu}
                  >
                    {t(item.key)}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-gold-light group-hover:w-full transition-all duration-300" />
                  </a>
                </motion.div>
              ))}

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-xl text-gold font-medium"
                    onClick={toggleMenu}
                  >
                    <Shield className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4 border-t border-gold/20"
              >
                <button 
                  onClick={() => {
                    toggleLanguage();
                    toggleMenu();
                  }}
                  className="flex items-center gap-3 text-lg group"
                >
                  <Globe className="w-5 h-5 text-gold" />
                  <span className="text-foreground font-medium group-hover:text-gold transition-colors">
                    {language === 'en' ? 'العربية' : 'English'}
                  </span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-4"
              >
                <a
                  href="#booking"
                  className="relative inline-flex items-center justify-center w-full gap-2 px-6 py-4 text-lg rounded-full font-semibold overflow-hidden group"
                  onClick={toggleMenu}
                >
                  {/* Gold gradient background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold" />
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Sparkles className="w-5 h-5 relative z-10 text-primary-foreground" />
                  <span className="relative z-10 text-primary-foreground">
                    {language === 'en' ? 'Book Appointment' : 'احجز موعد'}
                  </span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
