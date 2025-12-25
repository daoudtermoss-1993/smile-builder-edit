import { Award, Users, Clock, LucideIcon } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { EditableMedia } from "@/components/admin/EditableMedia";
import { AddContentButton } from "@/components/admin/AddContentButton";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { useDynamicContent, DynamicContentItem } from "@/hooks/useDynamicContent";
import { useEditable } from "@/contexts/EditableContext";
import { motion, useScroll } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionTransition, GridPattern } from "@/components/ui/SectionTransition";

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
  
  // Scroll-driven parallax
  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

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
    <>
      {/* Removed SectionTransition - hero already has curved transition */}
      
      <section id="about" ref={aboutRef} className="relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left side - Scroll-driven info blocks */}
            <div className="space-y-16 lg:pr-6">
              <article className="min-h-[65vh] flex items-center">
                <motion.div
                  className="space-y-8 max-w-xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.6 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                    01
                  </span>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                    <EditableText
                      sectionKey="about"
                      field="title"
                      defaultValue={language === "ar" ? `تعرف على ${doctorName}` : `Meet ${doctorName}`}
                      as="span"
                    />
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <EditableText
                      sectionKey="about"
                      field="description"
                      defaultValue={
                        language === "ar"
                          ? "مع سنوات من الخبرة في طب الأسنان التجميلي والترميمي، الدكتور يوسف جيرمان ملتزم بتقديم رعاية أسنان استثنائية في بيئة مريحة وترحيبية."
                          : description
                      }
                      as="span"
                    />
                  </p>
                </motion.div>
              </article>

              {statItems.map((stat, index) => {
                const Icon = iconMap[stat.iconType] || Award;
                const stepNumber = String(index + 2).padStart(2, "0");

                return (
                  <article key={stat.id} className="min-h-[65vh] flex items-center">
                    <motion.div
                      className="w-full max-w-xl"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ amount: 0.6 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                          {stepNumber}
                        </span>

                        {isEditMode && (
                          <DeleteContentButton
                            onConfirm={() => deleteItem(stat.id)}
                            itemName="cette statistique"
                          />
                        )}
                      </div>

                      <div className="mt-7 flex items-start gap-4">
                        <div className="shrink-0 h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                          <div className="text-4xl md:text-5xl font-bold text-foreground">
                            {stat.value}
                          </div>
                          <div className="mt-2 text-base text-muted-foreground">
                            {language === "ar" ? stat.labelAr : stat.labelEn}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </article>
                );
              })}

              {isEditMode && (
                <div className="flex justify-start">
                  <AddContentButton
                    onClick={() => setShowAddDialog(true)}
                    label={language === "ar" ? "إضافة إحصائية" : "Add Statistic"}
                  />
                </div>
              )}
            </div>

            {/* Right side - Sticky media container, scroll synced */}
            <div className="lg:sticky lg:top-24 lg:-mr-[10vw]">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div
                  className="relative h-[70vh] min-h-[520px] max-h-[800px] overflow-hidden bg-terminal-dark"
                  style={{
                    borderTopLeftRadius: "3rem",
                    borderBottomLeftRadius: "3rem",
                    borderTopRightRadius: "0",
                    borderBottomRightRadius: "0",
                  }}
                >
                  <GridPattern />

                  {/* Dots/stars effect (deterministic positions) */}
                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-ivory-light/30 rounded-full"
                        style={{
                          left: `${(i * 37) % 100}%`,
                          top: `${(i * 53) % 100}%`,
                        }}
                        animate={{
                          opacity: [0.2, 0.8, 0.2],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2 + (i % 3),
                          repeat: Infinity,
                          delay: (i % 5) * 0.2,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 h-full">
                    <EditableMedia
                      sectionKey="about"
                      field="doctorMedia"
                      defaultSrc={doctorImage}
                      alt={doctorName}
                      className="h-full"
                      enableParallax={true}
                      parallaxRange={22}
                      scrollYProgressOverride={scrollYProgress}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-terminal-dark/80 via-transparent to-terminal-dark/40 pointer-events-none z-20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-terminal-dark/60 via-transparent to-transparent pointer-events-none z-20" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition to dark section */}
      <SectionTransition variant="white-to-dark" />

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
    </>
  );
};
