import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy-initialised — same pattern as lib/supabase/server.ts
// Never instantiate at module scope: env vars are unavailable at Vercel build time.

let _client: SupabaseClient | null = null;

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
      if (!key) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
      _client = createClient(url, key);
    }
    return _client[prop as keyof SupabaseClient];
  },
});
