import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

function getWeekStart(): Date {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekStart = getWeekStart();

  const { data, error } = await supabaseAdmin
    .from("tool_sessions")
    .select("session_data, created_at")
    .eq("user_id", userId)
    .eq("tool", "gratitude")
    .gte("created_at", weekStart.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const entries = (data ?? []).map((row) => ({
    text: row.session_data?.entry ?? "",
    timestamp: row.created_at,
  }));

  return Response.json({ entries });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entry } = await req.json();

  const { error } = await supabaseAdmin.from("tool_sessions").insert({
    user_id: userId,
    tool: "gratitude",
    session_data: {
      entry,
      created_at: new Date().toISOString(),
    },
    completed: true,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
