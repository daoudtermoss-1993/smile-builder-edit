import { motion } from "framer-motion";
import { EditableText } from "@/components/admin/EditableText";
import { useLanguage } from "@/contexts/LanguageContext";

export function StatementSection() {
  const { language } = useLanguage();

  const defaultText = language === 'ar' 
    ? 'تخيّل ابتسامة تعكس ثقتك، مصنوعة بدقة وشغف.'
    : 'Imaginez un sourire qui reflète votre confiance, façonné avec précision et passion.';

  return (
    <section className="relative py-32 md:py-40 lg:py-48 bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      
      <div className="container relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <EditableText
            sectionKey="statement"
            field="main_text"
            defaultValue={defaultText}
            as="h2"
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-foreground"
          />
        </motion.div>
      </div>
    </section>
  );
}
