"use client"

import { motion } from "framer-motion"
import { Mic, Zap, Shield, Cpu } from "lucide-react"

const floatingElements = [
  { icon: Mic, delay: 0, x: "10%", y: "20%" },
  { icon: Zap, delay: 2, x: "80%", y: "30%" },
  { icon: Shield, delay: 4, x: "15%", y: "70%" },
  { icon: Cpu, delay: 6, x: "85%", y: "80%" },
]

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {floatingElements.map(({ icon: Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10 dark:opacity-10 opacity-5"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.1, 0.05, 0.1],
            scale: [0, 1, 1.2, 1],
            rotate: [0, 180, 360],
            y: [0, -20, 0, -10, 0],
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Icon className="h-8 w-8 text-indigo-400" />
        </motion.div>
      ))}
    </div>
  )
}
