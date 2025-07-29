import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// ✅ Supabase client setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ ElevenLabs SDK setup
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function GET(req: NextRequest) {
  console.log("📥 Incoming GET /api/get-signed-url request");

  try {
    const authHeader = req.headers.get("authorization");
    console.log("🔐 Authorization header:", authHeader);

    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      console.warn("⛔ No token provided");
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { data, error } = await supabase.auth.getUser(token);
    console.log("🧾 Supabase auth data:", data);
    if (error || !data.user) {
      console.warn("⛔ Invalid user or error:", error);
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const user = data.user;
    console.log("👤 Authenticated user:", user.email);

const allowedEmails = ["viincentmelara@gmail.com", "rhayek@hayekinsurance.com", "team@melara.tech"];
if (!user.email || !allowedEmails.includes(user.email)) {
  console.warn("⛔ Unauthorized user:", user.email);
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}


    console.log("🤖 Requesting signed URL from ElevenLabs SDK...");
    const response = await elevenlabs.conversationalAi.conversations.getSignedUrl({
      agentId: process.env.ELEVENLABS_AGENT_ID!,
    });

    console.log("✅ ElevenLabs signed URL response:", response);

    return NextResponse.json({ signed_url: response.signedUrl });
  } catch (err) {
    console.error("❌ Error getting signed URL:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
