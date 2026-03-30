import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const { count, error } = await supabaseAdmin
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    return Response.json(
      { ok: false, error: error.message, hint: "Run supabase/schema.sql in the Supabase SQL editor" },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, count: count ?? 0 });
}
