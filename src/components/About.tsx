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
import { SectionTransition } from "@/components/ui/SectionTransition";

// Annotation component for the media overlay
interface AnnotationProps {
  label: string;
  value?: string;
  position: { x: string; y: string };
  delay?: number;
  accentColor?: string;
}

const ScrollAnnotation = ({ 
  label, 
  value, 
  position, 
  delay = 0, 
  accentColor = "rgba(180,230,100,0.9)",
}: AnnotationProps) => (
  <motion.div
    className="absolute z-20 pointer-events-none"
    style={{ left: position.x, top: position.y }}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ amount: 0.3 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
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
      <section id="about" ref={aboutRef} className="relative bg-background overflow-hidden py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-[5vw]">
          {/* Title block */}
          <motion.div
            className="mb-12 lg:mb-16 max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-6 block">
              01
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6">
              <EditableText
                sectionKey="about"
                field="title"
                defaultValue={language === "ar" ? `تعرف على ${doctorName}` : `Meet ${doctorName}`}
                as="span"
              />
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
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

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 lg:gap-12 mb-12 lg:mb-16">
            {statItems.map((stat, index) => {
              const Icon = iconMap[stat.iconType] || Award;
              const stepNumber = String(index + 2).padStart(2, "0");

              return (
                <motion.div
                  key={stat.id}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                      {stepNumber}
                    </span>
                    {isEditMode && (
                      <DeleteContentButton
                        onConfirm={() => deleteItem(stat.id)}
                        itemName="cette statistique"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? stat.labelAr : stat.labelEn}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {isEditMode && (
              <div className="flex items-end">
                <AddContentButton
                  onClick={() => setShowAddDialog(true)}
                  label={language === "ar" ? "إضافة إحصائية" : "Add Statistic"}
                />
              </div>
            )}
          </div>

          {/* Media container with Terminal Industries style borders */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* The container with special border shape */}
            <div className="relative lg:ml-[15%] w-full lg:w-[85%]">
              {/* Main media container with Terminal Industries style cutout */}
              <div 
                className="relative aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-[#0a0f14]"
                style={{
                  borderRadius: '0 2.5rem 2.5rem 0',
                  clipPath: 'polygon(80px 0, 100% 0, 100% 100%, 0 100%, 0 80px, 40px 80px, 40px 40px, 80px 40px)',
                }}
              >
                {/* Grid pattern */}
                <div 
                  className="absolute inset-0 pointer-events-none z-[1]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                  }}
                />

                {/* Floating dots */}
                <div className="absolute inset-0 overflow-hidden z-[2]">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: i % 3 === 0 ? 3 : 2,
                        height: i % 3 === 0 ? 3 : 2,
                        left: `${(i * 41 + 7) % 100}%`,
                        top: `${(i * 59 + 11) % 100}%`,
                        backgroundColor: i % 4 === 0 ? 'rgba(180,230,100,0.6)' : 'rgba(255,255,255,0.3)',
                      }}
                      animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: (i % 5) * 0.4,
                      }}
                    />
                  ))}
                </div>

                {/* Media with parallax */}
                <div className="relative z-[5] h-full w-full">
                  <EditableMedia
                    sectionKey="about"
                    field="doctorMedia"
                    defaultSrc={doctorImage}
                    alt={doctorName}
                    className="h-full w-full object-cover"
                    enableParallax={true}
                    parallaxRange={25}
                    scrollYProgressOverride={scrollYProgress}
                  />
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/80 via-transparent to-[#0a0f14]/40 pointer-events-none z-[10]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f14]/60 via-transparent to-transparent pointer-events-none z-[10]" />
                
                {/* Annotations */}
                <ScrollAnnotation 
                  label="EXPERTISE" 
                  value="15+ Years" 
                  position={{ x: "15%", y: "15%" }}
                  delay={0.2}
                />
                <ScrollAnnotation 
                  label="SPECIALTY" 
                  value="Cosmetic Dentistry" 
                  position={{ x: "55%", y: "20%" }}
                  delay={0.4}
                  accentColor="rgba(100,200,255,0.9)"
                />
                <ScrollAnnotation 
                  label="PATIENTS" 
                  value="5,000+" 
                  position={{ x: "20%", y: "75%" }}
                  delay={0.6}
                />
                <ScrollAnnotation 
                  label="LOCATION" 
                  value="Kuwait City" 
                  position={{ x: "60%", y: "80%" }}
                  delay={0.8}
                  accentColor="rgba(255,180,100,0.9)"
                />
              </div>

              {/* Border outline with cutout shape - SVG overlay */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-[20]"
                viewBox="0 0 1000 562"
                preserveAspectRatio="none"
              >
                <motion.path 
                  d="M80 0 L960 0 Q1000 0 1000 40 L1000 522 Q1000 562 960 562 L40 562 Q0 562 0 522 L0 80 L40 80 L40 40 L80 40 Z" 
                  stroke="rgba(180,230,100,0.4)" 
                  strokeWidth="2" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>

              {/* Corner accent decoration - top left cutout area */}
              <div className="absolute top-0 left-0 w-20 h-20 z-[15]">
                <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
                  <motion.path 
                    d="M80 0 L80 40 L40 40 L40 80 L0 80" 
                    stroke="rgba(180,230,100,0.6)" 
                    strokeWidth="1.5" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </svg>
              </div>

              {/* Bottom right corner accent */}
              <svg className="absolute bottom-4 right-4 w-12 h-12 z-[15]" viewBox="0 0 64 64" fill="none">
                <motion.path 
                  d="M64 0 L64 32 Q64 64 32 64 L0 64" 
                  stroke="rgba(180,230,100,0.5)" 
                  strokeWidth="1.5" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </svg>
            </div>
          </motion.div>
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