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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img
                src={doctorImage}
                alt={doctorName}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-medium">
              <p className="text-sm font-medium">Your trusted dental specialist</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              About {doctorName}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-secondary rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">{stats.years}</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">{stats.patients}</div>
                <div className="text-sm text-muted-foreground">Happy Patients</div>
              </div>
              <div className="text-center p-4 bg-secondary rounded-xl">
                <div className="text-3xl font-bold text-primary mb-2">{stats.treatments}</div>
                <div className="text-sm text-muted-foreground">Treatments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
