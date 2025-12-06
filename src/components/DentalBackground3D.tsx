'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// 3D Animated Background Component
export const DentalBackground3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Particle {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      size: number
      color: string
    }

    const particles: Particle[] = []
    const particleCount = 80

    // Create particles with teal theme colors - more subtle
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.3, // Slower movement
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 0.5, // Smaller particles
        color: `rgba(0, 179, 179, ${Math.random() * 0.25 + 0.1})`, // Lower opacity
      })
    }

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        if (particle.z < 0 || particle.z > 1000) particle.vz *= -1

        const scale = 1000 / (1000 + particle.z)
        const x2d = particle.x * scale + canvas.width / 2 * (1 - scale)
        const y2d = particle.y * scale + canvas.height / 2 * (1 - scale)
        const size = particle.size * scale

        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const dz = particle.z - otherParticle.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (distance < 150) {
            const scale2 = 1000 / (1000 + otherParticle.z)
            const ox2d = otherParticle.x * scale2 + canvas.width / 2 * (1 - scale2)
            const oy2d = otherParticle.y * scale2 + canvas.height / 2 * (1 - scale2)

            ctx.beginPath()
            ctx.moveTo(x2d, y2d)
            ctx.lineTo(ox2d, oy2d)
            ctx.strokeStyle = `rgba(0, 179, 179, ${0.08 * (1 - distance / 150)})` // More subtle connections
            ctx.lineWidth = 0.3
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ background: 'linear-gradient(135deg, hsl(180 100% 97%) 0%, hsl(180 100% 93%) 100%)' }}
    />
  )
}

// Floating tooth component
export const FloatingTooth = ({ delay = 0, className = '' }: { delay?: number; className?: string }) => {
  return (
    <motion.div
      className={cn('absolute pointer-events-none', className)}
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-10"
      >
        <path
          d="M30 10C20 10 15 15 15 25C15 35 15 45 20 50C25 55 35 55 40 50C45 45 45 35 45 25C45 15 40 10 30 10Z"
          fill="url(#toothGradient)"
          stroke="hsl(180 100% 35%)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="toothGradient" x1="30" y1="10" x2="30" y2="55">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="hsl(180 100% 90%)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}
