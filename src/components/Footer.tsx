import { Instagram, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t, language } = useLanguage();
  const doctorName = language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German';
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { label: t('about'), href: '#about' },
    { label: t('services'), href: '#services' },
    { label: t('booking'), href: '#booking' },
    { label: t('contact'), href: '#contact' },
  ];

  const contactInfo = [
    { icon: Phone, value: '+965 6111 2299', href: 'tel:+96561112299' },
    { icon: Mail, value: 'info@dryousifgerman.com', href: 'mailto:info@dryousifgerman.com' },
    { icon: MapPin, value: language === 'ar' ? 'مدينة الكويت' : 'Kuwait City', href: '#contact' },
  ];
  
  return (
    <footer className="relative bg-terminal-dark border-t border-white/5 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-display font-bold mb-4">
                <span className="text-white">{language === 'ar' ? 'د. يوسف' : 'Dr. Yousif'}</span>
                <span className="text-gold ml-2">{language === 'ar' ? 'جيرمان' : 'German'}</span>
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {t('footerDescription')}
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3">
                <a 
                  href="https://www.instagram.com/dr_german?igsh=MXE0NHU4bWdpYWlkNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-gold/20 hover:border-gold/30 hover:scale-105 transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-white/70 group-hover:text-gold transition-colors" />
                </a>
                <a 
                  href="https://www.snapchat.com/@yousif_german"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-gold/20 hover:border-gold/30 hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.166 3c.796 0 2.723.191 3.836 2.075.608 1.029.52 2.413.449 3.546l-.003.05c-.014.226-.027.441-.027.64 0 .122.074.196.135.228.068.035.158.042.225.025.19-.05.4-.152.62-.262l.023-.011c.23-.114.468-.233.72-.29.148-.033.302-.05.452-.05.306 0 .615.069.894.204.559.27.871.75.871 1.348 0 .462-.212.91-.612 1.295-.45.434-.993.742-1.613 1.016a6.55 6.55 0 01-.535.208c-.096.033-.233.09-.256.15-.03.078.022.226.112.42l.02.04c.406.813.965 1.463 1.661 1.932.58.391 1.275.66 2.066.798.205.036.354.189.386.329.045.195-.033.435-.398.653-.431.257-1.066.437-1.887.536a2.36 2.36 0 01-.085.016c-.025.049-.058.15-.083.224l-.006.017a2.56 2.56 0 01-.219.461c-.186.297-.47.448-.845.448-.17 0-.35-.027-.549-.082-.29-.082-.602-.122-.951-.122-.188 0-.381.014-.575.041a3.77 3.77 0 00-.716.166c-.423.143-.822.384-1.291.677-.716.447-1.528.953-2.698.953-1.144 0-1.945-.494-2.655-.937-.479-.3-.892-.558-1.334-.707a3.996 3.996 0 00-.708-.162 4.345 4.345 0 00-.548-.04c-.368 0-.696.046-1.003.135-.184.053-.352.08-.511.08-.454 0-.726-.219-.874-.448a2.07 2.07 0 01-.195-.415l-.017-.053c-.031-.094-.068-.205-.1-.261a.85.85 0 00-.072-.014c-.821-.1-1.455-.28-1.886-.536-.365-.218-.443-.458-.398-.653.032-.14.18-.293.386-.329.79-.139 1.486-.407 2.066-.798.695-.469 1.254-1.119 1.66-1.932l.02-.04c.09-.194.142-.342.113-.42-.024-.06-.16-.117-.257-.15a6.55 6.55 0 01-.534-.208c-.62-.274-1.163-.582-1.613-1.016-.4-.385-.612-.833-.612-1.295 0-.598.312-1.077.871-1.348.28-.135.588-.204.894-.204.15 0 .304.017.452.05.252.057.49.176.72.29l.023.011c.22.11.43.212.62.262.067.017.157.01.225-.025.06-.032.135-.106.135-.228 0-.199-.013-.414-.027-.64l-.003-.05c-.07-1.133-.159-2.517.45-3.546C9.443 3.191 11.37 3 12.166 3z"/>
                  </svg>
                </a>
                <a 
                  href="https://wa.me/96561112299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-gold/20 hover:border-gold/30 hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-6">
                {t('quickLinks')}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-white/60 hover:text-white flex items-center gap-2 group transition-colors duration-300"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Contact Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-6">
                {t('contact')}
              </h4>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href}
                      className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 group"
                    >
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <item.icon className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                      </div>
                      <span className="text-sm">{item.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Newsletter / CTA Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-6">
                {language === 'ar' ? 'احجز الآن' : 'Book Now'}
              </h4>
              <p className="text-white/60 text-sm mb-5">
                {language === 'ar' 
                  ? 'احصل على ابتسامة مثالية مع أفضل رعاية للأسنان' 
                  : 'Get your perfect smile with premium dental care'}
              </p>
              <a
                href="#booking"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-terminal-dark font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 group"
              >
                <span>{language === 'ar' ? 'احجز موعدك' : 'Book Appointment'}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {currentYear} {doctorName}. {t('allRightsReserved')}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
