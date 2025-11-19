import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Booking = () => {
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
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input placeholder="Enter your full name" className="bg-background/50 border-primary/20" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input placeholder="Enter your phone number" className="bg-background/50 border-primary/20" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="Enter your email" className="bg-background/50 border-primary/20" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Needed</label>
              <Select>
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
                <label className="text-sm font-medium text-foreground">Preferred Date</label>
                <Input type="date" className="bg-background/50 border-primary/20" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preferred Time</label>
                <Input type="time" className="bg-background/50 border-primary/20" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Additional Notes</label>
              <Textarea 
                placeholder="Any additional information or special requirements" 
                rows={4}
                className="bg-background/50 border-primary/20"
              />
            </div>
            
            <button type="submit" className="vibe-btn w-full">
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
