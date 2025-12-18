import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
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
    { icon: MapPin, label: t('address'), value: language === 'ar' ? 'مدينة الكويت، الكويت' : address, isLink: false },
    { icon: Phone, label: t('phone'), value: phone, isLink: true, href: `tel:${phone}` },
    { icon: Mail, label: t('email'), value: email, isLink: true, href: `mailto:${email}` },
  ];
  
  return (
    <section id="contact" className="py-16 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-bl from-[hsl(180,50%,8%)]/80 via-black/70 to-[hsl(180,50%,10%)]/80" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            <EditableText 
              sectionKey="contact" 
              field="title" 
              defaultValue={t('contactTitle')}
              as="span"
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <EditableText 
              sectionKey="contact" 
              field="subtitle" 
              defaultValue={t('contactSubtitle')}
              as="span"
            />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.div 
            className="vibe-card space-y-6 h-full flex flex-col"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {contactItems.map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{item.label}</h3>
                  {item.isLink ? (
                    <a href={item.href} className="text-primary hover:underline link-underline">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-foreground">{language === 'ar' ? 'ساعات العمل' : t('hours')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'الإثنين - الجمعة' : 'Monday - Friday'}</span>
                    <span className="text-sm font-medium text-foreground">09:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'السبت - الأحد' : 'Saturday - Sunday'}</span>
                    <span className="text-sm font-medium text-destructive">{language === 'ar' ? 'مغلق' : 'Closed'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="pt-4 border-t border-border mt-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                onClick={() => setShowVoiceAssistant(true)}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white vibe-glow"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('callAIAssistant')}
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {t('speakWithAI')}
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="vibe-card p-0 overflow-hidden h-full min-h-[400px]"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221097.42527267428!2d47.825309!3d29.378586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9c5e7b7e2e9d%3A0x4b7b7b7b7b7b7b7b!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kuwait Location"
            />
          </motion.div>
        </div>
      </div>

      {showVoiceAssistant && (
        <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
      )}
    </section>
  );
};
