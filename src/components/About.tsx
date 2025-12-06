import { Award, Users, Clock } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface AboutProps {
  doctorImage?: string;
  doctorName: string;
  description: string;
  stats: {
    years: string;
    patients: string;
    treatments: string;
  };
}

export const About = ({ 
  doctorImage = "/placeholder.svg",
  doctorName,
  description,
  stats
}: AboutProps) => {
  const { language } = useLanguage();
  
  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border border-primary/10 group">
              <motion.img
                src={doctorImage}
                alt={doctorName}
                className="object-cover w-full aspect-square transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-block px-6 py-2 glass-teal rounded-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EditableText 
                sectionKey="about" 
                field="badge" 
                defaultValue={language === 'ar' ? 'عن عيادتنا' : 'About Our Clinic'}
                className="text-sm font-semibold text-primary"
              />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              <EditableText 
                sectionKey="about" 
                field="title" 
                defaultValue={language === 'ar' ? `تعرف على ${doctorName}` : `Meet ${doctorName}`}
                as="span"
              />
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              <EditableText 
                sectionKey="about" 
                field="description" 
                defaultValue={language === 'ar' ? 'مع سنوات من الخبرة في طب الأسنان التجميلي والترميمي، الدكتور يوسف جيرمان ملتزم بتقديم رعاية أسنان استثنائية في بيئة مريحة وترحيبية. تجمع عيادتنا بين أحدث التقنيات واللمسة الشخصية لضمان أفضل النتائج الممكنة لابتسامتك.' : description}
                as="span"
              />
            </p>
            
            {/* Stats grid - 3 cards in a row */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <motion.div 
                className="vibe-card text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  <EditableText sectionKey="about" field="years" defaultValue={stats.years} />
                </div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'سنوات خبرة' : 'Years Exp.'}</div>
              </motion.div>
              
              <motion.div 
                className="vibe-card text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  <EditableText sectionKey="about" field="patients" defaultValue={stats.patients} />
                </div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'مريض' : 'Patients'}</div>
              </motion.div>
              
              <motion.div 
                className="vibe-card text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  <EditableText sectionKey="about" field="treatments" defaultValue={stats.treatments} />
                </div>
                <div className="text-sm text-muted-foreground">{language === 'ar' ? 'علاج' : 'Treatments'}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
