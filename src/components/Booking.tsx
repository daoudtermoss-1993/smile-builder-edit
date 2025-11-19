import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export const Booking = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Schedule your visit today</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Book Your Appointment</h2>
        </div>
        
        <Card className="p-8 shadow-medium border-border">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input placeholder="Enter your full name" className="border-input" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input placeholder="Enter your phone number" className="border-input" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="Enter your email" className="border-input" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Needed</label>
              <Select>
                <SelectTrigger className="border-input">
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
                <Input type="date" className="border-input" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preferred Time</label>
                <Input type="time" className="border-input" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Additional Notes</label>
              <Textarea 
                placeholder="Any additional information or special requirements" 
                rows={4}
                className="border-input"
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full bg-gradient-primary hover:opacity-90 shadow-soft">
              Book Appointment
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};
