import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pattern, cycles, duration_seconds } = await req.json();

  const { error } = await supabaseAdmin.from("tool_sessions").insert({
    user_id: userId,
    tool: "sleep",
    session_data: {
      pattern,
      cycles,
      duration_seconds: duration_seconds ?? null,
      completed:        true,
      completed_at:     new Date().toISOString(),
    },
    completed: true,
  });

  if (error) {
    console.error("[sleep] Supabase insert error:", error.message, error.details);
  }

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
