"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full border border-transparent">
        <div className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full border border-white/20 dark:border-white/20 border-slate-300/50 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 hover:bg-slate-200/50"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : 180,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-white dark:text-white text-slate-700" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === "light" ? 1 : 0,
          rotate: theme === "light" ? 0 : -180,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-white dark:text-white text-slate-700" />
      </motion.div>
    </Button>
  )
}
