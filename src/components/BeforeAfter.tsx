import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Quote, Star, Camera } from "lucide-react";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { AddContentButton } from "@/components/admin/AddContentButton";
import { DeleteContentButton } from "@/components/admin/DeleteContentButton";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useEditable } from "@/contexts/EditableContext";
import { useDynamicContent, DynamicContentItem } from "@/hooks/useDynamicContent";
import { motion } from "framer-motion";
import { ScrollVelocity } from "@/components/ui/scroll-velocity";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeAfterImage extends DynamicContentItem {
  before: string;
  after: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

interface Testimonial extends DynamicContentItem {
  name: string;
  nameAr: string;
  text: string;
  textAr: string;
  treatment: string;
  treatmentAr: string;
  avatar: string;
  rating: number;
}

// Extracted outside to prevent re-creation on every render
const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
    />
  ));
};

interface TestimonialCardProps {
  testimonial: Testimonial;
  language: string;
  isEditMode: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Testimonial>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const TestimonialCard = ({ 
  testimonial, 
  language, 
  isEditMode, 
  onDelete,
  onUpdate,
  onMouseEnter,
  onMouseLeave 
}: TestimonialCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingTreatment, setIsEditingTreatment] = useState(false);
  const [localName, setLocalName] = useState(language === 'ar' ? testimonial.nameAr : testimonial.name);
  const [localText, setLocalText] = useState(language === 'ar' ? testimonial.textAr : testimonial.text);
  const [localTreatment, setLocalTreatment] = useState(language === 'ar' ? testimonial.treatmentAr : testimonial.treatment);

  const handleNameSave = () => {
    if (language === 'ar') {
      onUpdate(testimonial.id, { nameAr: localName });
    } else {
      onUpdate(testimonial.id, { name: localName });
    }
    setIsEditingName(false);
  };

  const handleTextSave = () => {
    if (language === 'ar') {
      onUpdate(testimonial.id, { textAr: localText });
    } else {
      onUpdate(testimonial.id, { text: localText });
    }
    setIsEditingText(false);
  };

  const handleTreatmentSave = () => {
    if (language === 'ar') {
      onUpdate(testimonial.id, { treatmentAr: localTreatment });
    } else {
      onUpdate(testimonial.id, { treatment: localTreatment });
    }
    setIsEditingTreatment(false);
  };

  const handleAvatarChange = (url: string) => {
    onUpdate(testimonial.id, { avatar: url });
  };

