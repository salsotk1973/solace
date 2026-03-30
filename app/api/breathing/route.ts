import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pattern } = await req.json();

  const { error } = await supabaseAdmin.from("tool_sessions").insert({
    user_id: userId,
    tool: "breathing",
    session_data: {
      pattern,
      cycles: 5,
      completed_at: new Date().toISOString(),
    },
    completed: true,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
