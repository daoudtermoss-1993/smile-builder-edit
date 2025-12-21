import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { MorphingCardStack, type CardData } from "@/components/ui/morphing-card-stack";
import { servicesData } from "@/data/servicesData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GridPattern } from "@/components/ui/SectionTransition";

export const Services = () => {
  const { language } = useLanguage();
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
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            0 2
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
            <EditableText 
              sectionKey="services" 
              field="title" 
              defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Dental Care'}
              as="span"
            />
          </h2>
          
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            <EditableText 
              sectionKey="services" 
              field="subtitle" 
              defaultValue={language === 'ar' 
                ? 'نقدم مجموعة واسعة من خدمات طب الأسنان لتلبية جميع احتياجات صحة فمك'
                : 'We offer a wide range of dental services to meet all your oral health needs'}
              as="span"
            />
          </p>
        </motion.div>

        {/* Morphing Card Stack - Centered */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MorphingCardStack 
            cards={morphingCards}
            defaultLayout="stack"
            className="w-full max-w-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};
