import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Card3DData {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  onClick?: () => void;
}

interface Interactive3DCardsProps {
  cards: Card3DData[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  stackSpacing?: number;
  stackDepth?: number;
  cardAngle?: number;
  perspective?: number;
}

export function Interactive3DCards({
  cards,
  className,
  cardWidth = 320,
  cardHeight = 400,
  stackSpacing = 60,
  stackDepth = 50,
  cardAngle = 5,
  perspective = 1200,
}: Interactive3DCardsProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle outside click to unfocus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocusedIndex(null);
      }
    };

    if (focusedIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [focusedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedIndex === null) return;

      if (e.key === "Escape") {
        setFocusedIndex(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setFocusedIndex((prev) => (prev !== null ? Math.min(prev + 1, cards.length - 1) : 0));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setFocusedIndex((prev) => (prev !== null ? Math.max(prev - 1, 0) : 0));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, cards.length]);

  // Wheel navigation when focused
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (focusedIndex === null) return;
      e.preventDefault();

      if (e.deltaY > 0) {
        setFocusedIndex((prev) => (prev !== null ? Math.min(prev + 1, cards.length - 1) : 0));
      } else {
        setFocusedIndex((prev) => (prev !== null ? Math.max(prev - 1, 0) : 0));
      }
    },
    [focusedIndex, cards.length]
  );

  const handleCardClick = (index: number) => {
    if (focusedIndex === index) {
      // If already focused, trigger onClick
      cards[index].onClick?.();
    } else {
      setFocusedIndex(index);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center", className)}
      style={{
        perspective: `${perspective}px`,
        minHeight: cardHeight + 100,
      }}
      onWheel={handleWheel}
    >
      {/* Counter when focused */}
      {focusedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/80 z-50"
        >
          {focusedIndex + 1} / {cards.length}
        </motion.div>
      )}

      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          width: cardWidth,
          height: cardHeight,
        }}
      >
        {cards.map((card, index) => (
          <Card3D
            key={card.id}
            card={card}
            index={index}
            totalCards={cards.length}
            isFocused={focusedIndex === index}
            isAnyFocused={focusedIndex !== null}
            isHovered={hoveredIndex === index}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            stackSpacing={stackSpacing}
            stackDepth={stackDepth}
            cardAngle={cardAngle}
            onClick={() => handleCardClick(index)}
            onHover={(hovered) => setHoveredIndex(hovered ? index : null)}
          />
        ))}
      </div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: focusedIndex !== null ? 1 : 0 }}
        className="absolute bottom-4 text-sm text-white/50"
      >
        {focusedIndex !== null ? "Click card to view details • Scroll or use arrows to navigate • Esc to close" : ""}
      </motion.p>
    </div>
  );
}

interface Card3DProps {
  card: Card3DData;
  index: number;
  totalCards: number;
  isFocused: boolean;
  isAnyFocused: boolean;
  isHovered: boolean;
  cardWidth: number;
  cardHeight: number;
  stackSpacing: number;
  stackDepth: number;
  cardAngle: number;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

function Card3D({
  card,
  index,
  totalCards,
  isFocused,
  isAnyFocused,
  isHovered,
  cardWidth,
  cardHeight,
  stackSpacing,
  stackDepth,
  cardAngle,
  onClick,
  onHover,
}: Card3DProps) {
  const centerIndex = (totalCards - 1) / 2;
  const offset = index - centerIndex;

  // Calculate base positions
  const baseX = offset * stackSpacing;
  const baseZ = -Math.abs(offset) * stackDepth;
  const baseRotateY = offset * cardAngle;

  // Spring animations
  const springConfig = { stiffness: 260, damping: 30 };
  const focusSpringConfig = { stiffness: 200, damping: 25 };

  const x = useSpring(baseX, isFocused ? focusSpringConfig : springConfig);
  const y = useSpring(0, springConfig);
  const z = useSpring(baseZ, isFocused ? focusSpringConfig : springConfig);
  const rotateY = useSpring(baseRotateY, springConfig);
  const scale = useSpring(1, springConfig);
  const opacity = useSpring(1, springConfig);

  // Update springs based on state
  useEffect(() => {
    if (isFocused) {
      x.set(0);
      y.set(0);
      z.set(200);
      rotateY.set(0);
      scale.set(1.1);
      opacity.set(1);
    } else if (isAnyFocused) {
      x.set(baseX);
      y.set(0);
      z.set(baseZ - 100);
      rotateY.set(baseRotateY);
      scale.set(0.9);
      opacity.set(0.3);
    } else if (isHovered) {
      x.set(baseX);
      y.set(-15);
      z.set(baseZ + 30);
      rotateY.set(baseRotateY * 0.5);
      scale.set(1.05);
      opacity.set(1);
    } else {
      x.set(baseX);
      y.set(0);
      z.set(baseZ);
      rotateY.set(baseRotateY);
      scale.set(1);
      opacity.set(1);
    }
  }, [isFocused, isAnyFocused, isHovered, baseX, baseZ, baseRotateY, x, y, z, rotateY, scale, opacity]);

  return (
    <motion.div
      className="absolute top-0 left-0 cursor-pointer"
      style={{
        width: cardWidth,
        height: cardHeight,
        x,
        y,
        z,
        rotateY,
        scale,
        opacity,
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div
        className={cn(
          "w-full h-full rounded-2xl overflow-hidden",
          "bg-gradient-to-br from-white/10 to-white/5",
          "backdrop-blur-xl border border-white/20",
          "shadow-2xl shadow-black/20",
          "transition-shadow duration-300",
          isFocused && "shadow-primary/30 border-primary/50"
        )}
      >
        {/* Card Image or Gradient Background */}
        {card.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10">
            {/* Decorative grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "30px 30px",
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          {/* Icon */}
          {card.icon && (
            <div className="mb-4 w-14 h-14 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center text-primary">
              {card.icon}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {card.title}
          </h3>

          {/* Description */}
          {card.description && (
            <p className="text-sm text-white/70 line-clamp-3">
              {card.description}
            </p>
          )}

          {/* Hover indicator */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isFocused ? 1 : 0, x: isFocused ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm font-medium">View details</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
