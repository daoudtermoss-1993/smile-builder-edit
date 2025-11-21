import { Award, Users, Clock } from "lucide-react";

interface AboutProps {
  doctorImage?: string;
  doctorName: string;
  description: string;
  stats: {
    years: string;
    patients: string;
    treatments: string;
  };
}

export const About = ({ 
  doctorImage = "/placeholder.svg",
  doctorName,
  description,
  stats
}: AboutProps) => {
  return (
    <section className="vibe-section py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-vibe opacity-20 rounded-3xl blur-3xl" />
            <img
              src={doctorImage}
              alt={doctorName}
              className="relative rounded-3xl shadow-glow object-cover w-full aspect-square border border-primary/20"
            />
          </div>
          
          <div className="space-y-6">
            <div className="inline-block px-6 py-2 bg-gradient-card backdrop-blur-xl rounded-full border border-primary/30">
              <span className="text-sm font-semibold bg-gradient-vibe bg-clip-text text-transparent">About Our Clinic</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-vibe bg-clip-text text-transparent">
              Meet {doctorName}
            </h2>
            
            <p className="text-lg text-foreground/80 leading-relaxed">
              {description}
            </p>
            
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-6">
              <div className="vibe-card text-center p-3 md:p-4">
                <Clock className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-vibe-purple" />
                <div className="text-lg md:text-2xl font-bold text-foreground break-words">{stats.years}</div>
                <div className="text-xs md:text-sm text-foreground/60">Years</div>
              </div>
              
              <div className="vibe-card text-center p-3 md:p-4">
                <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-vibe-pink" />
                <div className="text-lg md:text-2xl font-bold text-foreground break-words">{stats.patients}</div>
                <div className="text-xs md:text-sm text-foreground/60">Patients</div>
              </div>
              
              <div className="vibe-card text-center p-3 md:p-4">
                <Award className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-vibe-blue" />
                <div className="text-lg md:text-2xl font-bold text-foreground break-words">{stats.treatments}</div>
                <div className="text-xs md:text-sm text-foreground/60">Treatments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
