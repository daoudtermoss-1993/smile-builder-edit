import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";

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
    { icon: MapPin, label: language === 'ar' ? 'العنوان' : 'Address', value: language === 'ar' ? 'مدينة الكويت، الكويت' : address, isLink: false },
    { icon: Phone, label: language === 'ar' ? 'الهاتف' : 'Phone', value: phone, isLink: true, href: `tel:${phone}` },
    { icon: Mail, label: language === 'ar' ? 'البريد' : 'Email', value: email, isLink: true, href: `mailto:${email}` },
  ];
  
  return (
    <section id="contact" className="py-32 md:py-40 overflow-hidden relative min-h-[80vh] flex items-center">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header - mont-fort style */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-light tracking-[0.4em] text-slate-400 uppercase mb-6 block">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.1em] text-slate-800 mb-6">
              <EditableText 
                sectionKey="contact" 
                field="title" 
                defaultValue={language === 'ar' ? 'ابقى على تواصل' : 'Get In Touch'}
                as="span"
              />
            </h2>
            <div className="w-16 h-px bg-primary/40 mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Contact info */}
            <motion.div 
              className="space-y-10"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {contactItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <span className="text-xs font-light tracking-[0.2em] text-slate-400 uppercase block mb-2">
                        {item.label}
                      </span>
                      {item.isLink ? (
                        <a href={item.href} className="text-lg font-light text-slate-700 hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-lg font-light text-slate-700">{item.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Hours */}
              <motion.div 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                    <Clock className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <span className="text-xs font-light tracking-[0.2em] text-slate-400 uppercase block mb-3">
                      {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-light text-slate-500 w-32">{language === 'ar' ? 'الإثنين - الجمعة' : 'Mon - Fri'}</span>
                        <span className="text-sm font-light text-slate-700">09:00 - 17:00</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-light text-slate-500 w-32">{language === 'ar' ? 'السبت - الأحد' : 'Sat - Sun'}</span>
                        <span className="text-sm font-light text-red-500">{language === 'ar' ? 'مغلق' : 'Closed'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Voice Assistant CTA */}
              <motion.button 
                onClick={() => setShowVoiceAssistant(true)}
                className="group w-full py-5 px-8 text-sm font-light tracking-[0.2em] uppercase border border-slate-200 text-slate-700 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Phone className="w-4 h-4" />
                {language === 'ar' ? 'تحدث مع المساعد' : 'Speak with AI Assistant'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Map */}
            <motion.div 
              className="h-[500px] border border-slate-200 overflow-hidden"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221097.42527267428!2d47.825309!3d29.378586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c5e7b7e2e9d%3A0x4b7b7b7b7b7b7b7b!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kuwait Location"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {showVoiceAssistant && (
        <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
      )}
    </section>
  );
};