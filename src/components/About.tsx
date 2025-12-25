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
      <section id="about" ref={aboutRef} className="relative bg-background overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left side - Info blocks */}
          <div className="w-full lg:w-[42%] px-6 md:px-10 lg:pl-[5vw] lg:pr-12 py-16 lg:py-24">
            {/* Title block */}
            <motion.div
              className="mb-16 lg:mb-24"
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
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
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

            {/* Stats blocks */}
            <div className="space-y-12 lg:space-y-16">
              {statItems.map((stat, index) => {
                const Icon = iconMap[stat.iconType] || Award;
                const stepNumber = String(index + 2).padStart(2, "0");

                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <div className="flex items-center justify-between mb-4">
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
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {stat.value}
                        </div>
                        <div className="mt-1 text-base text-muted-foreground">
                          {language === "ar" ? stat.labelAr : stat.labelEn}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isEditMode && (
                <div className="pt-4">
                  <AddContentButton
                    onClick={() => setShowAddDialog(true)}
                    label={language === "ar" ? "إضافة إحصائية" : "Add Statistic"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right side - Sticky media container (Terminal Industries style) */}
          <div className="hidden lg:block lg:flex-1 lg:sticky lg:top-0 lg:h-screen">
            <motion.div
              className="h-full w-full"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className="relative h-full w-full overflow-hidden bg-[#0a0f14]"
                style={{
                  borderTopLeftRadius: "2.5rem",
                  borderBottomLeftRadius: "2.5rem",
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
                    className="h-full w-full"
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
                  position={{ x: "10%", y: "12%" }}
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
                  position={{ x: "12%", y: "75%" }}
                  delay={0.6}
                />
                <ScrollAnnotation 
                  label="LOCATION" 
                  value="Kuwait City" 
                  position={{ x: "60%", y: "82%" }}
                  delay={0.8}
                  accentColor="rgba(255,180,100,0.9)"
                />
                
                {/* Corner accents */}
                <svg className="absolute bottom-6 left-6 w-14 h-14 z-[15]" viewBox="0 0 64 64" fill="none">
                  <motion.path 
                    d="M0 64 L0 32 Q0 0 32 0 L64 0" 
                    stroke="rgba(180,230,100,0.5)" 
                    strokeWidth="1.5" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
                <svg className="absolute top-6 right-6 w-14 h-14 z-[15]" viewBox="0 0 64 64" fill="none">
                  <motion.path 
                    d="M64 0 L64 32 Q64 64 32 64 L0 64" 
                    stroke="rgba(180,230,100,0.5)" 
                    strokeWidth="1.5" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Mobile version */}
          <div className="lg:hidden px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0a0f14]">
                <EditableMedia
                  sectionKey="about"
                  field="doctorMedia"
                  defaultSrc={doctorImage}
                  alt={doctorName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14]/70 to-transparent pointer-events-none" />
              </div>
            </motion.div>
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