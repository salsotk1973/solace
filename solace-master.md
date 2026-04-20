# Solace Master Reference

## Product Definition

**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked):**
```
You know something needs to change. You just can't see it clearly yet.
Solace gives you the space to think it through — privately, gently, without judgement.
[Find some clarity →]
```

---

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Auth:** Clerk
- **Database:** Supabase (with RLS enabled)
- **Payments:** Stripe
- **Infrastructure:** Vercel
- **AI:** OpenAI (GPT for AI tools)
- **Email:** Brevo (transactional + marketing)
- **Caching:** Upstash Redis
- **Analytics:** PostHog, Google Search Console
- **Project root:** `solace-engine/`
- **Dev server:** localhost:3001

---

## Domain & Infrastructure

- **Production domain:** `try-solace.app` (Cloudflare Registrar)
- **Canonical URL:** `https://www.try-solace.app`
- **Vercel projects:** Two projects deploy from the same repo:
  - `solace` (S badge) — serves `www.try-solace.app` — **this is production**
  - `solace-clean` (N badge) — secondary, both must be green
- **Auto-deploy:** push to `main` → both Vercel projects deploy
- **Clerk:** Production instance active, domain verified, Google OAuth with real credentials
- **Google Cloud project:** `solace-493201` — OAuth credentials in `Solace Private` Google Drive folder
- **Stripe:** Live mode active ✅ — webhook configured, 6 events, 0% error rate

---

## Email Infrastructure (Complete)

### Google Workspace ✅
- **Plan:** Business Starter — A$11.80/month
- **Primary inbox:** `hello@try-solace.app` — real Gmail inbox, DKIM + SPF + DMARC all verified
- **Aliases (Send As):**
  - `privacy@try-solace.app` → routes to `hello@try-solace.app`
  - `legal@try-solace.app` → routes to `hello@try-solace.app`

### Brevo ✅ (Phase 1 complete)
- **Lists:** `Solace Users` ID 3, `Solace Newsletter` ID 5
- **Templates:** ID 1 Welcome, ID 2 Day 3, ID 3 Day 14
- **Automation #1** — Active: list 3 → wait 3d → template 2 → wait 11d → template 3 ✅
- **Clerk webhook** — on `user.created`: adds to list 3 + sends template 1 ✅

### Brevo Phase 2 (post-launch)
1. Welcome Day 2 + Day 5
2. Free-to-paid nudge Day 1, 4, 8
3. Re-engagement Day 14, 21, 30 no login
4. Post-upgrade onboarding Day 0, 3, 30

---

## Pricing (Locked)

- **Free tier:** All 8 client+AI tools with limits, 7-day history, Choose 1/day
- **Paid tier:** A$9/month or A$79/year
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history, patterns, export, streaks, Lab digest email

**Key insight:** 7-day history cutoff is the conversion trigger — day 8 is the natural upgrade moment.

---

## Category System (Locked)

| Category | Colour | Hex | Tools |
|---|---|---|---|
| **Calm** | Teal | `#3CC0D4` | Breathing, Sleep Wind-Down |
| **Clarity** | Gold | `#E8A83E` | Focus Timer, Mood Tracker, Gratitude Log, Clear Your Mind (AI) |
| **Decide** | Violet | `#7C6FCD` | Choose (AI), Break It Down (AI) |

**Tool count: 8 total** (Thought Reframer removed Apr 2026)

### The 5 Client-Side Tools
1. **Breathing** — Calm (teal)
2. **Sleep Wind-Down** — Calm (teal)
3. **Focus Timer** — Clarity (gold)
4. **Mood Tracker** — Clarity (gold)
5. **Gratitude Log** — Clarity (gold)

### The 3 AI Tools
- **Choose** — Decide (violet) — 1 session/day free, unlimited paid
- **Clear Your Mind** — Clarity (gold) — paid only
- **Break It Down** — Decide (violet) — paid only

---

## Thought Reframer — REMOVED ✅ (Apr 2026)

Removed entirely. Root cause: response was the user's own pre-selected button text — no AI, no real reframe, hollow mechanic.
- All files deleted, routes 308 → `/tools`
- `reframe` removed from design-tokens, middleware, sitemap, FAQ, dashboard
- Supabase: `DELETE FROM tool_sessions WHERE tool = 'reframe'` ✅
- Supabase schema: `reframe` removed from CHECK constraint ✅

---

## Design System (Locked)

### Colours
- **Background:** `#090d14` (dark navy)
- **Canonical teal:** `#3CC0D4` = `rgba(60,192,212,a)` — use `T = (a) => \`rgba(60,192,212,\${a})\``
- **Category colours:** import from `lib/design-tokens.ts` — never hardcode

