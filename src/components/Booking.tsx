import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export const Booking = () => {
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
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.email || !formData.service || !selectedDate || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    // SECURITY: Validate input with zod schema
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

    // Check if selected time slot is still available
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

        // Unknown error from the booking function – let the catch block handle it
        throw error;
      }

      toast.success("Appointment request sent! We'll contact you shortly via WhatsApp.");
      
      // Reset form
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
    <section className="vibe-section py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30 mb-6">
            <span className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent">Book Appointment</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-vibe bg-clip-text text-transparent">
            Schedule Your Visit
          </h2>
        </div>
        
        <div className="vibe-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input 
                  placeholder="Enter your full name" 
                  className="bg-background/50 border-primary/20"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number *</label>
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
              <label className="text-sm font-medium text-foreground">Email *</label>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background/50 border-primary/20"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Needed *</label>
              <Select value={formData.service} onValueChange={(value) => handleChange("service", value)} required>
                <SelectTrigger className="bg-background/50 border-primary/20">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="implants">Dental Implants</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic Dentistry</SelectItem>
                  <SelectItem value="orthodontics">Orthodontics</SelectItem>
                  <SelectItem value="root-canal">Root Canal Treatment</SelectItem>
                  <SelectItem value="cleaning">Cleaning & Check-ups</SelectItem>
                  <SelectItem value="emergency">Emergency Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Date *</label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const day = date.getDay();
                    // Disable Saturday (6) and Sunday (0) - closed days
                    return day === 0 || day === 6 || date < new Date();
                  }}
                  className="rounded-md border border-primary/20 bg-background/50"
                />
              </div>
            </div>
              
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Time *</label>
              {!selectedDate ? (
                <p className="text-sm text-muted-foreground">Please select a date first</p>
              ) : isLoadingSlots ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available slots for this date</p>
              ) : (
                <>
                  <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                    <SelectTrigger className="bg-background/50 border-primary/20">
                      <SelectValue placeholder="Choose a time slot" />
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
                                Réservé
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                                Disponible
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableSlots.every(slot => !slot.is_available) && (
                    <p className="text-sm text-destructive mt-2">
                      ⚠️ All time slots are fully booked for this date. Please select another date.
                    </p>
                  )}
                </>
              )}
            </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Additional Notes</label>
              <Textarea 
                placeholder="Any additional information or special requirements" 
                rows={4}
                className="bg-background/50 border-primary/20"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
            
            <button type="submit" className="vibe-btn w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Book Appointment"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
