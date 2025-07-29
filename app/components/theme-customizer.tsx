"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Palette, X, Check } from "lucide-react"

interface ColorTheme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
}

const colorThemes: ColorTheme[] = [
  {
    name: "Ocean",
    primary: "#4f46e5",
    secondary: "#06b6d4",
    accent: "#0891b2",
    background: "from-blue-950 to-cyan-950",
  },
  {
    name: "Sunset",
    primary: "#f59e0b",
    secondary: "#ef4444",
    accent: "#ec4899",
    background: "from-orange-950 to-red-950",
  },
  {
    name: "Forest",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#14b8a6",
    background: "from-emerald-950 to-teal-950",
  },
  {
    name: "Purple",
    primary: "#8b5cf6",
    secondary: "#a855f7",
    accent: "#c084fc",
    background: "from-purple-950 to-violet-950",
  },
  {
    name: "Rose",
    primary: "#e11d48",
    secondary: "#f43f5e",
    accent: "#fb7185",
    background: "from-rose-950 to-pink-950",
  },
  {
    name: "Cyber",
    primary: "#00ff88",
    secondary: "#00d4ff",
    accent: "#ff0080",
    background: "from-slate-950 to-gray-950",
  },
]

interface ThemeCustomizerProps {
  onThemeChangeAction: (theme: ColorTheme) => void
  currentTheme: ColorTheme
}

export default function ThemeCustomizer({ onThemeChangeAction, currentTheme }: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div
        className="fixed right-4 top-1/2 z-50 -translate-y-1/2"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 p-3 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20"
          size="icon"
        >
          <Palette className="h-5 w-5 text-white" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-4 top-1/2 z-50 w-80 -translate-y-1/2 rounded-3xl bg-white/10 dark:bg-white/10 bg-white/90 p-6 backdrop-blur-lg border border-white/20 dark:border-white/20 border-slate-200/50"
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white dark:text-white text-slate-900">Color Themes</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full text-white dark:text-white text-slate-600 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-slate-200/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {colorThemes.map((colorTheme, index) => (
                  <motion.button
                    key={colorTheme.name}
                    className={`relative overflow-hidden rounded-xl p-4 text-left transition-all ${
                      currentTheme.name === colorTheme.name
                        ? "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                        : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary})`,
                    }}
                    onClick={() => onThemeChangeAction(colorTheme)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative z-10">
                      <div className="mb-2 text-sm font-medium text-white">{colorTheme.name}</div>
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorTheme.primary }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorTheme.secondary }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorTheme.accent }} />
                      </div>
                    </div>
                    {currentTheme.name === colorTheme.name && (
                      <motion.div
                        className="absolute right-2 top-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 text-xs text-slate-400 dark:text-slate-400 text-slate-600">
                Choose a color theme to customize your experience
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
