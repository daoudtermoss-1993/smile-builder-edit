import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { servicesData, getServiceById } from "@/data/servicesData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Clock, DollarSign, CheckCircle, Calendar } from "lucide-react";
import { Footer } from "@/components/Footer";

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
                {language === 'ar' ? service.titleAr : service.titleEn}
              </h1>
              <p className="text-xl text-foreground/80 mb-8">
                {language === 'ar' ? service.fullDescriptionAr : service.fullDescriptionEn}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{language === 'ar' ? service.priceRangeAr : service.priceRange}</span>
                </div>
                <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-full border border-border">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{language === 'ar' ? service.durationAr : service.duration}</span>
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
                <img 
                  src={service.image} 
                  alt={language === 'ar' ? service.titleAr : service.titleEn}
                  className="w-full h-full object-cover"
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
            {language === 'ar' ? 'فوائد العلاج' : 'Treatment Benefits'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground">
                    {language === 'ar' ? benefit.ar : benefit.en}
                  </span>
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
              {language === 'ar' ? 'قبل وبعد' : 'Before & After'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.beforeAfterImages.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img src={item.before} alt="Before" className="w-full h-48 object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {language === 'ar' ? 'قبل' : 'Before'}
                      </span>
                    </div>
                    <div className="relative">
                      <img src={item.after} alt="After" className="w-full h-48 object-cover" />
                      <span className="absolute bottom-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        {language === 'ar' ? 'بعد' : 'After'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      {language === 'ar' ? item.captionAr : item.captionEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Services Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            {language === 'ar' ? 'خدمات أخرى' : 'Other Services'}
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            {language === 'ar' ? 'استكشف خدماتنا الأخرى' : 'Explore our other dental services'}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.map((otherService) => {
              const OtherIcon = otherService.icon;
              return (
                <Link 
                  key={otherService.id} 
                  to={`/services/${otherService.id}`}
                  className="group"
                >
                  <Card className="h-full bg-card/50 backdrop-blur border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={otherService.image} 
                        alt={language === 'ar' ? otherService.titleAr : otherService.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-vibe flex items-center justify-center">
                          <OtherIcon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {language === 'ar' ? otherService.titleAr : otherService.titleEn}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {language === 'ar' ? otherService.descriptionAr : otherService.descriptionEn}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                        {language === 'ar' ? 'اعرف المزيد' : 'Learn more'}
                        {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            {language === 'ar' ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'احجز موعدك اليوم واحصل على استشارة مجانية مع الدكتور يوسف جيرمان'
              : 'Book your appointment today and get a free consultation with Dr. Yousif German'}
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

      <Footer />
    </div>
  );
};

export default ServiceDetail;
