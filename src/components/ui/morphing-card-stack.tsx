"use client"

import { useState, useRef, type ReactNode } from "react"
import { motion, AnimatePresence, LayoutGroup, type PanInfo, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Grid3X3, Layers, LayoutList } from "lucide-react"

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

// 3D Tilt Card wrapper component
function TiltCard({ 
  children, 
  className, 
  style,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  [key: string]: any
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"])
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.1, 0.95])

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
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        filter: useTransform(brightness, (v) => `brightness(${v})`),
        ...style,
      }}
      className={className}
      {...props}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
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
          top: stackPosition * 8,
          left: stackPosition * 8,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition - 1) * 2,
        }
      case "grid":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
      case "list":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
    }
  }

  const containerStyles = {
    stack: "relative h-64 w-64",
    grid: "grid grid-cols-2 gap-3",
    list: "flex flex-col gap-3",
  }

  const displayCards = layout === "stack" ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }))

  // Enhanced spring configs for different animations
  const containerSpring = {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
    mass: 1,
  }

  const cardSpring = {
    type: "spring" as const,
    stiffness: 400,
    damping: 35,
    mass: 0.8,
  }

  const staggerDelay = 0.05

  return (
    <div className={cn("space-y-4", className)}>
      {/* Layout Toggle with clean styling */}
      <motion.div 
        className="flex items-center justify-center gap-1 rounded-full bg-white p-1.5 w-fit mx-auto shadow-lg border border-primary/10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <motion.button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "relative rounded-full p-2.5 transition-colors",
                layout === mode
                  ? "text-white"
                  : "text-muted-foreground hover:text-primary",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${mode} layout`}
            >
              {layout === mode && (
                <motion.div
                  layoutId="activeLayoutBg"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-md"
                  transition={containerSpring}
                />
              )}
              <Icon className="h-4 w-4 relative z-10" />
            </motion.button>
          )
        })}
      </motion.div>

      {/* Cards Container with layout animation */}
      <LayoutGroup>
        <motion.div 
          layout
          transition={containerSpring}
          className={cn(containerStyles[layout], "mx-auto")}
        >
          <AnimatePresence mode="popLayout">
            {displayCards.map((card, index) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === "stack" && card.stackPosition === 0

              return (
                <TiltCard
                  key={card.id}
                  className={cn(
                    "cursor-pointer rounded-2xl bg-white p-5 shadow-xl",
                    "border border-primary/10 hover:border-primary/30 transition-all duration-300",
                    "hover:shadow-2xl hover:shadow-primary/10",
                    layout === "stack" && "absolute w-56 h-48",
                    layout === "stack" && isTopCard && "cursor-grab active:cursor-grabbing",
                    layout === "grid" && "w-full aspect-square",
                    layout === "list" && "w-full",
                    isExpanded && "ring-2 ring-primary ring-offset-2 ring-offset-white",
                  )}
                  style={{
                    backgroundColor: card.color || undefined,
                    perspective: "1000px",
                  }}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.05 : 1,
                    y: 0,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8, 
                    x: -100,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    ...cardSpring,
                    delay: layout !== "stack" ? index * staggerDelay : 0,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    card.onClick?.()
                    onCardClick?.(card)
                  }}
                >
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {card.icon && (
                      <motion.div 
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-md"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1, transition: { duration: 0.4 } }}
                        style={{ transform: "translateZ(40px)" }}
                      >
                        {card.icon}
                      </motion.div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 
                        className="font-semibold text-foreground truncate"
                        style={{ transform: "translateZ(25px)" }}
                      >
                        {card.title}
                      </h3>
                      <motion.p
                        layout
                        className={cn(
                          "text-sm text-muted-foreground mt-1",
                          layout === "stack" && "line-clamp-3",
                          layout === "grid" && "line-clamp-2",
                          layout === "list" && "line-clamp-1",
                        )}
                        style={{ transform: "translateZ(15px)" }}
                      >
                        {card.description}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Premium indicator */}
                  <div className="absolute top-3 right-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  </div>
                </TiltCard>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Animated pagination dots with teal accent */}
      <AnimatePresence>
        {layout === "stack" && cards.length > 1 && (
          <motion.div 
            className="flex justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {cards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-colors",
                  index === activeIndex 
                    ? "bg-gradient-to-r from-primary to-primary/70" 
                    : "bg-muted-foreground/20 hover:bg-primary/40",
                )}
                animate={{ 
                  width: index === activeIndex ? 20 : 8,
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={cardSpring}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
