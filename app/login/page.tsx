"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage("");

    const allowedEmails = ["viincentmelara@gmail.com", "rhayek@hayekinsurance.com"];
if (!allowedEmails.includes(email.trim().toLowerCase())) {
  setErrorMessage("Access denied. Please enter the correct email to continue.");
  return;
}


    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (!error) {
      setSent(true);
    } else {
      setErrorMessage("Error sending magic link. Please try again.");
    }
  };

  // ✅ Redirect once the user is logged in via magic link
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/agent");
      }
    };

    // Check right away
    checkSession();

    // Listen for future auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/agent");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">🔐 Login</h1>

      {errorMessage && (
        <div className="text-red-500 bg-red-900/20 px-4 py-2 rounded w-80 text-center font-medium border border-red-500">
          {errorMessage}
        </div>
      )}

      {sent ? (
        <p className="text-green-400 text-center w-80">
          ✅ Magic link sent! Check your email and click the link to continue.
        </p>
      ) : (
        <>
          <input
            className="px-4 py-2 rounded bg-gray-800 border border-gray-600 w-72 text-white"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-lg"
            onClick={handleLogin}
          >
            Send Magic Link
          </button>
        </>
      )}
    </main>
  );
}
