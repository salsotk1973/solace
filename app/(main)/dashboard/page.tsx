import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageShell from "@/components/PageShell";
import { supabaseAdmin } from "@/lib/supabase/server";
import DashboardContent, { type DashboardData, type ToolSession } from "./DashboardContent";
import UpgradeBanner from "@/components/dashboard/UpgradeBanner";

// ─── Stats helpers ────────────────────────────────────────────────────────────

function calcStreak(sessions: ToolSession[]): number {
  if (!sessions.length) return 0;

  const days = new Set(
    sessions.map((s) => new Date(s.created_at).toISOString().split("T")[0]),
  );

  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (days.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

function calcWeekSessions(sessions: ToolSession[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return sessions.filter((s) => new Date(s.created_at).getTime() >= cutoff).length;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const showUpgradeBanner = params.upgraded === "true";

  // ── Clerk user info ────────────────────────────────────────────────────────
  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName ?? null;
  const email =
    clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

  // ── Supabase: plan + subscription data ────────────────────────────────────
  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("plan, subscription_status, stripe_customer_id")
    .eq("clerk_user_id", userId)
    .single();

  const plan: "free" | "paid" =
    dbUser?.plan === "paid" ? "paid" : "free";

  // ── Supabase: tool sessions ────────────────────────────────────────────────
  const [toolSessionsRes, focusSessionsRes] = await Promise.all([
    supabaseAdmin
      .from("tool_sessions")
      .select("id, tool, completed, created_at, session_data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("focus_sessions")
      .select("id, completed, created_at, duration_minutes, tag")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const toolSessions: ToolSession[] = (toolSessionsRes.data ?? []).map((s) => ({
    id: s.id as string,
    tool: s.tool as string,
    completed: Boolean(s.completed),
    created_at: s.created_at as string,
    session_data: (s.session_data as Record<string, unknown>) ?? {},
  }));

  const focusSessions: ToolSession[] = (focusSessionsRes.data ?? []).map((s) => ({
    id: s.id as string,
    tool: "focus-timer",
    completed: Boolean(s.completed),
    created_at: s.created_at as string,
    session_data: {
      duration_minutes: s.duration_minutes,
      tag: s.tag,
    },
  }));

  const allSessions: ToolSession[] = [...toolSessions, ...focusSessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const totalSessions = allSessions.length;
  const distinctTools = new Set(allSessions.map((s) => s.tool)).size;
  const streak = calcStreak(allSessions);
  const weekSessions = calcWeekSessions(allSessions);

  const data: DashboardData = {
    firstName,
    email,
    plan,
    sessions: allSessions,
    totalSessions,
    distinctTools,
    streak,
    weekSessions,
  };

  return (
    <PageShell>
      <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        <div
          style={{
            maxWidth:  "1100px",
            margin:    "0 auto",
            padding:   "0 40px",
            boxSizing: "border-box",
          }}
        >
          <UpgradeBanner show={showUpgradeBanner} />
        </div>
        <DashboardContent data={data} />
      </div>
    </PageShell>
  );
}
