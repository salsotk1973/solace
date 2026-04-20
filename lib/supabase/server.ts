import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key.
// Never import this in client components or expose to the browser.
// Lazy-initialised so it only runs at request time — not at build time.

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url)  throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!key)  throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

  _client = createClient(url, key);
  return _client;
}

// Backwards-compat export so existing imports of `supabaseAdmin` still work.
// This is a Proxy that calls getSupabaseAdmin() on first property access.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient];
  },
});
