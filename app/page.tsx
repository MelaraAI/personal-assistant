"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Check if user is logged in and redirect to agent
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);

      if (data.user) {
        router.push("/agent");
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Checking login status...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">🎤 AI Voice Agent</h1>
      {user ? (
        <>
          <p className="text-green-400">You are logged in as {user.email}</p>
          <p>Redirecting to agent...</p>
        </>
      ) : (
        <>
          <p className="text-gray-400 mb-2">
            Please log in to access the voice assistant.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full text-lg"
          >
            Go to Login →
          </button>
        </>
      )}
    </main>
  );
}
