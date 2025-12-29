import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { Interactive3DCards, type Card3DData } from "@/components/ui/interactive-3d-cards";
import { servicesData } from "@/data/servicesData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GridPattern } from "@/components/ui/SectionTransition";

export const Services = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const cards3D: Card3DData[] = servicesData.slice(0, 6).map(service => {
    const Icon = service.icon;
    return {
      id: service.id,
      title: language === 'ar' ? service.titleAr : service.titleEn,
      description: language === 'ar' ? service.descriptionAr : service.descriptionEn,
      icon: <Icon className="h-6 w-6" />,
      onClick: () => navigate(`/services/${service.id}`)
    };
  });
  
  return (
    <section id="services" className="py-24 overflow-hidden relative bg-terminal-dark">
      {/* GridPattern animé comme Contact */}
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
          {/* Premium badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terminal-muted/50 backdrop-blur-sm border border-white/10 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-terminal-accent" />
            <span className="text-sm font-medium text-terminal-accent tracking-wide">
              {language === 'ar' ? 'خدمات متميزة' : 'Premium Services'}
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-white">
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
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-terminal-accent/30 rounded-full" />
            <div className="w-2 h-2 bg-terminal-accent rounded-full" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-terminal-accent/30 rounded-full" />
          </div>
        </motion.div>

        {/* Interactive 3D Cards */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Interactive3DCards 
            cards={cards3D}
            className="w-full py-12"
          />
        </motion.div>
      </div>
    </section>
  );
};
