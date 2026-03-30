import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const checkedAt = new Date().toISOString();

  // Check Supabase
  let supabaseStatus: "ok" | "down" = "ok";
  try {
    const { error } = await supabaseAdmin
      .from("users")
      .select("id")
      .limit(1);
    if (error) {
      supabaseStatus = "down";
    }
  } catch {
    supabaseStatus = "down";
  }

  // Check OpenAI by calling the dedicated health endpoint
  let openaiStatus: "ok" | "down" = "ok";
  try {
    const baseUrl = new URL(request.url).origin;
    const res = await fetch(`${baseUrl}/api/health/openai`);
    const data = await res.json();
    if (data?.status !== "ok") {
      openaiStatus = "down";
    }
  } catch {
    openaiStatus = "down";
  }

  const bothDown = supabaseStatus === "down" && openaiStatus === "down";
  const oneDown = supabaseStatus === "down" || openaiStatus === "down";
  const overallStatus = bothDown ? "down" : oneDown ? "degraded" : "ok";

  return NextResponse.json(
    {
      status: overallStatus,
      services: {
        supabase: supabaseStatus,
        openai: openaiStatus,
      },
      checked_at: checkedAt,
    },
    { status: 200 },
  );
}
