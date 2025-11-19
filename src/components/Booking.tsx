import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Booking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.service || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-booking-notification', {
        body: formData,
      });

      if (error) throw error;

      toast.success("Appointment request sent! We'll contact you shortly via WhatsApp.");
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("Failed to submit appointment. Please try again or call us directly.");
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
                <label className="text-sm font-medium text-foreground">Preferred Date *</label>
                <Input 
                  type="date" 
                  className="bg-background/50 border-primary/20"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preferred Time *</label>
                <Input 
                  type="time" 
                  className="bg-background/50 border-primary/20"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  required
                />
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
