import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

export function ContactSection() {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error(language === 'ar' ? 'يرجى ملء الحقول المطلوبة' : "Please fill in required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.notes,
        source: 'contact_form'
      });

      if (error) throw error;

      toast.success(language === 'ar' 
        ? "شكراً! سنتواصل معك قريباً." 
        : "Thank you! We'll be in touch soon.");
      
      setFormData({ name: "", phone: "", email: "", service: "", notes: "" });
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(language === 'ar' ? 'فشل الإرسال' : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative">
      {/* White Form Section */}
      <div className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                {language === 'ar' 
                  ? 'تواصل معنا لمعرفة المزيد عن خدماتنا أو لحجز موعد:'
                  : 'Reach out to learn more about our services or to schedule an appointment:'}
              </p>

              <div className="space-y-6">
                {[
                  { icon: MapPin, label: language === 'ar' ? 'العنوان' : 'Address', value: language === 'ar' ? 'مدينة الكويت، الكويت' : 'Kuwait City, Kuwait' },
                  { icon: Phone, label: language === 'ar' ? 'الهاتف' : 'Phone', value: '+965 6111 2299' },
                  { icon: Mail, label: language === 'ar' ? 'البريد' : 'Email', value: 'info@dryousifgerman.com' },
                  { icon: Clock, label: language === 'ar' ? 'ساعات العمل' : 'Hours', value: language === 'ar' ? 'السبت - الخميس: 9ص - 8م' : 'Sat-Thu: 9AM-8PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-gray-900 font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <Input 
                    placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                    className="border-gray-200 focus:border-primary"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                  </label>
                  <Input 
                    type="email"
                    placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'name@email.com'}
                    className="border-gray-200 focus:border-primary"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <Input 
                    placeholder="+965 XXXX XXXX"
                    className="border-gray-200 focus:border-primary"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    {language === 'ar' ? 'كيف يمكننا المساعدة؟ *' : 'How Can We Help? *'}
                  </label>
                  <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder={language === 'ar' ? 'اختر خيار' : 'Select options'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">{language === 'ar' ? 'حجز استشارة' : 'Schedule a consultation'}</SelectItem>
                      <SelectItem value="implants">{language === 'ar' ? 'زراعة الأسنان' : 'Dental Implants'}</SelectItem>
                      <SelectItem value="cosmetic">{language === 'ar' ? 'تجميل الأسنان' : 'Cosmetic Dentistry'}</SelectItem>
                      <SelectItem value="other">{language === 'ar' ? 'شيء آخر' : 'Something else'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    language === 'ar' ? 'حفظ والمتابعة' : 'SAVE & CONTINUE'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Curved Transition to Dark */}
      <div className="relative">
        <svg 
          viewBox="0 0 1440 120" 
          className="w-full h-24 md:h-32 fill-[hsl(175_25%_8%)]"
          preserveAspectRatio="none"
        >
          <path d="M0,120 C480,40 960,40 1440,120 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Dark Footer Section */}
      <div className="bg-[hsl(175_25%_8%)] py-24 -mt-1">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            {language === 'ar' 
              ? 'مستقبل ابتسامتك يبدأ هنا.'
              : 'The future of your smile starts here.'}
          </motion.h2>
          
          <motion.a
            href="#booking"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mt-8 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            {language === 'ar' ? 'احجز موعدك الآن' : 'Book Your Appointment Now'}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