  return (
    <Card 
      className="relative inline-block w-[280px] sm:w-[350px] md:w-[400px] min-h-[200px] border-primary/20 bg-card/50 backdrop-blur-sm shrink-0 overflow-visible"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isEditMode && (
        <div className="absolute top-2 right-2 z-50">
          <DeleteContentButton 
            onConfirm={() => onDelete(testimonial.id)} 
            itemName="ce témoignage" 
          />
        </div>
      )}
      <CardContent className="p-4 sm:p-6 h-full">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        {/* Avatar - Editable */}
          <div 
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary/30 shrink-0 ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''}`}
            onClick={() => {
              if (isEditMode) {
                const url = window.prompt('Entrez l\'URL de la nouvelle photo:', testimonial.avatar);
                if (url && url.trim()) {
                  handleAvatarChange(url.trim());
                }
              }
            }}
            title={isEditMode ? 'Cliquez pour changer la photo' : undefined}
          >
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
            {isEditMode && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {/* Name - Editable */}
            {isEditMode && isEditingName ? (
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                autoFocus
                className="w-full font-semibold text-sm sm:text-base bg-background/80 border border-primary rounded px-2 py-1 focus:outline-none"
              />
            ) : (
              <p 
                className={`font-semibold text-sm sm:text-base truncate ${isEditMode ? 'cursor-pointer hover:bg-primary/10 rounded px-1' : ''}`}
                onClick={() => isEditMode && setIsEditingName(true)}
              >
                {language === 'ar' ? testimonial.nameAr : testimonial.name}
              </p>
            )}
            <div className="flex gap-0.5">{renderStars(testimonial.rating)}</div>
          </div>
          <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30 shrink-0" />
        </div>
        {/* Text - Editable */}
        {isEditMode && isEditingText ? (
          <textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onBlur={handleTextSave}
            autoFocus
            className="w-full text-xs sm:text-sm md:text-base bg-background/80 border border-primary rounded px-2 py-1 focus:outline-none resize-none mb-3 sm:mb-4"
            rows={3}
          />
        ) : (
          <p 
            className={`text-xs sm:text-sm md:text-base text-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-4 overflow-hidden ${isEditMode ? 'cursor-pointer hover:bg-primary/10 rounded px-1' : ''}`}
            onClick={() => isEditMode && setIsEditingText(true)}
          >
            "{language === 'ar' ? testimonial.textAr : testimonial.text}"
          </p>
        )}
        <div className="border-t border-border/50 pt-2 sm:pt-3">
          {/* Treatment - Editable */}
          {isEditMode && isEditingTreatment ? (
            <input
              type="text"
              value={localTreatment}
              onChange={(e) => setLocalTreatment(e.target.value)}
              onBlur={handleTreatmentSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTreatmentSave()}
              autoFocus
              className="w-full text-xs bg-background/80 border border-primary rounded px-2 py-1 focus:outline-none"
            />
          ) : (
            <p 
              className={`text-xs text-muted-foreground truncate ${isEditMode ? 'cursor-pointer hover:bg-primary/10 rounded px-1' : ''}`}
              onClick={() => isEditMode && setIsEditingTreatment(true)}
            >
              {language === 'ar' ? testimonial.treatmentAr : testimonial.treatment}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const defaultBeforeAfterImages: BeforeAfterImage[] = [
  {
    id: "1",
    before: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop",
    title: "Teeth Whitening",
    titleAr: "تبييض الأسنان",
    description: "Professional whitening treatment",
    descriptionAr: "علاج تبييض احترافي"
  },
  {
    id: "2",
    before: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop",
    title: "Dental Implants",
    titleAr: "زراعة الأسنان",
    description: "Complete dental restoration",
    descriptionAr: "ترميم الأسنان الكامل"
  },
  {
    id: "3",
    before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop",
    title: "Veneers",
    titleAr: "قشور الأسنان",
    description: "Porcelain veneer transformation",
    descriptionAr: "تحول قشور البورسلين"
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Ahmed",
    nameAr: "سارة أحمد",
    text: "Dr. Yousif transformed my smile completely. The results are amazing!",
    textAr: "غيّر الدكتور يوسف ابتسامتي تماماً. النتائج مذهلة!",
    treatment: "Teeth Whitening",
    treatmentAr: "تبييض الأسنان",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "2",
    name: "Mohammed Ali",
    nameAr: "محمد علي",
    text: "Professional service and excellent results. Highly recommended!",
    textAr: "خدمة احترافية ونتائج ممتازة. أنصح به بشدة!",
    treatment: "Dental Implants",
    treatmentAr: "زراعة الأسنان",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "3",
    name: "Fatima Hassan",
    nameAr: "فاطمة حسن",
    text: "The best dental experience I've ever had. Thank you Dr. Yousif!",
    textAr: "أفضل تجربة طب أسنان مررت بها. شكراً دكتور يوسف!",
    treatment: "Veneers",
    treatmentAr: "قشور الأسنان",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "4",
    name: "Noura Al-Sabah",
    nameAr: "نورة الصباح",
    text: "Amazing experience! Dr. Yousif is very professional.",
    textAr: "تجربة رائعة! الدكتور يوسف محترف جداً.",
    treatment: "Orthodontics",
    treatmentAr: "تقويم الأسنان",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5
  }
];

const ImageComparisonSlider = ({ 
  item,
  language,
  onDelete,
  onUpdate
}: { 
  item: BeforeAfterImage;
  language: string;
  onDelete: () => void;
  onUpdate: (updates: Partial<BeforeAfterImage>) => void;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const { isEditMode } = useEditable();

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const position = 'touches' in e 
      ? e.touches[0].clientX - container.left
      : e.clientX - container.left;
    
    const percentage = Math.max(0, Math.min(100, (position / container.width) * 100));
    setSliderPosition(percentage);
  };

  const title = language === 'ar' ? item.titleAr : item.title;
  const description = language === 'ar' ? item.descriptionAr : item.description;

  return (
    <div className="relative">
      {/* Delete button */}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 z-20">
          <DeleteContentButton onConfirm={onDelete} itemName="cette comparaison" />
        </div>
      )}

      {/* Editable Image Buttons */}
      {isEditMode && (
        <div className="flex justify-center gap-4 mb-3">
          <EditableImage
            sectionKey={`gallery_${item.id}`}
            field="before"
            defaultSrc={item.before}
            alt={`${title} - Before`}
            label={language === 'ar' ? 'تعديل قبل' : 'Edit Before'}
          />
          <EditableImage
            sectionKey={`gallery_${item.id}`}
            field="after"
            defaultSrc={item.after}
            alt={`${title} - After`}
            label={language === 'ar' ? 'تعديل بعد' : 'Edit After'}
          />
        </div>
      )}

      <div
        className="relative w-full aspect-[4/3] overflow-hidden rounded-lg cursor-col-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* After image (background) */}
        <img
          src={item.after}
          alt={`${title} - After`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={item.before}
            alt={`${title} - Before`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow">
            <ChevronLeft className="w-5 h-5 text-primary-foreground absolute left-1" />
            <ChevronRight className="w-5 h-5 text-primary-foreground absolute right-1" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
          {language === 'ar' ? 'قبل' : 'Before'}
        </div>
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium z-10">
          {language === 'ar' ? 'بعد' : 'After'}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-center">{title}</h3>
      <p className="text-sm text-muted-foreground text-center mt-2">{description}</p>
    </div>
  );
};

export const BeforeAfter = () => {
  const { t, language } = useLanguage();
  const { isEditMode } = useEditable();
  const [isPaused, setIsPaused] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [showAddTestimonialDialog, setShowAddTestimonialDialog] = useState(false);
  const [newImage, setNewImage] = useState({ title: "", titleAr: "", description: "", descriptionAr: "", before: "", after: "" });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", nameAr: "", text: "", textAr: "", treatment: "", treatmentAr: "", avatar: "" });

  const {
    items: beforeAfterImages,
    addItem: addImage,
    updateItem: updateImage,
    deleteItem: deleteImage,
  } = useDynamicContent<BeforeAfterImage>("gallery", "images", defaultBeforeAfterImages);

  const {
    items: testimonials,
    addItem: addTestimonial,
    updateItem: updateTestimonial,
    deleteItem: deleteTestimonial,
  } = useDynamicContent<Testimonial>("testimonials", "items", defaultTestimonials);

  const handleAddImage = () => {
    if (newImage.title && newImage.before && newImage.after) {
      addImage({
        ...newImage,
        before: newImage.before || "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800",
        after: newImage.after || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
      });
      setNewImage({ title: "", titleAr: "", description: "", descriptionAr: "", before: "", after: "" });
      setShowAddImageDialog(false);
    }
  };

  const handleAddTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      addTestimonial({
        ...newTestimonial,
        avatar: newTestimonial.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        rating: 5,
      });
      setNewTestimonial({ name: "", nameAr: "", text: "", textAr: "", treatment: "", treatmentAr: "", avatar: "" });
      setShowAddTestimonialDialog(false);
    }
  };

  const handleDeleteTestimonial = (id: string) => {
    console.log("handleDeleteTestimonial called with id:", id);
    deleteTestimonial(id);
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 overflow-hidden relative">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 glass-teal rounded-full mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-xs sm:text-sm font-semibold text-primary">{language === 'ar' ? 'النتائج' : 'Results'}</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
            <EditableText 
              sectionKey="gallery" 
              field="title" 
              defaultValue={t("beforeAfterTitle")}
              as="span"
            />
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            <EditableText 
              sectionKey="gallery" 
              field="subtitle" 
              defaultValue={t("beforeAfterSubtitle")}
              as="span"
            />
          </p>
        </motion.div>

        {/* Before/After Gallery */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {beforeAfterImages.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <ImageComparisonSlider
                item={item}
                language={language}
                onDelete={() => deleteImage(item.id)}
                onUpdate={(updates) => updateImage(item.id, updates)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Add Image Button */}
        {isEditMode && (
          <div className="flex justify-center mb-12 sm:mb-16 md:mb-20">
            <AddContentButton 
              onClick={() => setShowAddImageDialog(true)} 
              label={language === 'ar' ? 'إضافة مقارنة جديدة' : 'Add New Comparison'}
            />
          </div>
        )}

        {/* Testimonials Section */}
        <motion.div 
          className="mt-10 sm:mt-12 md:mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-foreground">
            {t("patientTestimonials")}
          </h3>
          
          {/* Add Testimonial Button */}
          {isEditMode && (
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <AddContentButton 
                onClick={() => setShowAddTestimonialDialog(true)} 
                label={language === 'ar' ? 'إضافة شهادة جديدة' : 'Add New Testimonial'}
              />
            </div>
          )}
          
          {/* Testimonials Display - Grid in edit mode, Scrolling otherwise */}
          {isEditMode ? (
            /* Static Grid for Edit Mode - easier to click delete buttons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  language={language}
                  isEditMode={isEditMode}
                  onDelete={handleDeleteTestimonial}
                  onUpdate={(id, updates) => updateTestimonial(id, updates)}
                />
              ))}
            </div>
          ) : (
            /* Scrolling Testimonials for normal view */
            <div className="space-y-6">
              <ScrollVelocity velocity={2} paused={isPaused} className="py-4">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard 
                    key={`${testimonial.id}-${index}`} 
                    testimonial={testimonial}
                    language={language}
                    isEditMode={false}
                    onDelete={handleDeleteTestimonial}
                    onUpdate={(id, updates) => updateTestimonial(id, updates)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  />
                ))}
              </ScrollVelocity>
              
              <ScrollVelocity velocity={-2} paused={isPaused} className="py-4">
                {[...testimonials, ...testimonials].reverse().map((testimonial, index) => (
                  <TestimonialCard 
                    key={`${testimonial.id}-rev-${index}`} 
                    testimonial={testimonial}
                    language={language}
                    isEditMode={false}
                    onDelete={handleDeleteTestimonial}
                    onUpdate={(id, updates) => updateTestimonial(id, updates)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  />
                ))}
              </ScrollVelocity>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Image Dialog */}
      <Dialog open={showAddImageDialog} onOpenChange={setShowAddImageDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une comparaison</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Titre (EN)"
              value={newImage.title}
              onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
            />
            <Input
              placeholder="Titre (AR)"
              value={newImage.titleAr}
              onChange={(e) => setNewImage({ ...newImage, titleAr: e.target.value })}
            />
            <Input
              placeholder="Description (EN)"
              value={newImage.description}
              onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
            />
            <Input
              placeholder="Description (AR)"
              value={newImage.descriptionAr}
              onChange={(e) => setNewImage({ ...newImage, descriptionAr: e.target.value })}
            />
            <ImageUploadField
              label="Image Before (Avant)"
              value={newImage.before}
              onChange={(url) => setNewImage({ ...newImage, before: url })}
              placeholder="Téléchargez l'image avant"
            />
            <ImageUploadField
              label="Image After (Après)"
              value={newImage.after}
              onChange={(url) => setNewImage({ ...newImage, after: url })}
              placeholder="Téléchargez l'image après"
            />
            <Button onClick={handleAddImage} className="w-full" disabled={!newImage.title || !newImage.before || !newImage.after}>
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Testimonial Dialog */}
      <Dialog open={showAddTestimonialDialog} onOpenChange={setShowAddTestimonialDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un témoignage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nom (EN)"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            />
            <Input
              placeholder="Nom (AR)"
              value={newTestimonial.nameAr}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, nameAr: e.target.value })}
            />
            <Input
              placeholder="Témoignage (EN)"
              value={newTestimonial.text}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
            />
            <Input
              placeholder="Témoignage (AR)"
              value={newTestimonial.textAr}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, textAr: e.target.value })}
            />
            <Input
              placeholder="Traitement (EN)"
              value={newTestimonial.treatment}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, treatment: e.target.value })}
            />
            <Input
              placeholder="Traitement (AR)"
              value={newTestimonial.treatmentAr}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, treatmentAr: e.target.value })}
            />
            <ImageUploadField
              label="Photo du patient"
              value={newTestimonial.avatar}
              onChange={(url) => setNewTestimonial({ ...newTestimonial, avatar: url })}
              placeholder="Téléchargez une photo"
            />
            <Button onClick={handleAddTestimonial} className="w-full" disabled={!newTestimonial.name || !newTestimonial.text}>
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
