import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function AdminBookingDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
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

  const resetForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !formData.time) {
      toast.error("Please select both date and time");
      return;
    }

    setIsSubmitting(true);

    try {
      // Admin can directly create confirmed appointments, bypassing the confirmation flow
      const { error: dbError } = await supabase
        .from('appointments')
        .insert({
          patient_name: formData.name,
          patient_email: formData.email,
          patient_phone: formData.phone,
          service: formData.service,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: formData.time,
          notes: formData.notes,
          source: 'admin_booking',
          status: 'confirmed' // Admin bookings are pre-confirmed
        });

      if (dbError) throw dbError;

      toast.success("Appointment created successfully!");
      resetForm();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input 
                placeholder="Patient's full name" 
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number *</label>
              <Input 
                placeholder="+965 XXXX XXXX" 
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <Input 
              type="email" 
              placeholder="patient@example.com" 
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Service *</label>
            <Select value={formData.service} onValueChange={(value) => handleChange("service", value)} required>
              <SelectTrigger>
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
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date *</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  const day = date.getDay();
                  return day === 0 || day === 6 || date < new Date();
                }}
                className="rounded-md border"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time *</label>
              {!selectedDate ? (
                <p className="text-sm text-muted-foreground">Please select a date first</p>
              ) : isLoadingSlots ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available slots for this date</p>
              ) : (
                <Select value={formData.time} onValueChange={(value) => handleChange("time", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem 
                        key={slot.slot_time} 
                        value={slot.slot_time}
                        disabled={!slot.is_available}
                      >
                        <span className="flex items-center justify-between w-full gap-2">
                          <span>{slot.slot_time}</span>
                          {!slot.is_available && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                              Booked
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea 
              placeholder="Any additional information" 
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
