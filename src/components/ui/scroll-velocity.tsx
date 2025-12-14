"use client"

import * as React from "react"
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame, wrap } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollVelocityProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[] | string
  velocity: number
  movable?: boolean
  clamp?: boolean
  paused?: boolean
}

const ScrollVelocity = React.forwardRef<HTMLDivElement, ScrollVelocityProps>(
  ({ children, velocity = 5, movable = true, clamp = false, paused = false, className, ...props }, ref) => {
    const baseX = useMotionValue(0)
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 100,
    })
    const velocityFactor = useTransform(smoothVelocity, [0, 10000], [0, 5], {
      clamp,
    })

    const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`)

    const baseDirection = velocity >= 0 ? 1 : -1
    const directionFactor = React.useRef<number>(baseDirection)
    const scrollThreshold = React.useRef<number>(5)
    const currentVelocity = React.useRef<number>(Math.abs(velocity))

    const absVelocity = Math.abs(velocity)
    
    // Smooth transition for pause/resume
    React.useEffect(() => {
      if (paused) {
        // Gradually slow down
        const slowDown = setInterval(() => {
          currentVelocity.current *= 0.85
          if (currentVelocity.current < 0.1) {
            currentVelocity.current = 0
            clearInterval(slowDown)
          }
        }, 16)
        return () => clearInterval(slowDown)
      } else {
        // Gradually speed up
        currentVelocity.current = 0.1
        const speedUp = setInterval(() => {
          currentVelocity.current = Math.min(currentVelocity.current * 1.15, absVelocity)
          if (currentVelocity.current >= absVelocity * 0.95) {
            currentVelocity.current = absVelocity
            clearInterval(speedUp)
          }
        }, 16)
        return () => clearInterval(speedUp)
      }
    }, [paused, absVelocity])

    useAnimationFrame((t, delta) => {
      if (currentVelocity.current < 0.01) return
      if (movable) {
        move(delta)
      } else {
        if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
          move(delta)
        }
      }
    })

    function move(delta: number) {
      let moveBy = baseDirection * currentVelocity.current * (delta / 1000)
      // Add scroll velocity influence but keep base direction
      const scrollInfluence = velocityFactor.get() * baseDirection
      moveBy += moveBy * Math.abs(scrollInfluence)
      baseX.set(baseX.get() + moveBy)
    }

    return (
      <div
        ref={ref}
        className={cn("relative m-0 flex flex-nowrap overflow-hidden whitespace-nowrap leading-[0.8] tracking-[-2px]", className)}
        {...props}
      >
        <motion.div
          className="flex flex-row flex-nowrap whitespace-nowrap text-xl font-semibold uppercase *:mr-6 *:block md:text-2xl xl:text-4xl"
          style={{ x }}
        >
          {typeof children === "string" ? (
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <span key={idx}>{children}</span>
              ))}
            </>
          ) : (
            children
          )}
        </motion.div>
      </div>
    )
  }
)
ScrollVelocity.displayName = "ScrollVelocity"

export { ScrollVelocity, type ScrollVelocityProps }
