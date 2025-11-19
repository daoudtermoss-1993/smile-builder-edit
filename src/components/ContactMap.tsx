import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactMapProps {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export const ContactMap = ({ address, phone, email, hours }: ContactMapProps) => {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className="vibe-section bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{t('contactTitle')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="vibe-card space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t('address')}</h3>
                <p className="text-muted-foreground">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t('phone')}</h3>
                <a href={`tel:${phone}`} className="text-primary hover:underline">
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t('email')}</h3>
                <a href={`mailto:${email}`} className="text-primary hover:underline">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{t('hours')}</h3>
                <p className="text-muted-foreground">{hours}</p>
              </div>
            </div>
          </div>

          <div className="vibe-card p-0 overflow-hidden h-[500px]">
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
          </div>
        </div>
      </div>
    </section>
  );
};
