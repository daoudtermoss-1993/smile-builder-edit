import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { MorphingCardStack, type CardData } from "@/components/ui/morphing-card-stack";
import { servicesData } from "@/data/servicesData";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const Services = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
    }
  };
  
  return (
    <section id="services" className="py-20 overflow-hidden relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 relative z-10">
        {/* Content positioned to the left (3D object on right) */}
        <div className="max-w-2xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block px-6 py-2 glass-teal rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EditableText 
              sectionKey="services" 
              field="badge" 
              defaultValue={t('servicesTitle')}
              className="text-sm font-semibold text-primary"
            />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            <EditableText 
              sectionKey="services" 
              field="title" 
              defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Dental Care'}
              as="span"
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

        {/* Morphing Card Stack Feature */}
        <motion.div 
          className="flex justify-start"
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
