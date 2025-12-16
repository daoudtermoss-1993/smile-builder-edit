import { Award, Users, Clock, LucideIcon } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { AddContentButton } from "@/components/admin/AddContentButton";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { useDynamicContent, DynamicContentItem } from "@/hooks/useDynamicContent";
import { useEditable } from "@/contexts/EditableContext";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface StatItem extends DynamicContentItem {
  value: string;
  labelEn: string;
  labelAr: string;
  iconType: string;
}

const defaultStats: StatItem[] = [
  { id: "1", value: "15+", labelEn: "Years Exp.", labelAr: "سنوات خبرة", iconType: "award" },
  { id: "2", value: "5000+", labelEn: "Patients", labelAr: "مريض", iconType: "users" },
  { id: "3", value: "10000+", labelEn: "Treatments", labelAr: "علاج", iconType: "clock" },
];

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  users: Users,
  clock: Clock,
};

export const About = ({ 
  doctorImage = "/placeholder.svg",
  doctorName,
  description,
}: AboutProps) => {
  const { language } = useLanguage();
  const { isEditMode } = useEditable();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStat, setNewStat] = useState({ value: "", labelEn: "", labelAr: "", iconType: "award" });

  const {
    items: statItems,
    addItem,
    deleteItem,
  } = useDynamicContent<StatItem>("about", "stats", defaultStats);
  
  const handleAddStat = () => {
    if (newStat.value && newStat.labelEn) {
      addItem(newStat);
      setNewStat({ value: "", labelEn: "", labelAr: "", iconType: "award" });
      setShowAddDialog(false);
    }
  };
  
  return (
    <section className="py-20 overflow-hidden relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 relative z-10">
        {/* Content positioned to the right (3D object on left) */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10" />
            <div className="relative overflow-hidden rounded-3xl shadow-elevated border border-primary/10 group backdrop-blur-sm bg-card/30">
              <EditableImage
                sectionKey="about"
                field="doctorImage"
                defaultSrc={doctorImage}
                alt={doctorName}
                className="aspect-square transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-6 order-1 md:order-2"
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
            
            {/* Dynamic Stats grid */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {statItems.map((stat, index) => {
                const Icon = iconMap[stat.iconType] || Award;
                return (
                  <motion.div 
                    key={stat.id}
                    className="vibe-card text-center group cursor-pointer relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    {isEditMode && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <DeleteContentButton onConfirm={() => deleteItem(stat.id)} itemName="cette statistique" />
                      </div>
                    )}
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? stat.labelAr : stat.labelEn}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Add stat button */}
            {isEditMode && (
              <div className="flex justify-center pt-4">
                <AddContentButton 
                  onClick={() => setShowAddDialog(true)} 
                  label={language === 'ar' ? 'إضافة إحصائية' : 'Add Statistic'}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Stat Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une statistique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Valeur (ex: 15+)"
              value={newStat.value}
              onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
            />
            <Input
              placeholder="Label (EN)"
              value={newStat.labelEn}
              onChange={(e) => setNewStat({ ...newStat, labelEn: e.target.value })}
            />
            <Input
              placeholder="Label (AR)"
              value={newStat.labelAr}
              onChange={(e) => setNewStat({ ...newStat, labelAr: e.target.value })}
            />
            <select
              className="w-full border rounded-md p-2"
              value={newStat.iconType}
              onChange={(e) => setNewStat({ ...newStat, iconType: e.target.value })}
            >
              <option value="award">Award (Trophy)</option>
              <option value="users">Users (People)</option>
              <option value="clock">Clock (Time)</option>
            </select>
            <Button onClick={handleAddStat} className="w-full">Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
