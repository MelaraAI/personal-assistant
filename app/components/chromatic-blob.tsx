"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface ChromaticBlobProps {
  className?: string
  size?: number
  color1?: string
  color2?: string
  speed?: number
  isDark?: boolean
}

export default function ChromaticBlob({
  className = "",
  size = 500,
  color1 = "#4f46e5",
  color2 = "#06b6d4",
  speed = 20,
  isDark = true,
}: ChromaticBlobProps) {
  const blobRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!blobRef.current) return

    // Create a random blob shape
    const points = 8
    const slice = (Math.PI * 2) / points
    const radius = size / 2

    // Generate random points for the blob
    const randomPoints = Array.from({ length: points }, (_, i) => {
      const angle = slice * i
      const randomRadius = radius * (0.8 + Math.random() * 0.4) // Random radius between 80% and 120% of the base radius
      const x = radius + randomRadius * Math.cos(angle)
      const y = radius + randomRadius * Math.sin(angle)
      return { x, y }
    })

    // Create the SVG path
    const path = blobRef.current.querySelector("path")
    if (path) {
      const pathData = createBlobPath(randomPoints)
      path.setAttribute("d", pathData)
    }
  }, [size])

  // Create a blob path from points
  const createBlobPath = (points: { x: number; y: number }[]) => {
    const firstPoint = points[0]
    let path = `M${firstPoint.x},${firstPoint.y}`

    for (let i = 0; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      const controlX = (current.x + next.x) / 2
      const controlY = (current.y + next.y) / 2

      path += ` Q${current.x},${current.y} ${controlX},${controlY}`
    }

    path += " Z"
    return path
  }

  return (
    <motion.div
      className={className}
      animate={{
        filter: isDark ? ["blur(40px)", "blur(60px)", "blur(40px)"] : ["blur(30px)", "blur(50px)", "blur(30px)"],
        scale: [1, 1.05, 1],
        rotate: [0, 10, 0],
        opacity: isDark ? [0.2, 0.3, 0.2] : [0.1, 0.2, 0.1],
      }}
      transition={{
        duration: speed,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <svg ref={blobRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`gradient-${color1.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <path
          fill={`url(#gradient-${color1.replace("#", "")})`}
          d="M250,250 Q300,300 250,350 Q200,400 150,350 Q100,300 150,250 Q200,200 250,250 Z"
        />
      </svg>
    </motion.div>
  )
}
