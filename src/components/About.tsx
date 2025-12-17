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
  { id: "1", value: "15+", labelEn: "Years Experience", labelAr: "سنوات خبرة", iconType: "award" },
  { id: "2", value: "5000+", labelEn: "Happy Patients", labelAr: "مريض سعيد", iconType: "users" },
  { id: "3", value: "10000+", labelEn: "Treatments Done", labelAr: "علاج ناجح", iconType: "clock" },
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
    <section id="about" className="py-32 md:py-40 overflow-hidden relative min-h-screen flex items-center">
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
              {language === 'ar' ? 'عن عيادتنا' : 'About Us'}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.1em] text-slate-800 mb-6">
              <EditableText 
                sectionKey="about" 
                field="title" 
                defaultValue={language === 'ar' ? 'طب الأسنان الفاخر' : 'Premium Dental Care'}
                as="span"
              />
            </h2>
            <div className="w-16 h-px bg-primary/40 mx-auto" />
          </motion.div>

          {/* Content grid */}
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <motion.div 
              className="relative order-2 md:order-1"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative overflow-hidden">
                <EditableImage
                  sectionKey="about"
                  field="doctorImage"
                  defaultSrc={doctorImage}
                  alt={doctorName}
                  className="w-full aspect-[4/5] object-cover"
                />
                {/* Overlay line decoration */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
            </motion.div>
            
            {/* Text content */}
            <motion.div 
              className="space-y-8 order-1 md:order-2"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-2xl md:text-3xl font-light tracking-[0.05em] text-slate-700">
                {language === 'ar' ? `تعرف على ${doctorName}` : `Meet ${doctorName}`}
              </h3>
              
              <p className="text-base md:text-lg font-light leading-relaxed text-slate-500">
                <EditableText 
                  sectionKey="about" 
                  field="description" 
                  defaultValue={language === 'ar' ? 'مع سنوات من الخبرة في طب الأسنان التجميلي والترميمي، الدكتور يوسف جيرمان ملتزم بتقديم رعاية أسنان استثنائية في بيئة مريحة وترحيبية.' : description}
                  as="span"
                />
              </p>
              
              {/* Stats - minimal style */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                {statItems.map((stat, index) => {
                  const Icon = iconMap[stat.iconType] || Award;
                  return (
                    <motion.div 
                      key={stat.id}
                      className="text-center relative group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {isEditMode && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <DeleteContentButton onConfirm={() => deleteItem(stat.id)} itemName="cette statistique" />
                        </div>
                      )}
                      <div className="text-3xl md:text-4xl font-extralight text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-xs font-light tracking-[0.15em] text-slate-400 uppercase">
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