import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Images fallback pour mobile
import heroFacade from "@/assets/hero-clinic-facade.jpg";
import heroLightRays from "@/assets/hero-light-rays.jpg";
import heroTreatmentRoom from "@/assets/hero-treatment-room.jpg";
import heroSilkWhite from "@/assets/hero-silk-white.jpg";
import heroPerfectSmile from "@/assets/hero-perfect-smile.jpg";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const lastTimeRef = useRef(0);
  
  const { scrollYProgress } = useScroll();

  // Spring pour le scroll fluide
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Contrôle scroll-driven video avec requestAnimationFrame pour fluidité
  const updateVideoTime = useCallback((progress: number) => {
    if (!videoRef.current || !videoLoaded || videoDuration === 0) return;
    
    const targetTime = progress * videoDuration;
    const diff = Math.abs(targetTime - lastTimeRef.current);
    
    // Seulement mettre à jour si le changement est significatif (évite le jitter)
    if (diff > 0.016) { // ~60fps threshold
      videoRef.current.currentTime = targetTime;
      lastTimeRef.current = targetTime;
    }
  }, [videoLoaded, videoDuration]);

  // Écouter les changements de scroll
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!isMobile) {
      updateVideoTime(latest);
    }
  });

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      console.log("Video loaded, duration:", duration);
      setVideoDuration(duration);
      setVideoLoaded(true);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Précharger la vidéo
  useEffect(() => {
    if (!isMobile && videoRef.current) {
      videoRef.current.load();
    }
  }, [isMobile]);

  // ═══════════════════════════════════════════════════════════════
  // ANIMATIONS POUR IMAGES (Mobile fallback)
  // ═══════════════════════════════════════════════════════════════
  const scene1Scale = useTransform(smoothProgress, [0, 0.12, 0.25], [1.6, 1.35, 1.1]);
  const scene1X = useTransform(smoothProgress, [0, 0.12, 0.25], ["5%", "0%", "-8%"]);
  const scene1Y = useTransform(smoothProgress, [0, 0.12, 0.25], ["3%", "0%", "-10%"]);
  const scene1RotateY = useTransform(smoothProgress, [0, 0.25], [2, -3]);
  const scene1RotateX = useTransform(smoothProgress, [0, 0.25], [-1, 1.5]);
  const scene1Opacity = useTransform(smoothProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const scene1Brightness = useTransform(smoothProgress, [0, 0.25], [1.02, 0.92]);

  const trans1Opacity = useTransform(smoothProgress, [0.18, 0.26, 0.34, 0.42], [0, 1, 1, 0]);
  const trans1Scale = useTransform(smoothProgress, [0.18, 0.30, 0.42], [1.4, 1.2, 1.05]);
  const trans1Y = useTransform(smoothProgress, [0.18, 0.42], ["15%", "-20%"]);
  const trans1Brightness = useTransform(smoothProgress, [0.18, 0.30, 0.42], [1, 1.15, 1.05]);

  const scene2Scale = useTransform(smoothProgress, [0.35, 0.46, 0.58], [1.5, 1.25, 1.08]);
  const scene2X = useTransform(smoothProgress, [0.35, 0.46, 0.58], ["-10%", "0%", "8%"]);
  const scene2Y = useTransform(smoothProgress, [0.35, 0.46, 0.58], ["8%", "0%", "-8%"]);
  const scene2RotateY = useTransform(smoothProgress, [0.35, 0.58], [-2, 2.5]);
  const scene2RotateX = useTransform(smoothProgress, [0.35, 0.58], [1.5, -1]);
  const scene2Opacity = useTransform(smoothProgress, [0.32, 0.40, 0.52, 0.62], [0, 1, 1, 0]);
  const scene2Brightness = useTransform(smoothProgress, [0.35, 0.58], [1.05, 0.95]);

  const trans2Opacity = useTransform(smoothProgress, [0.55, 0.62, 0.70, 0.78], [0, 1, 1, 0]);
  const trans2Scale = useTransform(smoothProgress, [0.55, 0.66, 0.78], [1.35, 1.15, 0.98]);
  const trans2Y = useTransform(smoothProgress, [0.55, 0.78], ["18%", "-22%"]);
  const trans2RotateZ = useTransform(smoothProgress, [0.55, 0.78], [2, -2]);

  const scene3Scale = useTransform(smoothProgress, [0.70, 0.84, 1], [1.45, 1.18, 1]);
  const scene3X = useTransform(smoothProgress, [0.70, 0.84, 1], ["6%", "-2%", "-5%"]);
  const scene3Y = useTransform(smoothProgress, [0.70, 0.84, 1], ["10%", "0%", "-5%"]);
  const scene3RotateY = useTransform(smoothProgress, [0.70, 1], [1.5, -0.5]);
  const scene3RotateX = useTransform(smoothProgress, [0.70, 1], [-0.8, 0.3]);
  const scene3Opacity = useTransform(smoothProgress, [0.68, 0.78, 1], [0, 1, 1]);
  const scene3Brightness = useTransform(smoothProgress, [0.70, 0.90, 1], [1.08, 1, 0.92]);

  // Video effects
  const videoScale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 1.03, 1]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        zIndex: 0,
        perspective: "2200px",
        perspectiveOrigin: "50% 50%"
      }}
    >
      {/* ════════════════════════════════════════════════════════════ */}
      {/* DESKTOP: Scroll-driven Video                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            scale: videoScale,
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleVideoLoad}
            onCanPlayThrough={() => console.log("Video can play through")}
            style={{
              filter: "brightness(1.02) saturate(1.05)",
            }}
          >
            <source src="/videos/hero-scroll-video.mp4" type="video/mp4" />
          </video>
          
          {/* Loader pendant le chargement */}
          {!videoLoaded && (
            <div className="absolute inset-0 bg-background flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Chargement...</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MOBILE: Images animées (fallback fiable)                    */}
      {/* ════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <>
          {/* SCENE 1: Clinique Extérieur */}
          <motion.div
            className="absolute w-[200%] h-[200%]"
            style={{
              top: "-50%",
              left: "-50%",
              x: scene1X,
              y: scene1Y,
              scale: scene1Scale,
              opacity: scene1Opacity,
              rotateY: scene1RotateY,
              rotateX: scene1RotateX,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            <motion.img
              src={heroFacade}
              alt="Clinique dentaire moderne"
              className="w-full h-full object-cover"
              style={{
                filter: useTransform(scene1Brightness, (b) => `brightness(${b}) saturate(1.05)`),
              }}
            />
          </motion.div>

          {/* TRANSITION 1: Lumière dorée */}
          <motion.div
            className="absolute w-[180%] h-[180%]"
            style={{
              top: "-40%",
              left: "-40%",
              y: trans1Y,
              scale: trans1Scale,
              opacity: trans1Opacity,
              transformOrigin: "center center",
            }}
          >
            <motion.img
              src={heroLightRays}
              alt="Transition lumineuse"
              className="w-full h-full object-cover"
              style={{
                filter: useTransform(trans1Brightness, (b) => `brightness(${b})`),
              }}
            />
          </motion.div>

          {/* SCENE 2: Salle de Traitement */}
          <motion.div
            className="absolute w-[200%] h-[200%]"
            style={{
              top: "-50%",
              left: "-50%",
              x: scene2X,
              y: scene2Y,
              scale: scene2Scale,
              opacity: scene2Opacity,
              rotateY: scene2RotateY,
              rotateX: scene2RotateX,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            <motion.img
              src={heroTreatmentRoom}
              alt="Salle de traitement moderne"
              className="w-full h-full object-cover"
              style={{
                filter: useTransform(scene2Brightness, (b) => `brightness(${b}) saturate(1.02)`),
              }}
            />
          </motion.div>

          {/* TRANSITION 2: Soie blanche */}
          <motion.div
            className="absolute w-[175%] h-[175%]"
            style={{
              top: "-37.5%",
              left: "-37.5%",
              y: trans2Y,
              scale: trans2Scale,
              opacity: trans2Opacity,
              rotate: trans2RotateZ,
              transformOrigin: "center center",
            }}
          >
            <img
              src={heroSilkWhite}
              alt="Transition soie"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(1.08)" }}
            />
          </motion.div>

          {/* SCENE 3: Sourire Parfait */}
          <motion.div
            className="absolute w-[200%] h-[200%]"
            style={{
              top: "-50%",
              left: "-50%",
              x: scene3X,
              y: scene3Y,
              scale: scene3Scale,
              opacity: scene3Opacity,
              rotateY: scene3RotateY,
              rotateX: scene3RotateX,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            <motion.img
              src={heroPerfectSmile}
              alt="Sourire parfait"
              className="w-full h-full object-cover"
              style={{
                filter: useTransform(scene3Brightness, (b) => `brightness(${b}) contrast(1.02)`),
              }}
            />
          </motion.div>
        </>
      )}

      {/* Vignette cinématique subtile */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.12) 100%)"
        }}
      />
    </div>
  );
}
