'use client'

import { useState, useEffect, useCallback } from 'react'

export type ToolHistorySession = {
  id: string
  createdAt: string
  completedAt?: string
  completed: boolean
  sessionData?: Record<string, unknown>
}

export type SleepInsights = {
  mostUsedPattern: string | null
  sessionsThisWeek: number
  sessionsLastWeek: number
  weeklyChangeDirection: 'up' | 'down' | 'flat'
  bestStreakDays: number
}

export type ToolHistoryResponse = {
  sessions: ToolHistorySession[]
  isPaid: boolean
  hasOlderSessions: boolean
  oldestHiddenSessionDate: string | null
  historyWindowDays: number | null
  currentStreakDays: number
  hasStreak: boolean
  streakFraming: 'full' | 'teaser'
  insights?: SleepInsights | null
  insightsFraming?: 'full' | 'teaser'
}

export function useToolHistory(toolSlug: string, userId: string | null) {
  const [history, setHistory] = useState<ToolHistoryResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const loadHistory = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/${toolSlug}/history`)
      if (!res.ok) return
      const data = await res.json() as ToolHistoryResponse
      setHistory(data)
    } catch {
      // History is supportive only — never block the tool
    } finally {
      setLoading(false)
    }
  }, [toolSlug, userId])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  const shouldShowUpgradePrompt = !!history &&
    !history.isPaid &&
    (history.hasOlderSessions ||
      (history.streakFraming === 'teaser' && history.currentStreakDays >= 2) ||
      history.sessions.length >= 2)

  return { history, loading, loadHistory, shouldShowUpgradePrompt }
}
