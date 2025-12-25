import { Award, Users, Clock, LucideIcon } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { EditableMedia } from "@/components/admin/EditableMedia";
import { AddContentButton } from "@/components/admin/AddContentButton";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { useDynamicContent, DynamicContentItem } from "@/hooks/useDynamicContent";
import { useEditable } from "@/contexts/EditableContext";
import { motion, useScroll, useTransform } from "framer-motion";
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

// Annotation component for the media overlay
interface AnnotationProps {
  label: string;
  value?: string;
  position: { x: string; y: string };
  delay?: number;
  accentColor?: string;
  showLine?: boolean;
  lineDirection?: 'left' | 'right' | 'up' | 'down';
}

const ScrollAnnotation = ({ 
  label, 
  value, 
  position, 
  delay = 0, 
  accentColor = "rgba(180,230,100,0.9)",
  showLine = false,
  lineDirection = 'left'
}: AnnotationProps) => {
  const lineVariants = {
    left: { x1: 0, y1: 10, x2: -40, y2: 10 },
    right: { x1: 0, y1: 10, x2: 40, y2: 10 },
    up: { x1: 10, y1: 0, x2: 10, y2: -30 },
    down: { x1: 10, y1: 20, x2: 10, y2: 50 },
  };

  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {showLine && (
        <svg className="absolute -left-10 top-0 w-12 h-6 overflow-visible" viewBox="-40 0 50 20">
          <motion.line
            {...lineVariants[lineDirection]}
            stroke={accentColor}
            strokeWidth="1"
            strokeDasharray="4 2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
          />
        </svg>
      )}
      <div className="flex flex-col gap-0.5">
        <span 
          className="text-[10px] tracking-[0.2em] uppercase font-medium"
          style={{ color: accentColor }}
        >
          {label}
        </span>
        {value && (
          <span className="text-white/90 text-sm font-semibold tracking-wide">
            {value}
          </span>
        )}
      </div>
    </motion.div>
  );
};

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

            {/* Right side - Sticky media container à la Terminal Industries */}
            <div className="hidden lg:block lg:sticky lg:top-20 lg:-mr-[calc(50vw-50%+1px)] lg:ml-4 h-[85vh]">
              <motion.div
                className="h-full"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div
                  className="relative h-full w-full overflow-hidden bg-[#0a0f14]"
                  style={{
                    borderTopLeftRadius: "2.5rem",
                    borderBottomLeftRadius: "2.5rem",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  {/* Grid pattern overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-[1]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }}
                  />

                  {/* Floating dots / stars effect */}
                  <div className="absolute inset-0 overflow-hidden z-[2]">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: i % 3 === 0 ? 3 : 2,
                          height: i % 3 === 0 ? 3 : 2,
                          left: `${(i * 41 + 7) % 100}%`,
                          top: `${(i * 59 + 11) % 100}%`,
                          backgroundColor: i % 5 === 0 ? 'rgba(180,230,100,0.5)' : 'rgba(255,255,255,0.25)',
                        }}
                        animate={{
                          opacity: [0.3, 0.9, 0.3],
                          scale: [1, 1.3, 1],
                        }}
                        transition={{
                          duration: 3 + (i % 4),
                          repeat: Infinity,
                          delay: (i % 7) * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  {/* Media content with parallax */}
                  <div className="relative z-[5] h-full w-full">
                    <EditableMedia
                      sectionKey="about"
                      field="doctorMedia"
                      defaultSrc={doctorImage}
                      alt={doctorName}
                      className="h-full w-full"
                      enableParallax={true}
                      parallaxRange={30}
                      scrollYProgressOverride={scrollYProgress}
                    />
                  </div>

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/90 via-transparent to-[#0a0f14]/50 pointer-events-none z-[10]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f14]/70 via-transparent to-transparent pointer-events-none z-[10]" />
                  
                  {/* Interactive annotations that appear on scroll */}
                  <ScrollAnnotation 
                    label="EXPERTISE" 
                    value="15+ Years" 
                    position={{ x: "12%", y: "15%" }}
                    delay={0.1}
                    showLine
                    lineDirection="left"
                  />
                  <ScrollAnnotation 
                    label="SPECIALTY" 
                    value="Cosmetic Dentistry" 
                    position={{ x: "60%", y: "25%" }}
                    delay={0.3}
                    accentColor="rgba(100,200,255,0.9)"
                  />
                  <ScrollAnnotation 
                    label="PATIENTS" 
                    value="5,000+" 
                    position={{ x: "15%", y: "70%" }}
                    delay={0.5}
                    showLine
                    lineDirection="up"
                  />
                  <ScrollAnnotation 
                    label="LOCATION" 
                    value="Kuwait City" 
                    position={{ x: "65%", y: "80%" }}
                    delay={0.7}
                    accentColor="rgba(255,180,100,0.9)"
                  />
                  
                  {/* Corner accent lines */}
                  <svg className="absolute bottom-8 left-8 w-16 h-16 z-[15]" viewBox="0 0 64 64" fill="none">
                    <motion.path 
                      d="M0 64 L0 32 Q0 0 32 0 L64 0" 
                      stroke="rgba(180,230,100,0.4)" 
                      strokeWidth="1.5" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ amount: 0.3 }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                    />
                  </svg>
                  <svg className="absolute top-8 right-8 w-16 h-16 z-[15]" viewBox="0 0 64 64" fill="none">
                    <motion.path 
                      d="M64 0 L64 32 Q64 64 32 64 L0 64" 
                      stroke="rgba(180,230,100,0.4)" 
                      strokeWidth="1.5" 
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ amount: 0.3 }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </svg>
                  
                  {/* Hover interaction zone */}
                  <motion.div 
                    className="absolute inset-0 z-[25] cursor-pointer"
                    whileHover={{ backgroundColor: "rgba(180,230,100,0.03)" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Mobile version - simpler card layout */}
            <div className="lg:hidden mt-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0a0f14]">
                  <EditableMedia
                    sectionKey="about"
                    field="doctorMedia"
                    defaultSrc={doctorImage}
                    alt={doctorName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/80 to-transparent pointer-events-none" />
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
