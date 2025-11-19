import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        {/* After Image */}
        <img
          src={after}
          alt={`${title} - After`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Before Image with Clip */}
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

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow">
            <ChevronLeft className="w-5 h-5 text-primary-foreground absolute left-1" />
            <ChevronRight className="w-5 h-5 text-primary-foreground absolute right-1" />
          </div>
        </div>

        {/* Labels */}
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
    <section className="vibe-section py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-vibe-cyan bg-clip-text text-transparent">
            {t("beforeAfterTitle")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("beforeAfterSubtitle")}
          </p>
        </div>

        {/* Before/After Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {beforeAfterImages.map((item, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ImageComparisonSlider
                before={item.before}
                after={item.after}
                title={item.title}
              />
              <p className="text-sm text-muted-foreground text-center mt-2">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
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
        </div>
      </div>
    </section>
  );
};
