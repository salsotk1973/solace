import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardContent, { type ToolSession } from "./DashboardContent";
import { supabaseAdmin } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard — Solace",
};

// ─── Streak calculation ────────────────────────────────────────────────────────

function calculateStreak(sessions: ToolSession[]): number {
  if (!sessions.length) return 0;

  const sessionDates = new Set(
    sessions.map((s) => new Date(s.created_at).toISOString().split("T")[0])
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    if (sessionDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const clerkConfigured =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY);
  if (!clerkConfigured) redirect("/");

  // Auth guard — middleware handles this but belt-and-suspenders
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Clerk user details
  const user      = await currentUser();
  const firstName = user?.firstName ?? null;
  const email     = user?.emailAddresses?.[0]?.emailAddress ?? null;

  // Plan from Supabase
  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("clerk_user_id", userId)
    .single();
  const plan: "free" | "paid" = (userData?.plan as "free" | "paid") ?? "free";

  // Sessions — fetch last 50 for stats, last 7 shown in UI
  const { data: rawSessions } = await supabaseAdmin
    .from("tool_sessions")
    .select("id, tool, completed, created_at, session_data")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  const sessions: ToolSession[] = (rawSessions ?? []).map((s) => ({
    id:           s.id as string,
    tool:         s.tool as string,
    completed:    Boolean(s.completed),
    created_at:   s.created_at as string,
    session_data: (s.session_data ?? {}) as Record<string, unknown>,
  }));

  // Stats
  const totalSessions = sessions.length;
  const distinctTools = new Set(sessions.map((s) => s.tool)).size;
  const streak        = calculateStreak(sessions);

  const oneWeekAgo  = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekSessions = sessions.filter(
    (s) => new Date(s.created_at) >= oneWeekAgo
  ).length;

  return (
    <>
      <main
        style={{
          minHeight:     "100vh",
          background:    "#050508",
          paddingTop:    "120px",
          paddingBottom: "100px",
        }}
      >
        {/* Atmospheric background */}
        <div
          aria-hidden="true"
          style={{
            position:      "fixed",
            top:           0,
            left:          0,
            width:         "100vw",
            height:        "100vh",
            background:    "radial-gradient(ellipse 80% 65% at 50% 38%, #0e0c1e 0%, #070610 52%, #050508 100%)",
            zIndex:        1,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 3 }}>
          <DashboardContent
            data={{
              firstName,
              email,
              plan,
              sessions,
              totalSessions,
              distinctTools,
              streak,
              weekSessions,
            }}
          />
        </div>
      </main>
    </>
  );
}
