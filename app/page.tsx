"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, ChevronRight } from "lucide-react";
import LoginForm from "@/app/components/login-form";
import ChromaticBlob from "@/app/components/chromatic-blob";
import { useTheme } from "next-themes";
import ThemeToggle from "@/app/components/theme-toggle";
import ThemeCustomizer from "@/app/components/theme-customizer";
import FloatingElements from "@/app/components/floating-elements";
import ParticleField from "@/app/components/particle-field";
import AnimatedText from "@/app/components/animated-text";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const defaultTheme = {
  name: "Ocean",
  primary: "#4f46e5",
  secondary: "#06b6d4",
  accent: "#0891b2",
  background: "from-blue-950 to-cyan-950",
};

export default function Home() {
  const { theme } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [colorTheme, setColorTheme] = useState(defaultTheme);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🧠 Login check + redirect
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setLoading(false);

      if (data.user) {
        router.push("/agent");
      }
    };

    checkUser();
  }, [router]);

  // 🌈 Mouse movement background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("colorTheme");
    if (saved) {
      setColorTheme(JSON.parse(saved));
    }
  }, []);

  const handleThemeChange = (newTheme: typeof defaultTheme) => {
    setColorTheme(newTheme);
    localStorage.setItem("colorTheme", JSON.stringify(newTheme));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Checking login status...</p>
      </main>
    );
  }

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b ${
        theme === "dark" ? colorTheme.background : "from-slate-50 to-slate-100"
      } text-white dark:text-white text-slate-900 transition-all duration-1000`}
    >
      {/* Mouse follower */}
      <motion.div
        className="fixed pointer-events-none z-30 w-6 h-6 rounded-full mix-blend-difference"
        style={{
          background: `radial-gradient(circle, ${colorTheme.primary}40, transparent 70%)`,
        }}
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
      />

      {/* Backgrounds */}
      <ParticleField />
      <FloatingElements />
      <div className="fixed inset-0 z-0">
        <ChromaticBlob className="absolute top-[-20%] left-[-10%]" size={600} color1={colorTheme.primary} color2={colorTheme.secondary} speed={30} isDark={theme === "dark"} />
        <ChromaticBlob className="absolute bottom-[-30%] right-[-15%]" size={800} color1={colorTheme.secondary} color2={colorTheme.accent} speed={40} isDark={theme === "dark"} />
        <ChromaticBlob className="absolute top-[40%] right-[20%]" size={400} color1={colorTheme.accent} color2={colorTheme.primary} speed={20} isDark={theme === "dark"} />
      </div>

      <ThemeCustomizer onThemeChangeAction={handleThemeChange} currentTheme={colorTheme} />

      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary})` }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Mic className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold">Powered by Melara AI</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 20, delay: 0.2 }}
            >
              <ThemeToggle />
              <Button
                variant="ghost"
                className="rounded-full border border-white/20 dark:border-white/20 border-slate-300/50 px-6 text-sm backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 hover:bg-slate-200/50 dark:text-white text-slate-700 transition-all duration-300"
                onClick={() => setShowLogin(true)}
              >
                Login
              </Button>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="flex min-h-[80vh] flex-col items-center justify-center">
            {!showLogin ? (
              <motion.div
                className="max-w-2xl text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", damping: 20 }}
              >
                <AnimatedText
                  text="The Next Generation"
                  className="mb-2 text-4xl font-bold leading-tight tracking-tighter md:text-6xl"
                  delay={0.5}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <span
                    className="bg-gradient-to-r bg-clip-text text-transparent text-4xl font-bold leading-tight tracking-tighter md:text-6xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary})`,
                    }}
                  >
                    Voice Assistant
                  </span>
                </motion.div>

                <motion.p
                  className="mb-8 text-lg text-gray-600 md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  Experience the future of voice interaction with our AI-powered assistant. Please log in to access your personalized voice agent.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                >
                  <Button
                    className="rounded-full px-8 py-6 text-lg font-medium text-white hover:shadow-lg transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary})`,
                      boxShadow: `0 10px 30px ${colorTheme.primary}20`,
                    }}
                    onClick={() => setShowLogin(true)}
                  >
                    Get Started <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: 15 }}
                transition={{ duration: 0.6, type: "spring", damping: 20 }}
                className="w-full max-w-md"
              >
                <LoginForm onCancelAction={() => setShowLogin(false)} colorTheme={colorTheme} />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
