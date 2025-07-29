"use client";

import { useEffect } from "react";
import ClientOnly from "../components/ClientOnly";

function VoiceAgentContent() {
  // 🧠 Inject ElevenLabs widget + script dynamically
  useEffect(() => {
    const container = document.getElementById("voice-widget-container");
    if (!container) return;

    container.innerHTML = "";

    const widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", "agent_01k05htwesf6v9f1xd42snxxhj");
    console.log("🧠 Injecting widget without signed URL");

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";

    container.appendChild(widget);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-xl font-bold mb-4">🧠 Voice Agent Dashboard</h1>
      <p className="mb-4 text-gray-400">You can speak to the AI agent below (unsigned test):</p>

      <div
        id="voice-widget-container"
        className="border border-gray-700 p-4 rounded-lg bg-gray-900"
      />
    </div>
  );
}

// ✅ Wrap in ClientOnly to prevent hydration mismatch
export default function VoiceAgent() {
  return (
    <ClientOnly>
      <VoiceAgentContent />
    </ClientOnly>
  );
}
