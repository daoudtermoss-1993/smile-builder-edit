import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
import { useEditable } from "@/contexts/EditableContext";
import { motion } from "framer-motion";
import { ScrollVelocity } from "@/components/ui/scroll-velocity";

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  text: string;
  treatment: string;
  avatar: string;
  rating: number;
}

const ImageComparisonSlider = ({ 
  before, 
  after, 
  title, 
  language,
  index 
}: { 
  before: string; 
  after: string; 
  title: string; 
  language: string;
  index: number;
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const { isEditMode, getSectionContent, loadSectionContent } = useEditable();

  useEffect(() => {
    loadSectionContent("gallery");
  }, [loadSectionContent]);

  const sectionContent = getSectionContent("gallery");
  const beforeSrc = sectionContent[`before_${index}`] || before;
  const afterSrc = sectionContent[`after_${index}`] || after;

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;
    
    const container = e.currentTarget.getBoundingClientRect();
    const position = 'touches' in e 
      ? e.touches[0].clientX - container.left
      : e.clientX - container.left;
    
    const percentage = Math.max(0, Math.min(100, (position / container.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="relative">
      {/* Editable Image Buttons - Outside slider */}
      {isEditMode && (
        <div className="flex justify-center gap-4 mb-3">
          <EditableImage
            sectionKey="gallery"
            field={`before_${index}`}
            defaultSrc={before}
            alt={`${title} - Before`}
            label={language === 'ar' ? 'تعديل قبل' : 'Edit Before'}
          />
          <EditableImage
            sectionKey="gallery"
            field={`after_${index}`}
            defaultSrc={after}
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
          src={afterSrc}
          alt={`${title} - After`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeSrc}
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
    </div>
  );
};

export const BeforeAfter = () => {
  const { t, language } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const beforeAfterImages: BeforeAfterImage[] = [
    {
      before: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop",
      title: t("teethWhitening"),
      description: t("teethWhiteningDesc")
    },
    {
      before: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop",
      title: t("dentalImplants"),
      description: t("dentalImplantsDesc")
    },
    {
      before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop",
      after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format&fit=crop",
      title: t("veneers"),
      description: t("veneersDesc")
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: t("testimonial1Name"),
      text: t("testimonial1Text"),
      treatment: t("teethWhitening"),
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: t("testimonial2Name"),
      text: t("testimonial2Text"),
      treatment: t("dentalImplants"),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: t("testimonial3Name"),
      text: t("testimonial3Text"),
      treatment: t("veneers"),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: language === 'ar' ? "نورة الصباح" : "Noura Al-Sabah",
      text: language === 'ar' ? "تجربة رائعة! الدكتور يوسف محترف جداً والنتيجة أفضل مما توقعت." : "Amazing experience! Dr. Yousif is very professional and the result exceeded my expectations.",
      treatment: language === 'ar' ? "تقويم الأسنان" : "Orthodontics",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: language === 'ar' ? "عبدالله المطيري" : "Abdullah Al-Mutairi",
      text: language === 'ar' ? "أفضل عيادة أسنان في الكويت. العناية والاهتمام بالتفاصيل لا مثيل لهما." : "Best dental clinic in Kuwait. The care and attention to detail is unmatched.",
      treatment: language === 'ar' ? "زراعة الأسنان" : "Dental Implants",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: language === 'ar' ? "مريم الفهد" : "Mariam Al-Fahad",
      text: language === 'ar' ? "ابتسامتي الجديدة غيرت حياتي! شكراً دكتور يوسف على العمل الرائع." : "My new smile changed my life! Thank you Dr. Yousif for the amazing work.",
      treatment: language === 'ar' ? "تبييض الأسنان" : "Teeth Whitening",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  const TestimonialCard = ({ testimonial, cardIndex }: { testimonial: Testimonial; cardIndex: number }) => (
    <Card 
      className="inline-block w-[350px] md:w-[400px] border-primary/20 bg-card/50 backdrop-blur-sm shrink-0 transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30">
            <EditableImage
              sectionKey="testimonials"
              field={`avatar_${cardIndex}`}
              defaultSrc={testimonial.avatar}
              alt={testimonial.name}
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <EditableText
              sectionKey="testimonials"
              field={`name_${cardIndex}`}
              defaultValue={testimonial.name}
              as="p"
              className="font-semibold text-base normal-case tracking-normal"
            />
            <div className="flex gap-0.5">{renderStars(testimonial.rating)}</div>
          </div>
          <Quote className="w-8 h-8 text-primary/30" />
        </div>
        <EditableText
          sectionKey="testimonials"
          field={`text_${cardIndex}`}
          defaultValue={`"${testimonial.text}"`}
          as="p"
          className="text-sm md:text-base text-foreground mb-4 leading-relaxed normal-case tracking-normal whitespace-normal"
        />
        <div className="border-t border-border/50 pt-3">
          <EditableText
            sectionKey="testimonials"
            field={`treatment_${cardIndex}`}
            defaultValue={testimonial.treatment}
            as="p"
            className="text-xs text-muted-foreground normal-case tracking-normal"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block px-6 py-2 glass-teal rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-semibold text-primary">{language === 'ar' ? 'النتائج' : 'Results'}</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            <EditableText 
              sectionKey="gallery" 
              field="title" 
              defaultValue={t("beforeAfterTitle")}
              as="span"
            />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          {beforeAfterImages.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <ImageComparisonSlider
                before={item.before}
                after={item.after}
                title={item.title}
                language={language}
                index={index}
              />
              <p className="text-sm text-muted-foreground text-center mt-2">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section with Scroll Velocity */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("patientTestimonials")}
          </h3>
          
          {/* Scrolling Testimonials */}
          <div className="space-y-6">
            <ScrollVelocity velocity={2} paused={isPaused} className="py-4">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} cardIndex={index % testimonials.length} />
              ))}
            </ScrollVelocity>
            
            <ScrollVelocity velocity={-2} paused={isPaused} className="py-4">
              {[...testimonials, ...testimonials].reverse().map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} cardIndex={index % testimonials.length} />
              ))}
            </ScrollVelocity>
          </div>
        </motion.div>
      </div>
    </section>
  );
};