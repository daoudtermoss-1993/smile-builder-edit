import { useLanguage } from "@/contexts/LanguageContext";
import { EditableText } from "@/components/admin/EditableText";
import { servicesData } from "@/data/servicesData";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Services = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="services" className="py-32 md:py-40 overflow-hidden relative min-h-screen flex items-center">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header - mont-fort style */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-light tracking-[0.4em] text-slate-400 uppercase mb-6 block">
              {language === 'ar' ? 'خدماتنا' : 'Our Services'}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.1em] text-slate-800 mb-6">
              <EditableText 
                sectionKey="services" 
                field="title" 
                defaultValue={language === 'ar' ? 'رعاية شاملة للأسنان' : 'Comprehensive Care'}
                as="span"
              />
            </h2>
            <div className="w-16 h-px bg-primary/40 mx-auto mb-8" />
            <p className="text-base md:text-lg font-light text-slate-500 max-w-xl mx-auto">
              <EditableText 
                sectionKey="services" 
                field="subtitle" 
                defaultValue={language === 'ar' 
                  ? 'نقدم مجموعة واسعة من خدمات طب الأسنان'
                  : 'We provide a wide range of premium dental services'}
                as="span"
              />
            </p>
          </motion.div>

          {/* Services Grid - Minimal style */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {servicesData.slice(0, 6).map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  {/* Number indicator */}
                  <div className="text-xs font-light tracking-[0.2em] text-slate-300 mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Service content */}
                  <div className="border-t border-slate-200 pt-6 group-hover:border-primary/40 transition-colors duration-500">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl md:text-2xl font-light tracking-[0.05em] text-slate-700 group-hover:text-slate-900 transition-colors">
                        {language === 'ar' ? service.titleAr : service.titleEn}
                      </h3>
                      <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-300">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <p className="text-sm font-light text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {language === 'ar' ? service.descriptionAr : service.descriptionEn}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-light tracking-[0.15em] text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>{language === 'ar' ? 'المزيد' : 'Learn More'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};