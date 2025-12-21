import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { MorphingCardStack, type CardData } from "@/components/ui/morphing-card-stack";
import { servicesData } from "@/data/servicesData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GridPattern } from "@/components/ui/SectionTransition";

export const Services = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const morphingCards: CardData[] = servicesData.slice(0, 6).map(service => {
    const Icon = service.icon;
    return {
      id: service.id,
      title: language === 'ar' ? service.titleAr : service.titleEn,
      description: language === 'ar' ? service.descriptionAr : service.descriptionEn,
      icon: <Icon className="h-5 w-5" />,
      onClick: () => navigate(`/services/${service.id}`)
    };
  });
  
  return (
    <section id="services" className="py-24 overflow-hidden relative bg-terminal-dark">
      <GridPattern />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          {/* Left side - Text content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-sm font-medium text-primary tracking-widest uppercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              0 2
            </motion.span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              <EditableText 
                sectionKey="services" 
                field="title" 
                defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Dental Care'}
                as="span"
              />
            </h2>
            
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              <EditableText 
                sectionKey="services" 
                field="subtitle" 
                defaultValue={language === 'ar' 
                  ? 'نقدم مجموعة واسعة من خدمات طب الأسنان لتلبية جميع احتياجات صحة فمك'
                  : 'We offer a wide range of dental services to meet all your oral health needs'}
                as="span"
              />
            </p>

            {/* Service list */}
            <div className="space-y-4 pt-4">
              {servicesData.slice(0, 4).map((service, index) => (
                <motion.div
                  key={service.id}
                  className="flex items-center gap-4 group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform" />
                  <span className="text-white/80 group-hover:text-primary transition-colors">
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Morphing Card Stack */}
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <MorphingCardStack 
              cards={morphingCards}
              defaultLayout="stack"
              className="w-full max-w-md"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
