import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import DashboardContent, { type ToolSession } from "./DashboardContent";
import { supabaseAdmin } from "@/lib/supabase/server";
import PageShell from "@/components/PageShell";
import BgFlat from "@/components/backgrounds/BgFlat";

export const metadata = {
  title: "Dashboard — Solace",
};

function calculateStreak(sessions: ToolSession[]): number {
  if (!sessions.length) return 0;

  const sessionDates = new Set(
    sessions.map((s) => new Date(s.created_at).toISOString().split("T")[0]),
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

export default async function DashboardPage() {
  const clerkConfigured =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY);
  if (!clerkConfigured) {
    return (
      <DashboardSignedOutState
        title="Dashboard unavailable"
        description="Sign-in is not configured in this environment yet, so your dashboard is not available here."
      />
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return (
      <DashboardSignedOutState
        title="Sign in to view your dashboard"
        description="Your dashboard is ready when you are. Sign in to see your sessions, streak, and quick access tools."
      />
    );
  }

  const [user, { data: userData }, { data: rawSessions }] = await Promise.all([
    currentUser(),
    supabaseAdmin
      .from("users")
      .select("plan")
      .eq("clerk_user_id", userId)
      .single(),
    supabaseAdmin
      .from("tool_sessions")
      .select("id, tool, completed, created_at, session_data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const sessions: ToolSession[] = (rawSessions ?? []).map((s) => ({
    id: s.id as string,
    tool: s.tool as string,
    completed: Boolean(s.completed),
    created_at: s.created_at as string,
    session_data: (s.session_data ?? {}) as Record<string, unknown>,
  }));

  const firstName = user?.firstName ?? null;
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
  const plan: "free" | "paid" = (userData?.plan as "free" | "paid") ?? "free";
  const totalSessions = sessions.length;
  const distinctTools = new Set(sessions.map((s) => s.tool)).size;
  const streak = calculateStreak(sessions);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekSessions = sessions.filter(
    (s) => new Date(s.created_at) >= oneWeekAgo,
  ).length;

  return (
    <PageShell particles={false}>
      <BgFlat>
        <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
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
      </BgFlat>
    </PageShell>
  );
}

function DashboardSignedOutState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <PageShell particles={false}>
      <BgFlat>
        <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "0 40px",
              boxSizing: "border-box",
            }}
          >
            <section
              style={{
                borderRadius: "24px",
                padding: "40px clamp(24px, 4vw, 48px)",
                background: "linear-gradient(145deg, rgba(12, 10, 30, 0.92), rgba(8, 9, 26, 0.92))",
                border: "0.5px solid rgba(100,92,148,0.18)",
                boxShadow: "0 20px 70px rgba(3, 5, 10, 0.32)",
              }}
            >
            <p
              style={{
                margin: "0 0 14px",
                fontFamily: "'Jost', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(186, 178, 228, 0.58)",
              }}
            >
              Dashboard
            </p>
            <h1
              style={{
                margin: "0 0 14px",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "clamp(36px, 5vw, 56px)",
                lineHeight: 0.96,
                color: "rgba(235, 231, 255, 0.94)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                maxWidth: "640px",
                margin: 0,
                fontFamily: "'Jost', sans-serif",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "rgba(208, 202, 235, 0.76)",
              }}
            >
              {description}
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "28px" }}>
              <Link
                href="/sign-in"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "180px",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(248, 245, 255, 0.96)",
                  background: "linear-gradient(135deg, rgba(121, 103, 229, 0.92), rgba(86, 70, 180, 0.92))",
                  boxShadow: "0 12px 28px rgba(50, 37, 122, 0.32)",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/tools"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "180px",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(221, 214, 255, 0.84)",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "0.5px solid rgba(126, 118, 180, 0.2)",
                }}
              >
                Explore tools
              </Link>
            </div>
            </section>
          </div>
        </div>
      </BgFlat>
    </PageShell>
  );
}
