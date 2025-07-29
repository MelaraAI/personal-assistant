"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.push("/agent")
      } else {
        router.push("/auth/error?error=Unable to log in")
      }
    }

    handleAuthRedirect()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <p>Logging you in...</p>
    </main>
  )
}
