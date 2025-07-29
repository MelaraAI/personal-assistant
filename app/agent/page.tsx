"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { LogOut, Mic } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ClientOnly from "../components/ClientOnly";
import ChromaticBlob from "../components/chromatic-blob";
import ThemeToggle from "../components/theme-toggle";
import ThemeCustomizer from "../components/theme-customizer";
import FloatingElements from "../components/floating-elements";
import ParticleField from "../components/particle-field";

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

function VoiceAgentContent() {
  const { theme } = useTheme();
  const [colorTheme, setColorTheme] = useState(defaultTheme);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mouse movement background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Load saved theme
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const container = document.getElementById("voice-widget-container");
    if (!container) return;

    container.innerHTML = "";

    const widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", "agent_01k05htwesf6v9f1xd42snxxhj");
    widget.setAttribute("show-branding", "false");
    console.log("🧠 Injecting widget without signed URL");

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";

    container.appendChild(widget);
    container.appendChild(script);

    // Set loading to false after a short delay to allow widget to initialize
    setTimeout(() => setIsLoading(false), 1000);

    return () => {
      container.innerHTML = "";
    };
  }, []);

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
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </motion.div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="flex min-h-[80vh] flex-col items-center justify-center">
            <motion.div
              className="w-full max-w-4xl text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: "spring", damping: 20 }}
            >
              <motion.h1
                className="mb-4 text-4xl font-bold leading-tight tracking-tighter md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Your{" "}
                <span
                  className="bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary})`,
                  }}
                >
                  Voice Assistant
                </span>
              </motion.h1>

              <motion.p
                className="mb-8 text-lg text-gray-600 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Start a conversation with your AI-powered voice assistant
              </motion.p>

              <motion.div
                className="relative overflow-hidden rounded-3xl bg-white/5 dark:bg-white/5 bg-white/80 p-8 backdrop-blur-lg border border-white/10 dark:border-white/10 border-slate-200/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", damping: 20 }}
                whileHover={{
                  boxShadow: `0 25px 50px ${colorTheme.primary}20`,
                  transition: { duration: 0.3 },
                }}
              >
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-white/10 dark:bg-white/10 bg-white/80 backdrop-blur-sm rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
                        style={{ borderColor: colorTheme.primary }}
                      />
                      <p className="mt-4 text-slate-400 dark:text-slate-400 text-slate-600">
                        Initializing voice assistant...
                      </p>
                    </div>
                  </motion.div>
                )}
                
                <div id="voice-widget-container" className="min-h-[400px] flex items-center justify-center" />
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function VoiceAgent() {
  return (
    <ClientOnly>
      <VoiceAgentContent />
    </ClientOnly>
  );
}