### Typography
- **Display/headlines:** Cormorant Garamond (serif)
- **UI/body:** Jost (sans-serif)

### Text Standards
- Primary: `rgba(255,255,255,1.0)`
- Body: `rgba(255,255,255,0.80)`
- Secondary: `rgba(255,255,255,0.65)`
- **Never below 0.65 for functional text**

### Font Size Floors
- Labels: 11px minimum
- Body: 13px minimum
- Values: 14px minimum

### Components (Locked)
- SiteHeader.tsx and SiteFooter.tsx — **LOCKED, never modify**
- `PageShell` default `particles={false}` ✅
- `glassBackground()`, `glassBorder()`, `getToolRgb()` helpers from design-tokens

---

## Breathing Tool — Design Benchmark

Breathing is the design benchmark for all tools. 11 decisions locked:

1. Stop button = Begin button (solid filled pill)
2. SessionComplete = visible moment (bold, warm)
3. Info cards: Duration + Best For only (Pattern removed), compact sizing
4. History collapses on mobile behind toggle
5. Begin button py-3 for 44px tap target
6. Unselected free pill background T(0.15) minimum
7. All text ≥ 0.65 opacity minimum
8. Canonical teal `#3CC0D4` everywhere
9. Cross-links use `glassBackground()`, `glassBorder()`, `getToolRgb()` helpers
10. Cross-links hidden on mobile (`hidden md:block`)
11. Tool zone: no container on mobile (transparent wrapper only)

### BreathingOrb — Known Issue ⚠️
The orb animation has a flicker on phase transitions (inhale→exhale) caused by React `useState` re-renders (`setActivePhase`, `setPhaseDuration`, `setLabel`) tearing DOM mid-CSS-transition. Multiple rewrite attempts failed. **Do not attempt to fix without a proper local test environment and iterative debugging.** Current state: original React-state version restored (`e46f3ce`), flicker present but animation works.

### Breathing — Build State
- Mobile: no glow (removed — caused contained square appearance)
- Desktop: glow present, pulses with breathing
- Container: removed — elements float on dark page directly
- History toggle: mobile collapses, desktop always visible
- SessionComplete: slides up from bottom, teal border, "Well done.", bare × dismiss

---

## Build Infrastructure — Fixed ✅ (Apr 2026)

### Supabase Lazy-Init (critical)
Both Supabase files had module-scope `createClient()` crashing Vercel build. Fixed with Proxy lazy-init:
- `lib/supabase/server.ts` ✅
- `lib/supabase.ts` ✅ (health route imports this one — was the hidden second file)

### Stripe Lazy-Init (critical)
`new Stripe()` at module scope crashed build. Fixed with `getStripe()` lazy function in:
- `app/api/stripe/checkout/route.ts` ✅
- `app/api/stripe/portal/route.ts` ✅
- `app/api/stripe/webhooks/stripe/route.ts` ✅

### GitHub Actions Secrets (all set ✅)
All 9 secrets added via `gh secret set`:
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `BREVO_API_KEY`, `CLERK_WEBHOOK_SECRET`, `OPENAI_API_KEY`

Note: `STRIPE_SECRET_KEY` in GitHub Actions = `sk_test_` (correct for CI). Vercel uses `sk_live_`.

### Playwright CI
- `playwright.yml` updated with all secrets
- `e2e/clear-your-mind.spec.ts` — skips gracefully when unauthenticated (paid tool requires auth)
- `TEST_BASE_URL=https://www.try-solace.app` in CI env

---

## SEO ✅ (Apr 2026)

