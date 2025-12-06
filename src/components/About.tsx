import { Award, Users, Clock } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";

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
  return (
    <section className="py-24 overflow-hidden">
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
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border border-primary/10">
              <motion.img
                src={doctorImage}
                alt={doctorName}
                className="object-cover w-full aspect-square"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
            </div>
            
            {/* Floating badge */}
            <motion.div 
              className="absolute -bottom-6 -right-6 glass-teal rounded-2xl p-4 shadow-elevated"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.years}</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </motion.div>
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
                defaultValue="About Our Clinic"
                className="text-sm font-semibold text-primary"
              />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              <EditableText 
                sectionKey="about" 
                field="title" 
                defaultValue={`Meet ${doctorName}`}
                as="span"
              />
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              <EditableText 
                sectionKey="about" 
                field="description" 
                defaultValue={description}
                as="span"
              />
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <motion.div 
                className="vibe-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  <EditableText sectionKey="about" field="patients" defaultValue={stats.patients} />
                </div>
                <div className="text-sm text-muted-foreground">Happy Patients</div>
              </motion.div>
              
              <motion.div 
                className="vibe-card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  <EditableText sectionKey="about" field="treatments" defaultValue={stats.treatments} />
                </div>
                <div className="text-sm text-muted-foreground">Treatments</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
