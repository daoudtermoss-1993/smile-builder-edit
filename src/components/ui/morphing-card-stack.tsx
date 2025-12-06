"use client"

import { useState, useRef, type ReactNode } from "react"
import { motion, AnimatePresence, LayoutGroup, type PanInfo, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Grid3X3, Layers, LayoutList, Sparkles } from "lucide-react"

export type LayoutMode = "stack" | "grid" | "list"

export interface CardData {
  id: string
  title: string
  description: string
  icon?: ReactNode
  color?: string
  onClick?: () => void
}

export interface MorphingCardStackProps {
  cards?: CardData[]
  className?: string
  defaultLayout?: LayoutMode
  onCardClick?: (card: CardData) => void
}

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
}

const SWIPE_THRESHOLD = 50

// Enhanced 3D Tilt Card wrapper component with glow effect
function TiltCard({ 
  children, 
  className, 
  style,
  isActive,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  isActive?: boolean
  [key: string]: any
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.15, 0.9])
  
  // Glow position
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        filter: useTransform(brightness, (v) => `brightness(${v})`),
        ...style,
      }}
      className={cn(className, "relative")}
      {...props}
    >
      {/* Animated glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, hsl(180 100% 35% / 0.4), transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 40%, hsl(180 100% 50% / 0.1) 45%, hsl(180 100% 50% / 0.2) 50%, hsl(180 100% 50% / 0.1) 55%, transparent 60%)",
          }}
          animate={isHovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 1, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        />
      </motion.div>
      
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="relative z-10">
        {children}
      </div>
      
      {/* Floating particles effect */}
      <AnimatePresence>
        {isHovered && isActive && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/60"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: "50%",
                  y: "50%",
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: `${30 + i * 20}%`,
                  y: `${20 + i * 25}%`,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout = "stack",
  onCardClick,
}: MorphingCardStackProps) {
  const [layout, setLayout] = useState<LayoutMode>(defaultLayout)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  if (!cards || cards.length === 0) {
    return null
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % cards.length)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }
    setIsDragging(false)
  }

  const getStackOrder = () => {
    const reordered = []
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse()
  }

  const getLayoutStyles = (stackPosition: number) => {
    switch (layout) {
      case "stack":
        return {
          top: stackPosition * 10,
          left: stackPosition * 10,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition - 1) * 3,
          scale: 1 - stackPosition * 0.03,
        }
      case "grid":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
          scale: 1,
        }
      case "list":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
          scale: 1,
        }
    }
  }

  const containerStyles = {
    stack: "relative h-72 w-72",
    grid: "grid grid-cols-2 gap-4",
    list: "flex flex-col gap-4",
  }

  const displayCards = layout === "stack" ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }))

  const containerSpring = {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
    mass: 1,
  }

  const cardSpring = {
    type: "spring" as const,
    stiffness: 500,
    damping: 40,
    mass: 0.6,
  }

  const staggerDelay = 0.08

  return (
    <div className={cn("space-y-6", className)}>
      {/* Enhanced Layout Toggle */}
      <motion.div 
        className="flex items-center justify-center gap-2 rounded-2xl bg-secondary/60 p-1.5 w-fit mx-auto backdrop-blur-md border border-border/50 shadow-lg"
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <motion.button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "relative rounded-xl p-2.5 transition-colors",
                layout === mode
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Switch to ${mode} layout`}
            >
              {layout === mode && (
                <motion.div
                  layoutId="activeLayoutBg"
                  className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg shadow-primary/30"
                  transition={containerSpring}
                />
              )}
              <Icon className="h-4 w-4 relative z-10" />
            </motion.button>
          )
        })}
      </motion.div>

      {/* Cards Container with enhanced animations */}
      <LayoutGroup>
        <motion.div 
          layout
          transition={containerSpring}
          className={cn(containerStyles[layout], "mx-auto")}
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence mode="popLayout">
            {displayCards.map((card, index) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === "stack" && card.stackPosition === 0

              return (
                <TiltCard
                  key={card.id}
                  isActive={isTopCard}
                  className={cn(
                    "cursor-pointer rounded-2xl border border-border/50 bg-card/95 backdrop-blur-sm p-5 shadow-xl",
                    "hover:border-primary/50 transition-all duration-300",
                    layout === "stack" && "absolute w-64 h-56",
                    layout === "stack" && isTopCard && "cursor-grab active:cursor-grabbing shadow-2xl",
                    layout === "grid" && "w-full aspect-square",
                    layout === "list" && "w-full",
                    isExpanded && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  )}
                  style={{
                    backgroundColor: card.color || undefined,
                    perspective: "1200px",
                  }}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.7, y: 30, rotateX: -20 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.08 : styles.scale,
                    y: 0,
                    x: 0,
                    rotateX: 0,
                    ...styles,
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.7, 
                    x: -150,
                    rotateY: -30,
                    transition: { duration: 0.3 }
                  }}
                  transition={{
                    ...cardSpring,
                    delay: layout !== "stack" ? index * staggerDelay : 0,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.08, rotate: 5, cursor: "grabbing" }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    card.onClick?.()
                    onCardClick?.(card)
                  }}
                >
                  <motion.div 
                    className="flex items-start gap-4"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {card.icon && (
                      <motion.div 
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20"
                        whileHover={{ 
                          rotate: [0, -15, 15, -10, 10, 0], 
                          scale: 1.15, 
                          transition: { duration: 0.5 } 
                        }}
                        style={{ transform: "translateZ(50px)" }}
                      >
                        {card.icon}
                      </motion.div>
                    )}
                    <div className="min-w-0 flex-1">
                      <motion.h3 
                        className="font-bold text-lg text-card-foreground truncate"
                        style={{ transform: "translateZ(35px)" }}
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        layout
                        className={cn(
                          "text-sm text-muted-foreground mt-2 leading-relaxed",
                          layout === "stack" && "line-clamp-3",
                          layout === "grid" && "line-clamp-2",
                          layout === "list" && "line-clamp-1",
                        )}
                        style={{ transform: "translateZ(20px)" }}
                      >
                        {card.description}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Decorative corner sparkle for top card */}
                  {isTopCard && layout === "stack" && (
                    <motion.div
                      className="absolute top-3 right-3"
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-primary/50" />
                    </motion.div>
                  )}
                </TiltCard>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Enhanced pagination dots with pulse effect */}
      <AnimatePresence>
        {layout === "stack" && cards.length > 1 && (
          <motion.div 
            className="flex justify-center gap-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
          >
            {cards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-colors relative",
                  index === activeIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                animate={{ 
                  width: index === activeIndex ? 24 : 8,
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.85 }}
                transition={cardSpring}
                aria-label={`Go to card ${index + 1}`}
              >
                {index === activeIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{ 
                      boxShadow: ["0 0 0 0 hsl(180 100% 35% / 0.4)", "0 0 0 8px hsl(180 100% 35% / 0)", "0 0 0 0 hsl(180 100% 35% / 0)"]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
