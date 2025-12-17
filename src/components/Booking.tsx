import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const Booking = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ slot_time: string; is_available: boolean }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const { data, error } = await supabase.rpc('get_available_slots', {
        check_date: format(date, 'yyyy-MM-dd')
      });

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.service || !selectedDate || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { appointmentSchema } = await import('@/lib/validation');
      const validationResult = appointmentSchema.safeParse({
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd')
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        return;
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Invalid input. Please check your information.");
      return;
    }

    const selectedSlot = availableSlots.find(slot => slot.slot_time === formData.time);
    if (!selectedSlot || !selectedSlot.is_available) {
      toast.error("Sorry, this time slot is no longer available. Please select another time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-booking-notification', {
        body: {
          ...formData,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });

      if (error) {
        console.error('Booking function error:', error);
        const anyError = error as any;
        const status =
          anyError?.status ??
          anyError?.context?.status ??
          anyError?.context?.response?.status;
        const message: string = (anyError?.message ?? '').toString().toLowerCase();

        if (status === 409 || message.includes('already has an appointment')) {
          toast.error(
            "You already have an appointment booked this week. Patients can only book one appointment per week.",
          );
          return;
        }

        if (status === 429 || message.includes('too many requests')) {
          toast.error(
            'Too many booking attempts in a short time. Please wait a few minutes and try again.',
          );
          return;
        }

        throw error;
      }

      toast.success(language === 'ar' 
        ? "تم إرسال طلب الموعد! سيقوم الدكتور بمراجعته وتأكيده قريباً." 
        : "Appointment request sent! The doctor will review and confirm via WhatsApp.");
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        time: "",
        notes: "",
      });
      setSelectedDate(undefined);
      setAvailableSlots([]);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error('Failed to submit appointment. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-32 md:py-40 overflow-hidden relative min-h-screen flex items-center">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section header - mont-fort style */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-light tracking-[0.4em] text-slate-400 uppercase mb-6 block">
              {language === 'ar' ? 'حجز موعد' : 'Book Appointment'}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.1em] text-slate-800 mb-6">
              <EditableText 
                sectionKey="booking" 
                field="title" 
                defaultValue={language === 'ar' ? 'حدد موعد زيارتك' : 'Schedule Your Visit'}
                as="span"
              />
            </h2>
            <div className="w-16 h-px bg-primary/40 mx-auto" />
          </motion.div>
          
          {/* Form card - minimal glassmorphism */}
          <motion.div 
            className="bg-white/60 backdrop-blur-xl border border-slate-200/50 p-8 md:p-12"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </label>
                  <Input 
                    placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    className="bg-transparent border-0 border-b border-slate-200 rounded-none px-0 focus:border-primary focus:ring-0 font-light"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                  </label>
                  <Input 
                    placeholder="+965 XXXX XXXX" 
                    className="bg-transparent border-0 border-b border-slate-200 rounded-none px-0 focus:border-primary focus:ring-0 font-light"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <Input 
                  type="email" 
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="bg-transparent border-0 border-b border-slate-200 rounded-none px-0 focus:border-primary focus:ring-0 font-light"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                  {language === 'ar' ? 'الخدمة المطلوبة' : 'Service Needed'} *
                </label>
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)} required>
                  <SelectTrigger className="bg-transparent border-0 border-b border-slate-200 rounded-none px-0 focus:border-primary focus:ring-0 font-light">
                    <SelectValue placeholder={language === 'ar' ? 'اختر خدمة' : 'Select a service'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="implants">{language === 'ar' ? 'زراعة الأسنان' : 'Dental Implants'}</SelectItem>
                    <SelectItem value="cosmetic">{language === 'ar' ? 'تجميل الأسنان' : 'Cosmetic Dentistry'}</SelectItem>
                    <SelectItem value="orthodontics">{language === 'ar' ? 'تقويم الأسنان' : 'Orthodontics'}</SelectItem>
                    <SelectItem value="root-canal">{language === 'ar' ? 'علاج قناة الجذر' : 'Root Canal'}</SelectItem>
                    <SelectItem value="cleaning">{language === 'ar' ? 'تنظيف وفحص' : 'Cleaning & Check-ups'}</SelectItem>
                    <SelectItem value="emergency">{language === 'ar' ? 'رعاية طوارئ' : 'Emergency Care'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                    {language === 'ar' ? 'اختر التاريخ' : 'Select Date'} *
                  </label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const day = date.getDay();
                        return day === 0 || day === 6 || date < new Date();
                      }}
                      className="border border-slate-200 bg-white/50"
                    />
                  </div>
                </div>
                  
                <div className="space-y-3">
                  <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                    {language === 'ar' ? 'اختر الوقت' : 'Select Time'} *
                  </label>
                  {!selectedDate ? (
                    <p className="text-sm font-light text-slate-400">{language === 'ar' ? 'يرجى اختيار التاريخ أولاً' : 'Please select a date first'}</p>
                  ) : isLoadingSlots ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm font-light text-slate-400">{language === 'ar' ? 'لا توجد مواعيد متاحة' : 'No available slots'}</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.slot_time}
                          type="button"
                          onClick={() => slot.is_available && handleChange("time", slot.slot_time)}
                          disabled={!slot.is_available}
                          className={`py-3 px-4 text-sm font-light border transition-all duration-300 ${
                            formData.time === slot.slot_time
                              ? 'border-primary bg-primary text-white'
                              : slot.is_available
                                ? 'border-slate-200 hover:border-primary text-slate-600'
                                : 'border-slate-100 text-slate-300 cursor-not-allowed'
                          }`}
                        >
                          {slot.slot_time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-light tracking-[0.15em] text-slate-500 uppercase">
                  {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
                </label>
                <Textarea 
                  placeholder={language === 'ar' ? 'أي معلومات إضافية' : 'Any additional information'}
                  rows={3}
                  className="bg-transparent border-0 border-b border-slate-200 rounded-none px-0 focus:border-primary focus:ring-0 font-light resize-none"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
              
              <motion.button 
                type="submit" 
                className="group w-full py-5 px-8 text-sm font-light tracking-[0.2em] uppercase bg-primary text-white hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-3"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {language === 'ar' ? 'حجز موعد' : 'Book Appointment'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};