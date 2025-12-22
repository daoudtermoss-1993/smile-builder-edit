import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEditable } from "@/contexts/EditableContext";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatementSection() {
  const { language } = useLanguage();
  const { isEditMode, getSectionContent, loadSectionContent, setPendingChange } = useEditable();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');

  const defaultText = language === 'ar' 
    ? 'تخيّل ابتسامة تعكس ثقتك، مصنوعة بدقة وشغف.'
    : 'Imaginez un sourire qui reflète votre confiance, façonné avec précision et passion.';

  useEffect(() => {
    loadSectionContent('statement');
  }, [loadSectionContent]);

  const content = getSectionContent('statement');
  const currentValue = content['main_text'] || defaultText;

  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      setLocalValue(currentValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== currentValue) {
      setPendingChange({
        sectionKey: 'statement',
        field: 'main_text',
        oldValue: currentValue,
        newValue: localValue
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(currentValue);
      setIsEditing(false);
    }
  };

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
          {isEditMode ? (
            isEditing ? (
              <textarea
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-background/80 border-2 border-primary rounded-md p-4 w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-foreground text-center"
                rows={3}
              />
            ) : (
              <h2
                onClick={handleClick}
                className={cn(
                  "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-foreground",
                  "cursor-pointer relative group hover:outline hover:outline-2 hover:outline-primary hover:outline-dashed rounded-sm transition-all inline-block"
                )}
              >
                {currentValue}
                <Pencil className="absolute -top-2 -right-6 w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
            )
          ) : (
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-foreground">
              {defaultText}
            </h2>
          )}
        </motion.div>
      </div>
    </section>
  );
}
