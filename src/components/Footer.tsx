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
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.206 2.003c-1.32 0-2.393.554-3.191 1.649-.776.998-1.169 2.321-1.169 3.929 0 .45.034.893.103 1.317a5.863 5.863 0 01-.08-.001c-.43-.004-.827-.134-1.182-.384a1.057 1.057 0 00-.526-.151c-.194 0-.37.066-.523.197a.668.668 0 00-.216.501c0 .189.074.391.221.599.222.314.495.608.813.877a6.21 6.21 0 001.058.653c-.226.382-.544.71-.946.982a5.604 5.604 0 01-1.453.704c-.184.054-.355.129-.508.222-.307.187-.476.426-.476.674 0 .265.203.519.571.713.336.177.738.267 1.193.267.18 0 .366-.017.553-.051.293-.053.578-.146.848-.277.286.634.648 1.199 1.077 1.682.428.483.932.894 1.498 1.223.565.329 1.189.577 1.857.739.668.161 1.376.243 2.107.243.73 0 1.439-.082 2.107-.243.668-.162 1.292-.41 1.857-.739.566-.329 1.069-.74 1.498-1.223.429-.483.791-1.048 1.077-1.682.27.131.555.224.848.277.187.034.373.051.553.051.455 0 .857-.09 1.193-.267.368-.194.571-.448.571-.713 0-.248-.169-.487-.476-.674a3.364 3.364 0 00-.508-.222 5.604 5.604 0 01-1.453-.704c-.402-.272-.72-.6-.946-.982.365-.149.714-.367 1.058-.653.318-.269.591-.563.813-.877.147-.208.221-.41.221-.599a.668.668 0 00-.216-.501.715.715 0 00-.523-.197c-.187 0-.365.051-.526.151-.355.25-.752.38-1.182.384-.027 0-.054 0-.08.001.069-.424.103-.867.103-1.317 0-1.608-.393-2.931-1.169-3.929C14.599 2.557 13.526 2.003 12.206 2.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 {doctorName}. {t('allRightsReserved')}</p>
          <div className="mt-4">
            <a 
              href="/auth" 
              className="text-xs text-muted-foreground/60 hover:text-primary transition-all duration-300 link-underline"
            >
              {t('adminLogin')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
