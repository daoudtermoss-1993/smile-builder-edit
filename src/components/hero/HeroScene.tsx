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

  // Smooth camera-like motion
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 55,
    damping: 38,
    restDelta: 0.0001,
  });

  // Traverse exactly 2 viewports (3 scenes stacked) then clamp (no white gap)
  const maxTravelPx = vh * 2;
  const cameraTravel = useTransform(smoothScrollY, (y) => {
    const clamped = Math.max(0, Math.min(y, maxTravelPx));
    return -clamped;
  });

  return (
    <div
      className="fixed inset-0 z-0 h-full w-full overflow-hidden bg-background"
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-0 top-0 w-full will-change-transform"
        style={{
          y: cameraTravel,
          height: "300vh",
        }}
      >
        <section className="absolute left-0 top-0 h-screen w-full overflow-hidden">
          <img
            src={heroDentalEquipment}
            alt="Équipement dentaire professionnel"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </section>

        <section
          className="absolute left-0 h-screen w-full overflow-hidden"
          style={{ top: "100vh" }}
        >
          <img
            src={heroDentalChair}
            alt="Fauteuil dentaire moderne"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </section>

        <section
          className="absolute left-0 h-screen w-full overflow-hidden"
          style={{ top: "200vh" }}
        >
          <img
            src={heroDentalTopview}
            alt="Vue plongeante clinique dentaire"
            className="h-full w-full select-none object-cover"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </section>
      </motion.div>

      {/* Vignette cinématique (tokens only) */}
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
