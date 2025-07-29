import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      redirect("/agent")
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(exchangeError?.message || 'Session exchange failed')}`)
    }
  }

  redirect(`/auth/error?error=${encodeURIComponent('Missing verification code')}`)
}
