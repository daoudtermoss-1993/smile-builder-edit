import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { servicesData, getServiceById } from "@/data/servicesData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Clock, DollarSign, CheckCircle, Calendar } from "lucide-react";
import { InteractiveImageAccordion, type AccordionItemData } from "@/components/ui/interactive-image-accordion";
import { EditableText } from "@/components/admin/EditableText";
import { EditableImage } from "@/components/admin/EditableImage";
const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const service = getServiceById(serviceId || '');

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'الخدمة غير موجودة' : 'Service not found'}
          </h1>
          <Button onClick={() => navigate('/')}>
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const otherServices = servicesData.filter(s => s.id !== serviceId);

  // Create accordion items from other services
  const accordionItems: AccordionItemData[] = useMemo(() => {
    return servicesData.map((s, index) => ({
      id: index + 1,
      title: language === 'ar' ? s.titleAr : s.titleEn,
      imageUrl: s.image
    }));
  }, [language]);

  const scrollToBooking = () => {
    navigate('/#booking');
    setTimeout(() => {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Global gradient background - same as main page */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(180 60% 97%) 0%, 
              hsl(180 40% 98%) 15%,
              hsl(0 0% 100%) 30%,
              hsl(180 30% 98%) 50%,
              hsl(0 0% 100%) 70%,
              hsl(180 40% 97%) 85%,
              hsl(180 50% 96%) 100%
            )
          `
        }}
      />
      
      {/* Decorative gradient orbs */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/[0.02] blur-[120px] -z-10 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/#services" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {language === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-vibe flex items-center justify-center mb-6">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">
                <EditableText
                  sectionKey={`service-${serviceId}`}
                  field="title"
                  defaultValue={language === 'ar' ? service.titleAr : service.titleEn}
                  as="span"
                />
              </h1>
              <p className="text-xl text-foreground/80 mb-8">
                <EditableText
                  sectionKey={`service-${serviceId}`}
                  field="description"
                  defaultValue={language === 'ar' ? service.fullDescriptionAr : service.fullDescriptionEn}
                  as="span"
                />
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <EditableText
                    sectionKey={`service-${serviceId}`}
                    field="price"
                    defaultValue={language === 'ar' ? service.priceRangeAr : service.priceRange}
                    as="span"
                    className="font-semibold"
                  />
                </div>
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
                  <Clock className="h-5 w-5 text-primary" />
                  <EditableText
                    sectionKey={`service-${serviceId}`}
                    field="duration"
                    defaultValue={language === 'ar' ? service.durationAr : service.duration}
                    as="span"
                  />
                </div>
              </div>

              <Button 
                onClick={scrollToBooking}
                size="lg" 
                className="bg-gradient-vibe hover:opacity-90 text-white"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'احجز موعدك الآن' : 'Book Your Appointment'}
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <EditableImage
                  sectionKey={`service-${serviceId}`}
                  field="image"
                  defaultSrc={service.image}
                  alt={language === 'ar' ? service.titleAr : service.titleEn}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-vibe rounded-2xl opacity-20 blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary rounded-2xl opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            <EditableText
              sectionKey={`service-${serviceId}`}
              field="benefits_title"
              defaultValue={language === 'ar' ? 'فوائد العلاج' : 'Treatment Benefits'}
              as="span"
            />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <EditableText
                    sectionKey={`service-${serviceId}`}
                    field={`benefit_${index}`}
                    defaultValue={language === 'ar' ? benefit.ar : benefit.en}
                    as="span"
                    className="text-foreground"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      {service.beforeAfterImages.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-12 text-center">
              <EditableText
                sectionKey={`service-${serviceId}`}
                field="beforeafter_title"
                defaultValue={language === 'ar' ? 'قبل وبعد' : 'Before & After'}
                as="span"
              />
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.beforeAfterImages.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="grid grid-cols-2">
                    <div className="relative h-48">
                      <EditableImage
                        sectionKey={`service-${serviceId}`}
                        field={`before_${index}`}
                        defaultSrc={item.before}
                        alt="Before"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                        {language === 'ar' ? 'قبل' : 'Before'}
                      </span>
                    </div>
                    <div className="relative h-48">
                      <EditableImage
                        sectionKey={`service-${serviceId}`}
                        field={`after_${index}`}
                        defaultSrc={item.after}
                        alt="After"
                      />
                      <span className="absolute bottom-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded z-10">
                        {language === 'ar' ? 'بعد' : 'After'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <EditableText
                      sectionKey={`service-${serviceId}`}
                      field={`caption_${index}`}
                      defaultValue={language === 'ar' ? item.captionAr : item.captionEn}
                      as="p"
                      className="text-sm text-muted-foreground text-center"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Accordion Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            {language === 'ar' ? 'خدماتنا' : 'Our Services'}
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            {language === 'ar' ? 'استكشف جميع خدماتنا' : 'Explore all our dental services'}
          </p>
          <InteractiveImageAccordion 
            items={accordionItems} 
            defaultActiveIndex={servicesData.findIndex(s => s.id === serviceId)}
            onItemClick={(index) => navigate(`/services/${servicesData[index].id}`)}
          />
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            <EditableText
              sectionKey={`service-${serviceId}`}
              field="cta_title"
              defaultValue={language === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
              as="span"
            />
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            <EditableText
              sectionKey={`service-${serviceId}`}
              field="cta_description"
              defaultValue={language === 'ar' 
                ? 'احجز موعدك اليوم واحصل على استشارة مجانية مع الدكتور يوسف جيرمان'
                : 'Book your appointment today and get a free consultation with Dr. Yousif German'}
              as="span"
            />
          </p>
          <Button 
            onClick={scrollToBooking}
            size="lg" 
            className="bg-gradient-vibe hover:opacity-90 text-white"
          >
            <Calendar className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'احجز الآن' : 'Book Now'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
