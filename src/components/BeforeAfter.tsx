import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";

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
}

const ImageComparisonSlider = ({ before, after, title }: { before: string; after: string; title: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

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
    <div className="relative group">
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
        <img
          src={after}
          alt={`${title} - After`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={before}
            alt={`${title} - Before`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow">
            <ChevronLeft className="w-5 h-5 text-primary-foreground absolute left-1" />
            <ChevronRight className="w-5 h-5 text-primary-foreground absolute right-1" />
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          After
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-center">{title}</h3>
    </div>
  );
};

export const BeforeAfter = () => {
  const { t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
      treatment: t("teethWhitening")
    },
    {
      name: t("testimonial2Name"),
      text: t("testimonial2Text"),
      treatment: t("dentalImplants")
    },
    {
      name: t("testimonial3Name"),
      text: t("testimonial3Text"),
      treatment: t("veneers")
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 overflow-hidden">
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
            <span className="text-sm font-semibold text-primary">Results</span>
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
              />
              <p className="text-sm text-muted-foreground text-center mt-2">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("patientTestimonials")}
          </h3>
          
          <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <Quote className="w-12 h-12 text-primary/20 mb-6" />
              
              <div className="min-h-[200px] flex flex-col justify-center">
                <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{testimonials[currentTestimonial].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].treatment}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? "bg-primary w-8"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};