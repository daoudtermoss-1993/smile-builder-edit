import { Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t, language } = useLanguage();
  const doctorName = language === 'ar' ? 'د. يوسف جيرمان' : 'Dr. Yousif German';
  
  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-4 text-primary">{doctorName}</h3>
            <p className="text-muted-foreground">
              {t('footerDescription')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-foreground">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-all duration-300">
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#services" className="text-muted-foreground hover:text-primary transition-all duration-300">
                  {t('services')}
                </a>
              </li>
              <li>
                <a href="#booking" className="text-muted-foreground hover:text-primary transition-all duration-300">
                  {t('booking')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-all duration-300">
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-foreground">{t('followUs')}</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/dr_german?igsh=MXE0NHU4bWdpYWlkNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/30 group"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.snapchat.com/@yousif_german"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 hover:scale-110 hover:-rotate-6 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/30 group"
              >
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.166 3c.796 0 2.723.191 3.836 2.075.608 1.029.52 2.413.449 3.546l-.003.05c-.014.226-.027.441-.027.64 0 .122.074.196.135.228.068.035.158.042.225.025.19-.05.4-.152.62-.262l.023-.011c.23-.114.468-.233.72-.29.148-.033.302-.05.452-.05.306 0 .615.069.894.204.559.27.871.75.871 1.348 0 .462-.212.91-.612 1.295-.45.434-.993.742-1.613 1.016a6.55 6.55 0 01-.535.208c-.096.033-.233.09-.256.15-.03.078.022.226.112.42l.02.04c.406.813.965 1.463 1.661 1.932.58.391 1.275.66 2.066.798.205.036.354.189.386.329.045.195-.033.435-.398.653-.431.257-1.066.437-1.887.536a2.36 2.36 0 01-.085.016c-.025.049-.058.15-.083.224l-.006.017a2.56 2.56 0 01-.219.461c-.186.297-.47.448-.845.448-.17 0-.35-.027-.549-.082-.29-.082-.602-.122-.951-.122-.188 0-.381.014-.575.041a3.77 3.77 0 00-.716.166c-.423.143-.822.384-1.291.677-.716.447-1.528.953-2.698.953-1.144 0-1.945-.494-2.655-.937-.479-.3-.892-.558-1.334-.707a3.996 3.996 0 00-.708-.162 4.345 4.345 0 00-.548-.04c-.368 0-.696.046-1.003.135-.184.053-.352.08-.511.08-.454 0-.726-.219-.874-.448a2.07 2.07 0 01-.195-.415l-.017-.053c-.031-.094-.068-.205-.1-.261a.85.85 0 00-.072-.014c-.821-.1-1.455-.28-1.886-.536-.365-.218-.443-.458-.398-.653.032-.14.18-.293.386-.329.79-.139 1.486-.407 2.066-.798.695-.469 1.254-1.119 1.66-1.932l.02-.04c.09-.194.142-.342.113-.42-.024-.06-.16-.117-.257-.15a6.55 6.55 0 01-.534-.208c-.62-.274-1.163-.582-1.613-1.016-.4-.385-.612-.833-.612-1.295 0-.598.312-1.077.871-1.348.28-.135.588-.204.894-.204.15 0 .304.017.452.05.252.057.49.176.72.29l.023.011c.22.11.43.212.62.262.067.017.157.01.225-.025.06-.032.135-.106.135-.228 0-.199-.013-.414-.027-.64l-.003-.05c-.07-1.133-.159-2.517.45-3.546C9.443 3.191 11.37 3 12.166 3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 {doctorName}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};
