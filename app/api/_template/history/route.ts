// TEMPLATE — copy this for each tool, replace TOOL_SLUG and TABLE_TOOL_VALUE
// The real table is always 'tool_sessions'; filter by the 'tool' column value.
//
// Usage:
//   1. cp -r app/api/_template/history app/api/<tool>/history
//   2. Replace TOOL_VALUE below with the tool slug (e.g. 'focus', 'mood', 'sleep')
//   3. Add any tool-specific session_data fields to the response map

import { getCurrentUserId } from '@/lib/auth-user'
import { supabaseAdmin } from '@/lib/supabase/server'
import { isPaidUser } from '@/lib/auth-plan'

const FREE_HISTORY_DAYS = 7
const TOOL_VALUE = 'REPLACE_ME' // e.g. 'focus' | 'mood' | 'sleep' | 'gratitude'

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

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const paid = await isPaidUser()
  const cutoff = getFreeCutoff()

  let query = supabaseAdmin
    .from('tool_sessions')
    .select('id, created_at, completed, session_data')
    .eq('user_id', userId)
    .eq('tool', TOOL_VALUE)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!paid) {
    query = query.gte('created_at', cutoff.toISOString())
  }

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Check for sessions older than the free window
  let hasOlderSessions = false
  let oldestHiddenSessionDate: string | null = null

  if (!paid) {
    const { data: older } = await supabaseAdmin
      .from('tool_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('tool', TOOL_VALUE)
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
  })
}
