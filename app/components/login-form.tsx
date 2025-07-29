"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ColorTheme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
}

interface LoginFormProps {
  onCancelAction: () => void
  colorTheme: ColorTheme
}

export default function LoginForm({ onCancelAction, colorTheme }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setErrorMessage("")

  const allowedEmails = ["viincentmelara@gmail.com", "rhayek@hayekinsurance.com", "team@melara.tech"];
if (!allowedEmails.includes(email.trim().toLowerCase())) {
  setErrorMessage("Access denied. Please enter the correct email to continue.");
  setIsLoading(false);
  return;
}


  // Get the current origin dynamically
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const redirectUrl = `${origin}/auth/confirm`
  
  // Log the redirect URL for debugging
  console.log("🔁 Redirect URL sent to Supabase:", redirectUrl)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { 
      shouldCreateUser: true,
      emailRedirectTo: redirectUrl,
    },
  })

  if (!error) {
    setSent(true)
  } else {
    setErrorMessage("Error sending magic link. Please try again.")
  }

  setIsLoading(false)
}


  // ✅ Redirect once the user is logged in via magic link
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/agent")
      }
    }

    // Check right away
    checkSession()

    // Listen for future auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/agent")
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  return (
    <motion.div
      className="overflow-hidden rounded-3xl bg-white/5 dark:bg-white/5 bg-white/80 p-8 backdrop-blur-lg border border-white/10 dark:border-white/10 border-slate-200/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        boxShadow: `0 25px 50px ${colorTheme.primary}20`,
        transition: { duration: 0.3 },
      }}
    >
      <div className="mb-6 flex items-center">
        <motion.div whileHover={{ scale: 1.1, rotate: -10 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 rounded-full text-slate-400 dark:text-slate-400 text-slate-400 hover:bg-white/10 dark:hover:bg-white/10 hover:bg-slate-200/50 hover:text-white dark:hover:text-white hover:text-slate-900"
            onClick={onCancelAction}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>
        <h2 className="text-2xl font-bold text-white dark:text-white text-slate-900">Login to Access</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <motion.div
            className="text-red-500 bg-red-900/20 px-4 py-3 rounded-xl text-center font-medium border border-red-500/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}

        {sent ? (
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-green-400 bg-green-900/20 px-4 py-3 rounded-xl border border-green-500/30">
              ✅ Magic link sent! Check your email and click the link to continue.
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Label htmlFor="email" className="text-sm text-slate-400 dark:text-slate-400 text-slate-400">
                Email
              </Label>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", damping: 20, stiffness: 300 }}>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="rounded-xl border-white/10 dark:border-white/10 border-slate-300/50 bg-white/5 dark:bg-white/5 bg-white/50 px-4 py-6 text-white dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 placeholder:text-slate-500 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 15px 40px ${colorTheme.primary}30`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-6 text-lg font-medium text-white transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary})`,
                  boxShadow: `0 10px 30px ${colorTheme.primary}20`,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending Magic Link...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </motion.div>
          </>
        )}
      </form>
    </motion.div>
  )
}
