import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CalendarDays, Clock, User, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { EditableText } from "@/components/admin/EditableText";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTransition } from "@/components/ui/SectionTransition";
import { cn } from "@/lib/utils";

export const Booking = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<{ slot_time: string; is_available: boolean }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error('Failed to submit appointment. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: language === 'ar' ? 'التاريخ والوقت' : 'Date & Time', icon: CalendarDays },
    { number: 2, label: language === 'ar' ? 'معلوماتك' : 'Your Info', icon: User },
    { number: 3, label: language === 'ar' ? 'تأكيد' : 'Confirm', icon: CheckCircle2 },
  ];

  const canProceedStep1 = selectedDate && formData.time && formData.service;
  const canProceedStep2 = formData.name && formData.phone && formData.email;

  return (
    <>
      <SectionTransition variant="dark-to-white" />
      
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden relative bg-background">
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {language === 'ar' ? 'احجز موعدك' : 'Book Appointment'}
            </motion.span>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-foreground leading-tight mb-4">
              <EditableText 
                sectionKey="booking" 
                field="title" 
                defaultValue={language === 'ar' ? 'حدد موعد زيارتك' : 'Schedule Your Visit'}
                as="span"
              />
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              {language === 'ar' 
                ? 'احجز موعدك الآن واحصل على أفضل رعاية للأسنان'
                : 'Book your appointment in just a few simple steps'}
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div 
            className="flex justify-center mb-6 sm:mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.number)}
                      className={cn("px-2.5 py-1.5 sm:px-4 sm:py-2",
                        "flex items-center gap-1 sm:gap-2 rounded-full transition-all duration-300",
                        currentStep === step.number 
                          ? "bg-primary text-primary-foreground" 
                          : currentStep > step.number 
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      <step.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline text-xs sm:text-sm font-medium">{step.label}</span>
                      <span className="sm:hidden text-xs font-medium">{step.number}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 md:w-16 h-0.5 mx-2",
                      currentStep > step.number ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-elevated border border-border">
              
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Service Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      {language === 'ar' ? 'الخدمة المطلوبة' : 'Service Needed'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { value: "implants", labelEn: "Dental Implants", labelAr: "زراعة الأسنان" },
                        { value: "cosmetic", labelEn: "Cosmetic", labelAr: "تجميل الأسنان" },
                        { value: "orthodontics", labelEn: "Orthodontics", labelAr: "تقويم الأسنان" },
                        { value: "root-canal", labelEn: "Root Canal", labelAr: "علاج قناة الجذر" },
                        { value: "cleaning", labelEn: "Cleaning", labelAr: "تنظيف وفحص" },
                        { value: "emergency", labelEn: "Emergency", labelAr: "رعاية طوارئ" },
                      ].map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => handleChange("service", service.value)}
                            className={cn("text-xs sm:text-sm",
                            "p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 font-medium transition-all duration-200",
                            formData.service === service.value 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-border bg-background hover:border-primary/50 text-foreground"
                          )}
                        >
                          {language === 'ar' ? service.labelAr : service.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                    {/* Calendar */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        {language === 'ar' ? 'اختر التاريخ' : 'Select Date'}
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
                          className="rounded-xl border border-border bg-background p-3 pointer-events-auto"
                        />
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {language === 'ar' ? 'اختر الوقت' : 'Select Time'}
                      </label>
                      {!selectedDate ? (
                        <div className="flex items-center justify-center h-48 bg-muted/30 rounded-xl border border-dashed border-border">
                          <p className="text-sm text-muted-foreground text-center px-4">
                            {language === 'ar' ? 'يرجى اختيار التاريخ أولاً' : 'Please select a date first'}
                          </p>
                        </div>
                      ) : isLoadingSlots ? (
                        <div className="flex items-center justify-center h-48 bg-muted/30 rounded-xl">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="flex items-center justify-center h-48 bg-muted/30 rounded-xl border border-dashed border-border">
                          <p className="text-sm text-muted-foreground text-center px-4">
                            {language === 'ar' ? 'لا توجد مواعيد متاحة' : 'No available slots'}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.slot_time}
                              type="button"
                              disabled={!slot.is_available}
                              onClick={() => handleChange("time", slot.slot_time)}
                              className={cn(
                                "p-3 rounded-lg text-sm font-medium transition-all duration-200",
                                !slot.is_available 
                                  ? "bg-muted/50 text-muted-foreground cursor-not-allowed line-through" 
                                  : formData.time === slot.slot_time 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-background border border-border hover:border-primary text-foreground"
                              )}
                            >
                              {slot.slot_time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      disabled={!canProceedStep1}
                      onClick={() => setCurrentStep(2)}
                      className={cn(
                        "px-8 py-3 rounded-xl font-semibold transition-all duration-300",
                        canProceedStep1 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      {language === 'ar' ? 'التالي' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      </label>
                      <Input 
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        className="bg-background border-border h-12 rounded-xl"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <Input 
                        placeholder="+965 XXXX XXXX" 
                        className="bg-background border-border h-12 rounded-xl"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <Input 
                      type="email" 
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      className="bg-background border-border h-12 rounded-xl"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {language === 'ar' ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (optional)'}
                    </label>
                    <Textarea 
                      placeholder={language === 'ar' ? 'أي معلومات إضافية' : 'Any additional information'}
                      rows={3}
                      className="bg-background border-border rounded-xl resize-none"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {language === 'ar' ? 'السابق' : 'Back'}
                    </button>
                    <button
                      type="button"
                      disabled={!canProceedStep2}
                      onClick={() => setCurrentStep(3)}
                      className={cn(
                        "px-8 py-3 rounded-xl font-semibold transition-all duration-300",
                        canProceedStep2 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      {language === 'ar' ? 'التالي' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {language === 'ar' ? 'تأكيد الموعد' : 'Confirm Your Appointment'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'راجع تفاصيل موعدك' : 'Review your appointment details'}
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'التاريخ' : 'Date'}</p>
                          <p className="font-medium text-foreground">
                            {selectedDate ? format(selectedDate, 'PPP') : '-'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الوقت' : 'Time'}</p>
                          <p className="font-medium text-foreground">{formData.time || '-'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الخدمة' : 'Service'}</p>
                          <p className="font-medium text-foreground capitalize">{formData.service.replace('-', ' ') || '-'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الاسم' : 'Name'}</p>
                          <p className="font-medium text-foreground">{formData.name || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {language === 'ar' ? 'السابق' : 'Back'}
                    </button>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 flex items-center gap-2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <SectionTransition variant="white-to-dark" />
    </>
  );
};
