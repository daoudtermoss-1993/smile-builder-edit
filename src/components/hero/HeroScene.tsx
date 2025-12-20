import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Images dentaires - Séquence style Mont-fort
import heroDentalEquipment from "@/assets/hero-dental-equipment.jpg";
import heroDentalChair from "@/assets/hero-dental-chair.jpg";
import heroDentalTopview from "@/assets/hero-dental-topview.jpg";

export function HeroScene() {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const update = () => setVh(window.innerHeight || 800);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Smooth camera-like motion with more responsive spring
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Camera travels down through 3 viewports (2vh total distance)
  // Scroll range: 0 to 2*vh moves camera from scene 1 to scene 3
  const cameraY = useTransform(
    smoothScrollY,
    [0, vh * 2],
    [0, -vh * 2]
  );

  return (
    <div
      className="fixed inset-0 z-0 h-full w-full overflow-hidden bg-background"
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 top-0 w-full will-change-transform"
        style={{
          y: cameraY,
          height: `${vh * 3}px`,
        }}
      >
        {/* Scene 1 - Equipment */}
        <div 
          className="absolute left-0 top-0 w-full overflow-hidden"
          style={{ height: `${vh}px` }}
        >
          <img
            src={heroDentalEquipment}
            alt="Équipement dentaire professionnel"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Scene 2 - Chair */}
        <div 
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: `${vh}px`, height: `${vh}px` }}
        >
          <img
            src={heroDentalChair}
            alt="Fauteuil dentaire moderne"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Scene 3 - Top view */}
        <div 
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: `${vh * 2}px`, height: `${vh}px` }}
        >
          <img
            src={heroDentalTopview}
            alt="Vue plongeante clinique dentaire"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>
      </motion.div>

      {/* Vignette cinématique */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, hsl(var(--foreground) / 0.16) 100%)",
        }}
      />
    </div>
  );
}
