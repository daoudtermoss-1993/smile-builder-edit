import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { MorphingCardStack, type CardData } from "@/components/ui/morphing-card-stack";
import { servicesData } from "@/data/servicesData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    <section id="services" className="py-24 overflow-hidden relative bg-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>
      
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-gold/10 border border-gold/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-primary tracking-wide">
              {language === 'ar' ? 'خدمات متميزة' : 'Premium Services'}
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-primary to-gold bg-clip-text text-transparent">
              <EditableText 
                sectionKey="services" 
                field="title" 
                defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Dental Care'}
                as="span"
              />
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
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
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gold/50 rounded-full" />
            <div className="w-2 h-2 bg-gold rounded-full" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gold/50 rounded-full" />
          </div>
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
