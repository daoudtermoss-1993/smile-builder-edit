import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
        : "Demande de rendez-vous envoyée! Le docteur va la réviser et vous confirmer par WhatsApp.");
      
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
    <section className="py-20 overflow-hidden relative min-h-screen flex items-center">
      <div className="container mx-auto px-4 relative z-10">
        {/* Content positioned to the left (3D object on right) */}
        <div className="max-w-xl ml-0">
        <motion.div 
          className="text-center mb-12"
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
            <EditableText 
              sectionKey="booking" 
              field="badge" 
              defaultValue={language === 'ar' ? 'حجز موعد' : 'Book Appointment'}
              className="text-sm font-semibold text-primary"
            />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
            <EditableText 
              sectionKey="booking" 
              field="title" 
              defaultValue={language === 'ar' ? 'حدد موعد زيارتك' : 'Schedule Your Visit'}
              as="span"
            />
          </h2>
        </motion.div>
        
        <motion.div 
          className="vibe-card"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <Input 
                  placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  className="bg-background/50 border-primary/20"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                <Input 
                  placeholder="+965 XXXX XXXX" 
                  className="bg-background/50 border-primary/20"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}</label>
              <Input 
                type="email" 
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="bg-background/50 border-primary/20"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'الخدمة المطلوبة *' : 'Service Needed *'}</label>
              <Select value={formData.service} onValueChange={(value) => handleChange("service", value)} required>
                <SelectTrigger className="bg-background/50 border-primary/20">
                  <SelectValue placeholder={language === 'ar' ? 'اختر خدمة' : 'Select a service'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="implants">{language === 'ar' ? 'زراعة الأسنان' : 'Dental Implants'}</SelectItem>
                  <SelectItem value="cosmetic">{language === 'ar' ? 'تجميل الأسنان' : 'Cosmetic Dentistry'}</SelectItem>
                  <SelectItem value="orthodontics">{language === 'ar' ? 'تقويم الأسنان' : 'Orthodontics'}</SelectItem>
                  <SelectItem value="root-canal">{language === 'ar' ? 'علاج قناة الجذر' : 'Root Canal Treatment'}</SelectItem>
                  <SelectItem value="cleaning">{language === 'ar' ? 'تنظيف وفحص' : 'Cleaning & Check-ups'}</SelectItem>
                  <SelectItem value="emergency">{language === 'ar' ? 'رعاية طوارئ' : 'Emergency Care'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'اختر التاريخ *' : 'Select Date *'}</label>
                <div className="flex justify-center overflow-x-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const day = date.getDay();
                      return day === 0 || day === 6 || date < new Date();
                    }}
                    className="rounded-md border border-primary/20 bg-background/50 w-full max-w-[300px]"
                  />
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'اختر الوقت *' : 'Select Time *'}</label>
                {!selectedDate ? (
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'يرجى اختيار التاريخ أولاً' : 'Please select a date first'}</p>
                ) : isLoadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'لا توجد مواعيد متاحة لهذا التاريخ' : 'No available slots for this date'}</p>
                ) : (
                  <>
                    <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder={language === 'ar' ? 'اختر موعداً' : 'Choose a time slot'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem 
                            key={slot.slot_time} 
                            value={slot.slot_time}
                            disabled={!slot.is_available}
                            className={!slot.is_available ? "opacity-50" : ""}
                          >
                            <span className="flex items-center justify-between w-full gap-2">
                              <span>{slot.slot_time}</span>
                              {!slot.is_available ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                                  {language === 'ar' ? 'محجوز' : 'Réservé'}
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                                  {language === 'ar' ? 'متاح' : 'Disponible'}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableSlots.every(slot => !slot.is_available) && (
                      <p className="text-sm text-destructive mt-2">
                        ⚠️ {language === 'ar' ? 'جميع المواعيد محجوزة لهذا التاريخ. يرجى اختيار تاريخ آخر.' : 'All time slots are fully booked for this date. Please select another date.'}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
              <Textarea 
                placeholder={language === 'ar' ? 'أي معلومات إضافية أو متطلبات خاصة' : 'Any additional information or special requirements'}
                rows={4}
                className="bg-background/50 border-primary/20"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
            
            <button type="submit" className="vibe-btn vibe-glow w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                </>
              ) : (
                language === 'ar' ? 'حجز موعد' : 'Book Appointment'
              )}
            </button>
          </form>
        </motion.div>
        </div>
      </div>
    </section>
  );
};