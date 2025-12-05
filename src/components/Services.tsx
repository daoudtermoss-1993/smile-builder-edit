import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction";
import { servicesData } from "@/data/servicesData";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const Services = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const stackedCards = servicesData.slice(0, 3).map(service => ({
    image: service.image,
    title: language === 'ar' ? service.titleAr : service.titleEn,
    description: language === 'ar' ? 'انقر لمعرفة المزيد' : 'Click to learn more',
    onClick: () => {
      window.location.href = `/services/${service.id}`;
    }
  }));
  
  return (
    <section id="services" className="vibe-section py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30 mb-6">
            <EditableText 
              sectionKey="services" 
              field="badge" 
              defaultValue={t('servicesTitle')}
              className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">
            <EditableText 
              sectionKey="services" 
              field="title" 
              defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Dental Care'}
              as="span"
            />
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            <EditableText 
              sectionKey="services" 
              field="subtitle" 
              defaultValue={language === 'ar' 
                ? 'نقدم مجموعة واسعة من خدمات طب الأسنان لتلبية جميع احتياجات صحة فمك'
                : 'We offer a wide range of dental services to meet all your oral health needs'}
              as="span"
            />
          </p>
        </div>

        {/* Stacked Cards Feature */}
        <div className="flex justify-center mb-16 min-h-[450px]">
          <StackedCardsInteraction 
            cards={stackedCards}
            spreadDistance={50}
            rotationAngle={6}
          />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link 
                key={index} 
                to={`/services/${service.id}`}
                className="group"
              >
                <div className="vibe-card h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-gradient-vibe flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    {language === 'ar' ? service.descriptionAr : service.descriptionEn}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    {language === 'ar' ? 'اعرف المزيد' : 'Learn more'}
                    {isRTL ? <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
