import { isPaidUser } from "@/lib/auth-plan";
import { getCurrentUserId } from "@/lib/auth-user";
import { supabaseAdmin } from "@/lib/supabase/server";

const FREE_HISTORY_DAYS = 7;

type BreathingPace = "slow" | "moderate" | "fast";
type WeeklyChangeDirection = "up" | "down" | "flat";

type BreathingSessionRow = {
  id: string;
  session_data: {
    pattern?: string;
    pace?: string;
    cycles?: number;
    completed_at?: string;
  } | null;
  completed: boolean | null;
  created_at: string;
};

type CompletedBreathingSessionRow = {
  created_at: string;
  session_data: {
    pattern?: string;
    pace?: string;
  } | null;
};

function getFreeCutoffDate() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - FREE_HISTORY_DAYS);
  return cutoff;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextDateKey(value: string) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return getDateKey(date);
}

function getWeekStart(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - daysFromMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getPaceFromSession(
  sessionData: CompletedBreathingSessionRow["session_data"],
): BreathingPace | null {
  if (
    sessionData?.pace === "slow" ||
    sessionData?.pace === "moderate" ||
    sessionData?.pace === "fast"
  ) {
    return sessionData.pace;
  }

  if (sessionData?.pattern === "478") return "slow";
  if (sessionData?.pattern === "box") return "moderate";

  return null;
}

function calculateCurrentStreakDays(rows: CompletedBreathingSessionRow[]) {
  const sessionDays = new Set(
    rows.map((row) => getDateKey(new Date(row.created_at))),
  );
  const cursor = new Date();
  let streak = 0;

  while (sessionDays.has(getDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function calculateBestStreakDays(rows: CompletedBreathingSessionRow[]) {
  const sessionDays = Array.from(
    new Set(rows.map((row) => getDateKey(new Date(row.created_at)))),
  ).sort();

  let bestStreak = 0;
  let currentStreak = 0;
  let previousDay: string | null = null;

  for (const day of sessionDays) {
    currentStreak =
      previousDay && day === getNextDateKey(previousDay)
        ? currentStreak + 1
        : 1;

    bestStreak = Math.max(bestStreak, currentStreak);
    previousDay = day;
  }

  return bestStreak;
}

function calculateWeeklyChangeDirection(
  sessionsThisWeek: number,
  sessionsLastWeek: number,
): WeeklyChangeDirection {
  if (sessionsThisWeek > sessionsLastWeek) return "up";
  if (sessionsThisWeek < sessionsLastWeek) return "down";
  return "flat";
}

function calculateBreathingInsights(rows: CompletedBreathingSessionRow[]) {
  const paceCounts: Record<BreathingPace, number> = {
    slow: 0,
    moderate: 0,
    fast: 0,
  };

  for (const row of rows) {
    const pace = getPaceFromSession(row.session_data);
    if (pace) paceCounts[pace] += 1;
  }

  const mostUsedPace = (Object.entries(paceCounts) as [BreathingPace, number][])
    .sort((a, b) => b[1] - a[1])
    .find(([, count]) => count > 0)?.[0] ?? null;

  const thisWeekStart = getWeekStart(new Date());
  const nextWeekStart = new Date(thisWeekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const sessionsThisWeek = rows.filter((row) => {
    const date = new Date(row.created_at);
    return date >= thisWeekStart && date < nextWeekStart;
  }).length;

  const sessionsLastWeek = rows.filter((row) => {
    const date = new Date(row.created_at);
    return date >= lastWeekStart && date < thisWeekStart;
  }).length;

  return {
    mostUsedPace,
    sessionsThisWeek,
    sessionsLastWeek,
    weeklyChangeDirection: calculateWeeklyChangeDirection(
      sessionsThisWeek,
      sessionsLastWeek,
    ),
    bestStreakDays: calculateBestStreakDays(rows),
  };
}

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paid = await isPaidUser();
  const cutoff = getFreeCutoffDate();

  let query = supabaseAdmin
    .from("tool_sessions")
    .select("id, session_data, completed, created_at")
    .eq("user_id", userId)
    .eq("tool", "breathing")
    .order("created_at", { ascending: false });

  if (!paid) {
    query = query.gte("created_at", cutoff.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const { data: completedData, error: completedError } = await supabaseAdmin
    .from("tool_sessions")
    .select("created_at, session_data")
    .eq("user_id", userId)
    .eq("tool", "breathing")
    .eq("completed", true)
    .order("created_at", { ascending: false });

  if (completedError) {
    return Response.json({ error: completedError.message }, { status: 500 });
  }

  const completedSessions = (completedData ?? []) as CompletedBreathingSessionRow[];
  const currentStreakDays = calculateCurrentStreakDays(
    completedSessions,
  );
  const hasStreak = currentStreakDays > 0;
  const insights = paid ? calculateBreathingInsights(completedSessions) : null;

  let hasOlderSessions = false;
  let oldestHiddenSessionDate: string | null = null;

  if (!paid) {
    const { data: olderData, error: olderError } = await supabaseAdmin
      .from("tool_sessions")
      .select("id, created_at")
      .eq("user_id", userId)
      .eq("tool", "breathing")
      .lt("created_at", cutoff.toISOString())
      .order("created_at", { ascending: true })
      .limit(1);

    if (olderError) {
      return Response.json({ error: olderError.message }, { status: 500 });
    }

    hasOlderSessions = (olderData ?? []).length > 0;
    oldestHiddenSessionDate = olderData?.[0]?.created_at ?? null;
  }

  const sessions = ((data ?? []) as BreathingSessionRow[]).map((session) => ({
    id: session.id,
    pattern: session.session_data?.pattern ?? "Breathing",
    cycles: session.session_data?.cycles ?? null,
    completed: !!session.completed,
    completedAt: session.session_data?.completed_at ?? session.created_at,
    createdAt: session.created_at,
  }));

  return Response.json({
    sessions,
    isPaid: paid,
    hasOlderSessions,
    oldestHiddenSessionDate,
    historyWindowDays: paid ? null : FREE_HISTORY_DAYS,
    currentStreakDays,
    hasStreak,
    streakFraming: paid ? "full" : "teaser",
    insights,
    insightsFraming: paid ? "full" : "teaser",
  });
}
