-- ─── Users ────────────────────────────────────────────────────────────────────
-- Synced from Clerk via webhook on user.created / user.updated

CREATE TABLE public.users (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id  text UNIQUE NOT NULL,
  email          text NOT NULL,
  plan           text DEFAULT 'free' CHECK (plan IN ('free', 'paid')),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ─── Tool sessions ────────────────────────────────────────────────────────────
-- Tracks usage across all tools

CREATE TABLE public.tool_sessions (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      text REFERENCES public.users(clerk_user_id),
  tool         text NOT NULL CHECK (tool IN ('clear-your-mind', 'choose', 'break-it-down', 'breathing', 'focus-timer', 'reframe', 'mood', 'gratitude', 'sleep')),
  session_data jsonb DEFAULT '{}',
  completed    boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- ─── Mood entries ─────────────────────────────────────────────────────────────

CREATE TABLE public.mood_entries (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     text REFERENCES public.users(clerk_user_id),
  mood_score  integer CHECK (mood_score BETWEEN 1 AND 10),
  note        text,
  created_at  timestamptz DEFAULT now()
);

-- ─── Focus sessions ───────────────────────────────────────────────────────────

CREATE TABLE public.focus_sessions (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           text REFERENCES public.users(clerk_user_id),
  duration_minutes  integer NOT NULL,
  completed         boolean DEFAULT false,
  tag               text,
  created_at        timestamptz DEFAULT now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (clerk_user_id = auth.uid()::text);

CREATE POLICY "Users can read own sessions" ON public.tool_sessions
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "Users can read own mood entries" ON public.mood_entries
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "Users can read own focus sessions" ON public.focus_sessions
  FOR ALL USING (user_id = auth.uid()::text);