- Sitemap: `/sitemap.xml` — 17 pages, submitted Apr 15, last read Apr 18, Status: Success ✅
- Google Search Console: verified, 11 pages indexed
- `metadataBase: new URL("https://www.try-solace.app")` added to `layout.tsx` — fixes duplicate canonical issue ✅
- **Search Console issues:**
  - Duplicate canonical (2 pages) — fixed by metadataBase ✅
  - Page with redirect (2 pages) — Thought Reframer, resolves naturally
  - Discovered not indexed (11 pages) — resolves with traffic/time
  - Page indexed without content — `clerk.try-solace.app` (Clerk's domain, not ours, no action needed)

---

## Tool Build Status

### Free/Paid Gating — ALL TOOLS DONE ✅
| Tool | History API | 7-day cutoff | Upgrade prompt |
|---|---|---|---|
| Breathing | ✅ | ✅ | ✅ |
| Focus Timer | ✅ | ✅ | ✅ |
| Sleep Wind-Down | ✅ | ✅ | ✅ |
| Mood Tracker | ✅ | ✅ | ✅ |
| Gratitude Log | ✅ | ✅ | ✅ |
| Choose (AI) | — | — | ✅ daily nudge |
| Clear Your Mind (AI) | — | — | ✅ paid gate |
| Break It Down (AI) | — | — | ✅ paid gate |

### AI Tools — Safety & Routing ✅
- Crisis detection: 15/15 tests passing on production ✅
- Cross-tool routing: all redirects working ✅
- Dashboard session logging: all 3 AI tools logging ✅

### Stripe ✅ LIVE
- End-to-end test PASSED (A$9 real payment → webhook → Supabase plan=paid → refunded) ✅
- Live webhook active, 0% error rate ✅

### Supabase
- Status: Healthy, not paused
- Plan: NANO (Free) — **upgrade to Pro at launch** ($25/month, daily backups)

### PostHog ✅
- Firing on all routes, internal users filtered

### Clerk Webhook ✅
- `user.created` → Supabase upsert + Brevo contact + welcome email

---

## Still Needed (priority order)

- [ ] **BreathingOrb flicker** — needs proper local debugging, not spec-based guessing. Use Claude Code interactively with dev server running.
- [ ] **Sleep Wind-Down** — apply Breathing benchmark (mobile layout, colours, history toggle)
- [ ] **Global tool polish** — apply Breathing benchmark to Focus Timer, Mood Tracker, Gratitude Log
- [ ] **Upgrade Supabase to Pro** — at launch
- [ ] Newsletter opt-in UI (dashboard checkbox → Brevo list 5)
- [ ] Brevo Phase 2 email sequences (post-launch)
- [ ] Export feature (not built for any tool)
- [ ] PostHog saved insights (after 7 days traffic)
- [ ] Sitemap update — add Lab article URLs post-launch
- [ ] notice-whats-good Lab category: only 2 articles, needs more
- [ ] Reddit account + first post (r/Anxiety, r/Meditation, r/productivity, r/mentalhealth)
- [ ] Google Postmaster Tools — register `try-solace.app`

---

## Pages Status

| Page | Status |
|---|---|
| Home | ✅ |
| Tools | ✅ Pricing A$9/A$79, FAQ 8 questions |
| Pricing | ✅ Mobile responsive, A$9/A$79 |
| Lab | ✅ Editor's Pick + 6 most recent |
| Lab Archive | ✅ All 15 articles, filter pills |
| About | ✅ |
| Principles | ✅ |
| Privacy | ✅ |
| Terms | ✅ |
| Dashboard | ✅ All 8 tools, AI sessions logging ✅ |

---

## Lab — Human Behaviour Lab

### Article Count: 15 total
| Slug | Category |
|---|---|
| `why-you-cant-stop-overthinking` | think-clearly (featured) |
| `how-to-feel-less-overwhelmed` | think-clearly |
| `how-box-breathing-actually-works` | calm-your-state |
| `why-you-cant-focus` | calm-your-state |
| `how-to-wind-down-before-sleep` | calm-your-state |
| `what-is-cognitive-reframing` | think-clearly |
| `how-to-track-your-mood` | think-clearly |
| `does-gratitude-journalling-work` | notice-whats-good |
| `how-to-make-a-hard-decision` | think-clearly |
| `what-is-the-human-behaviour-lab` | think-clearly |
| `why-you-feel-anxious-for-no-reason` | calm-your-state |
| `how-to-stop-worrying-about-things-you-cant-control` | calm-your-state |
| `what-is-decision-fatigue` | think-clearly |
| `how-to-stop-being-so-hard-on-yourself` | notice-whats-good |
| `how-to-actually-rest` | calm-your-state |

**Category balance:** Calm 5, Think clearly 6, Notice what's good 2 ← needs more

---

## Key Rules (Never Break)

- Read solace-master before any work
- SiteHeader.tsx and SiteFooter.tsx — **LOCKED**
- Background always `#090d14`
- Never define colours inline — always `lib/design-tokens.ts`
- Never below 0.65 opacity for functional text
- Never below 11px for visible text
- Always use Claude Code for implementation
- `'use client'` components must return `<div>` root, never `<>` fragment
- Specs via bash_tool, presented with present_files — **never widgets**
- Always `await` Supabase inserts in Vercel serverless — `void` promises dropped on exit
- AI tool routes must NOT be in `isPublicRoute` in middleware.ts
- Never use module-scope `createClient()` or `new Stripe()` — always lazy-init
- Verify Vercel deployment is Current AND check live bundle before claiming fix is deployed

---

## Master Files Workflow

**GitHub raw URL:** `https://raw.githubusercontent.com/salsotk1973/solace/main/solace-master.md`

### Session Start
```
Load solace-master. Working on: [specific task]. Go.
```

### Updating
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean
git add solace-master.md
git commit -m "Update: [what changed]"
git push
```