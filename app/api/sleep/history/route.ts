import { getCurrentUserId } from '@/lib/auth-user'
import { supabaseAdmin } from '@/lib/supabase/server'
import { isPaidUser } from '@/lib/auth-plan'

const FREE_HISTORY_DAYS = 7

type SessionRow = {
  id: string
  created_at: string
  completed: boolean | null
  session_data: Record<string, unknown> | null
}

function getFreeCutoff(): Date {
  const d = new Date()
  d.setDate(d.getDate() - FREE_HISTORY_DAYS)
  return d
}

function calculateStreak(rows: { created_at: string }[]): number {
  if (!rows.length) return 0
  const days = new Set(
    rows.map(r => {
      const d = new Date(r.created_at)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    }),
  )
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (days.has(key)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

type SleepInsights = {
  mostUsedPattern: string | null
  sessionsThisWeek: number
  sessionsLastWeek: number
  weeklyChangeDirection: 'up' | 'down' | 'flat'
  bestStreakDays: number
}

function getWeekStart(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1
  start.setDate(start.getDate() - daysFromMonday)
  start.setHours(0, 0, 0, 0)
  return start
}

function calculateBestStreak(rows: { created_at: string }[]): number {
  const days = Array.from(new Set(rows.map(r => {
    const d = new Date(r.created_at)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
  }))).sort()
  let best = 0, current = 0
  let prev: string | null = null
  for (const day of days) {
    if (prev) {
      const prevDate = new Date(prev)
      prevDate.setDate(prevDate.getDate() + 1)
      const prevKey = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`
      current = prevKey === day ? current + 1 : 1
    } else { current = 1 }
    best = Math.max(best, current)
    prev = day
  }
  return best
}

function calculateSleepInsights(rows: SessionRow[]): SleepInsights {
  const patternCounts: Record<string, number> = {}
  for (const row of rows) {
    const pat = (row.session_data?.pattern as string) ?? 'unknown'
    patternCounts[pat] = (patternCounts[pat] ?? 0) + 1
  }
  const mostUsedPattern = Object.entries(patternCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  const thisWeekStart = getWeekStart(new Date())
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const sessionsThisWeek = rows.filter(r => new Date(r.created_at) >= thisWeekStart).length
  const sessionsLastWeek = rows.filter(r => {
    const d = new Date(r.created_at)
    return d >= lastWeekStart && d < thisWeekStart
  }).length

  const weeklyChangeDirection: 'up' | 'down' | 'flat' =
    sessionsThisWeek > sessionsLastWeek ? 'up' :
    sessionsThisWeek < sessionsLastWeek ? 'down' : 'flat'

  return {
    mostUsedPattern,
    sessionsThisWeek,
    sessionsLastWeek,
    weeklyChangeDirection,
    bestStreakDays: calculateBestStreak(rows),
  }
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const paid = await isPaidUser()
  const cutoff = getFreeCutoff()

  let query = supabaseAdmin
    .from('tool_sessions')
    .select('id, created_at, completed, session_data')
    .eq('user_id', userId)
    .eq('tool', 'sleep')
    .order('created_at', { ascending: false })
    .limit(50)

  if (!paid) {
    query = query.gte('created_at', cutoff.toISOString())
  }

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })

  let hasOlderSessions = false
  let oldestHiddenSessionDate: string | null = null

  if (!paid) {
    const { data: older } = await supabaseAdmin
      .from('tool_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('tool', 'sleep')
      .lt('created_at', cutoff.toISOString())
      .order('created_at', { ascending: true })
      .limit(1)

    if (older && older.length > 0) {
      hasOlderSessions = true
      oldestHiddenSessionDate = older[0].created_at as string
    }
  }

  const sessions = (data ?? []) as SessionRow[]
  const currentStreakDays = calculateStreak(sessions)
  const hasStreak = currentStreakDays > 0

  const { data: allSessions } = await supabaseAdmin
    .from('tool_sessions')
    .select('created_at, session_data')
    .eq('user_id', userId)
    .eq('tool', 'sleep')
    .eq('completed', true)
    .order('created_at', { ascending: false })

  const insights = paid ? calculateSleepInsights((allSessions ?? []) as SessionRow[]) : null

  return Response.json({
    sessions: sessions.map(s => ({
      id: s.id,
      createdAt: s.created_at,
      completed: !!s.completed,
      sessionData: s.session_data ?? null,
    })),
    isPaid: paid,
    hasOlderSessions,
    oldestHiddenSessionDate,
    historyWindowDays: paid ? null : FREE_HISTORY_DAYS,
    currentStreakDays,
    hasStreak,
    streakFraming: paid ? 'full' : 'teaser',
    insights,
    insightsFraming: paid ? 'full' : 'teaser',
  })
}
