import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { GridPattern } from "@/components/ui/SectionTransition";

interface ContactMapProps {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export const ContactMap = ({ address, phone, email, hours }: ContactMapProps) => {
  const { t, language } = useLanguage();
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  const contactItems = [
    { icon: MapPin, label: t('address'), value: language === 'ar' ? 'مدينة الكويت، الكويت' : address, isLink: false },
    { icon: Phone, label: t('phone'), value: phone, isLink: true, href: `tel:${phone}` },
    { icon: Mail, label: t('email'), value: email, isLink: true, href: `mailto:${email}` },
  ];
  
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden relative bg-terminal-dark">
      <GridPattern />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="text-sm font-medium text-gold tracking-widest uppercase mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {language === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
          </motion.span>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-4">
            <EditableText 
              sectionKey="contact" 
              field="title" 
              defaultValue={t('contactTitle')}
              as="span"
            />
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto px-2">
            <EditableText 
              sectionKey="contact" 
              field="subtitle" 
              defaultValue={t('contactSubtitle')}
              as="span"
            />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {/* Contact Cards - Left Side */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {contactItems.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-terminal-muted/50 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-gold/30 transition-all duration-300 group"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{item.label}</p>
                    {item.isLink ? (
                      <a 
                        href={item.href} 
                        className="text-white font-medium hover:text-gold transition-colors truncate block"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium truncate">{item.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Hours Card */}
            <motion.div 
              className="bg-terminal-muted/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
                    {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">{language === 'ar' ? 'الإثنين - الجمعة' : 'Mon - Fri'}</span>
                      <span className="text-sm font-medium text-white">09:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">{language === 'ar' ? 'السبت - الأحد' : 'Sat - Sun'}</span>
                      <span className="text-sm font-medium text-red-400">{language === 'ar' ? 'مغلق' : 'Closed'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Assistant CTA */}
            <motion.div 
              className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border border-gold/30 rounded-2xl p-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{language === 'ar' ? 'مساعد ذكي' : 'AI Assistant'}</h4>
                  <p className="text-xs text-white/60">{language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowVoiceAssistant(true)}
                className="w-full bg-gold hover:bg-gold-light text-terminal-dark font-semibold rounded-xl h-12"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('callAIAssistant')}
              </Button>
            </motion.div>
          </div>

          {/* Map - Right Side */}
          <motion.div 
            className="lg:col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] relative"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Map overlay gradient */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-terminal-dark/50 via-transparent to-transparent" />
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221097.42527267428!2d47.825309!3d29.378586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c5e7b7e2e9d%3A0x4b7b7b7b7b7b7b7b!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'saturate(0.8) contrast(1.1)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kuwait Location"
              className="absolute inset-0"
            />
            
            {/* Location badge */}
            <motion.div 
              className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-20 bg-terminal-dark/90 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">{language === 'ar' ? 'موقعنا' : 'Our Location'}</p>
                  <p className="text-[10px] sm:text-xs text-white/60">{language === 'ar' ? 'مدينة الكويت' : 'Kuwait City'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {showVoiceAssistant && (
        <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
      )}
    </section>
  );
};
