# Solace Master Reference

## Product Definition

**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked, mobile + desktop):**
```
When your mind won't settle, it's hard to think clearly.
Solace helps you find the next right step — through thought, not noise.
```

**Launch date: 15 April 2026.** Solace is LIVE in production with real users. Every change ships to production traffic. Apply post-launch risk discipline to all specs (smallest correct change, mitigate before cleanup, verify deploys against live DOM).

---

## Tech Stack
- **Frontend:** Next.js 15 (Turbopack), TypeScript, Tailwind CSS
- **Auth:** Clerk
- **Database:** Supabase (with RLS enabled)
- **Payments:** Stripe (LIVE mode active)
- **Infrastructure:** Vercel
- **AI:** OpenAI (GPT for AI tools)
- **Email:** Brevo (transactional + marketing)
- **Caching:** Upstash Redis
- **Analytics:** PostHog, Google Search Console
- **Dev server:** localhost:3001

---

## Domain & Infrastructure
- **Production domain:** `try-solace.app` (Cloudflare Registrar)
- **Canonical URL:** `https://www.try-solace.app`
- **GitHub:** `https://github.com/salsotk1973/solace` — `main` is deploy branch
- **Vercel projects:** `solace` (production) + `solace-clean` (secondary)
- **Auto-deploy:** push to `main` → both Vercel projects deploy
- **Clerk:** Production instance active, Google OAuth configured
- **Stripe:** Live mode, webhook configured, 6 events, 0% error rate

---

## Email Infrastructure

### Google Workspace ✅
- **Plan:** Business Starter — A$11.80/month
- **Primary inbox:** `hello@try-solace.app`
- **Aliases:** `privacy@`, `legal@` → `hello@`

### Brevo ✅ (Phase 1 complete)
- **Lists:** `Solace Users` ID 3, `Solace Newsletter` ID 5
- **Templates:** ID 1 Welcome, ID 2 Day 3, ID 3 Day 14
- **Automation #1** active: list 3 → wait 3d → template 2 → wait 11d → template 3 ✅
- **Clerk webhook** on `user.created`: adds to list 3 + sends template 1 ✅

### Brevo Phase 2 (post-launch)
- Welcome Day 2 + Day 5
- Free-to-paid nudge Day 1, 4, 8
- Re-engagement Day 14, 21, 30
- Post-upgrade onboarding Day 0, 3, 30

---

## Pricing (Locked)

- **Free tier:** All tools with limits, 7-day history, Choose 1/day free
- **Paid tier:** A$9/month or A$79/year
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history, patterns, streaks, export, early access

**Conversion trigger:** 7-day history cutoff = day 8 is natural upgrade moment.

---

## Category System (Locked)

| Category | Colour | Hex | Tools |
|---|---|---|---|
| **Calm** | Teal | `#3CC0D4` | Breathing, Sleep Wind-Down |
| **Clarity** | Gold | `#E8A83E` | Focus Timer, Mood Tracker, Gratitude Log, Clear Your Mind (AI) |
| **Decide** | Violet | `#7C6FCD` | Choose (AI), Break It Down (AI) |

**Tool count: 8 total** (Thought Reframer removed Apr 2026)

### The 5 Client-Side Tools
Breathing, Sleep Wind-Down (Calm) · Focus Timer, Mood Tracker, Gratitude Log (Clarity)

### The 3 AI Tools
- **Choose** — Decide (violet) — 1/day free, unlimited paid
- **Clear Your Mind** — **Clarity (GOLD)** — paid only ⚠️ NOT violet — easy mistake
- **Break It Down** — Decide (violet) — paid only

**TRAP:** "All AI tools = violet" is wrong. Clear Your Mind is gold. Always verify against this table when colour-mapping AI tool components.

---

## Removed / Deprecated

### Thought Reframer — REMOVED ✅ (Apr 2026)
Removed entirely. Routes 308 → `/tools`. All DB records deleted. Removed from design-tokens, middleware, sitemap, FAQ, dashboard. All 15 Lab article references cleaned up.

### `/api/reflect` — Auth-gated legacy endpoint (Apr 2026)
- Used only by disabled `app/(main)/tools/[slugdisabled]/` via `components/tool-interface/ThreadContainer.tsx`
- The `[slugdisabled]` folder rename is a Next.js soft-delete pattern — functionally disables the route without deleting code
- Endpoint receives no traffic from any active Solace UI
- Auth-gated 26 Apr 2026 to prevent unauthenticated abuse (bot scans draining OpenAI tokens)
- Defence-in-depth: middleware + in-route `auth()` check
- LEGACY comment block in `app/api/reflect/route.ts` documents removal plan

---

## Tech Debt — Post-Launch (deferred, do NOT bundle with feature work)

### Remove legacy tool-interface system
- Delete `app/(main)/tools/[slugdisabled]/`
- Delete `components/tool-interface/ThreadContainer.tsx` and dependencies
- Delete `app/api/reflect/`
- **Audit before removing:** `tool-interface/` may import shared components used elsewhere. Run grep for every component import in that directory across the codebase. Remove only files with zero external references.
- Estimated effort: 30-min spec, low risk if audit is clean.
- Dedicated spec only — never bundle with feature work.

### Vercel "middleware → proxy" file convention
- Build log warns: *"The 'middleware' file convention is deprecated. Please use 'proxy' instead."*
- Next.js 16 future-deprecation warning. Build still succeeds. Production unaffected.
- Wait for Clerk to publish guidance on `proxy.ts` migration before renaming. Clerk SDK assumes `middleware.ts` by default.
- Revisit when Clerk publishes migration guide.

### Vercel env-var hygiene
- Several Production-scoped secrets currently selected as "All Environments" → "Sensitive" toggle blocked because Sensitive isn't supported on Development.
- Action: uncheck Development on each, enable Sensitive, save.
- Variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BREVO_API_KEY`, `CLERK_WEBHOOK_SECRET`, `CLERK_SECRET_KEY`, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Local dev uses `.env.local`, not Vercel Development env — safe to remove.
- **Critical reminder:** `.env.local` lives ONLY on Juan's laptop. Back it up to password manager (1Password, Bitwarden) as a Secure Note. Never commit. Confirm `.gitignore` includes `.env.local`.

### PostHog local dev (resolved)
- `.env.local` was missing `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` → console error on `localhost:3001`. Production unaffected (vars set in Vercel).
- Fix: copy both `NEXT_PUBLIC_POSTHOG_*` lines from Vercel dashboard to `.env.local`. Restart `npm run dev`.
- For full local/prod env-var sync: `vercel env pull .env.from-vercel --environment=production` then diff against `.env.local`.

### Mood + Gratitude SessionComplete
- Apply Breathing benchmark to both. Messages already locked: Mood `Noted.` / Gratitude `Captured.`

### BreathingOrb flicker on phase transitions
- Original React-state version restored (`e46f3ce`). Do NOT attempt without local interactive debugging.

---

## Design System (Locked)

### Colours
- **Background:** `#090d14`
- **Canonical teal:** `#3CC0D4` = `rgba(60,192,212,a)` — `T = (a) => \`rgba(60,192,212,${a})\``
- **Category colours:** import from `lib/design-tokens.ts` — never hardcode
- **`getToolRgb(tool)` helper** — derive canonical RGB from tool slug
- **`getToolRgb()` rule (lesson 42):** covers all tool + category keys; warns in dev on unknown key; falls back to neutral grey in prod. **NEVER throws.** Throwing on unknown key crashes entire pages — caused the Mood + Gratitude outage Apr 24.

### Typography
- **Display/headlines:** Cormorant Garamond (serif)
- **UI/body:** Jost (sans-serif)

### Text Standards
- Primary: `rgba(255,255,255,1.0)`
- Body: `rgba(255,255,255,0.80)`
- Secondary: `rgba(255,255,255,0.65)`
- **Never below 0.65 for functional text**

### Font Size Floors
- Labels: 11px minimum (functional/body text)
- Body: 13px minimum
- Values: 14px minimum
- **Exception:** labels embedded in tight visual containers (timer circle, badge, pill) may use 10px. The 11px floor applies to body/functional text, not shape-embedded captions.

### Border Rule (lesson 43)
- Always use the shorthand `borderColor` CSS property when setting all four sides equal.
- Per-side properties (`borderTopColor`, `borderRightColor`, etc.) = 4 chances to forget one side and ship a white-line-on-dark bug.
- `rounded-X` without a corresponding `border-X` (or visible border colour) = invisible rounded corners — caused the Full History card "missing top edge" bug Apr 2026.

### Components (Locked)
- **SiteHeader.tsx — LOCKED with one documented exception** (see SiteHeader section)
- **SiteHeaderMobileMenu.tsx** — React Portal pattern (see Drawer section)
- SiteFooter.tsx — see footer section
- `PageShell` default `particles={false}` ✅
- `glassBackground()`, `glassBorder()`, `getToolRgb()` from design-tokens

---

## SiteHeader — LOCKED with documented exception ✅ (Apr 2026)

**SiteHeader.tsx is LOCKED. One documented modification was made Apr 2026 to fix mobile full-width.**

### The fix (DO NOT REVERT)
The header's background gradient div uses inline styles. Original (broken):
```
left: max(24px, calc(50% - 696px));
right: max(24px, calc(50% - 696px));
```

Fixed:
```
left: max(0px, calc(50% - 696px));
right: max(0px, calc(50% - 696px));
```

**Hard rule: Never revert `max(0px, ...)` back to `max(24px, ...)`.**

---

## Mobile Menu Drawer — Fixed ✅ (Apr 2026)

**Component:** `components/SiteHeaderMobileMenu.tsx`

Drawer rendered via React Portal to `document.body` to escape SiteHeader's `backdrop-filter` containing block.

**Hard rule: Never inline the drawer back into SiteHeader.** Must remain rendered via portal.

---

## Homepage — Desktop ✅ LOCKED (Apr 2026)

### Section Order (locked)
Hero → FREE — START HERE → AI Tools → FROM THE LAB → Footer

### Hero (desktop)
- `md:pt-[200px] md:pb-16` — deterministic, no min-h
- Headline `md:text-[64px]` with non-breaking space: `won't{"\u00A0"}settle,`
- Headline line-height `md:leading-[1.0]`
- **No CTA on desktop** (Spec 02b)
- **Nav offset rule:** with 80px fixed nav, hero `md:pt-[200px]` = 80 nav + 120 air

### FREE — START HERE
- Container `max-w-6xl mx-auto px-6 md:px-12 lg:px-24`
- Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- 6 cards (Breathing, Focus Timer, Sleep Wind-Down, Mood Tracker, Gratitude Log, All tools)

### AI Tools (desktop)
- Section headline `md:text-4xl` (36px)
- Card `md:min-h-[320px]`, body `md:leading-[1.6]`

### Lab Section (desktop)
- 3 equal columns. **No col-span-2 hero.**
- Section padding `py-8 md:py-10`

### Footer (desktop)
- Backdrop blur + dark gradient REMOVED
- SOLACE wordmark below bottom bar: Cormorant 18px, `letterSpacing: 0.32em`, `rgba(255,255,255,0.12)`

---

## Mobile Homepage — LOCKED ✅ (Apr 2026)

### Hero
- `pt-[18vh]`
- Hairline divider between hero and FREE START HERE removed

### Lab Cards
- All 3 cards stack vertically
- "Editor's pick" pill visible on mobile
- Gap `gap-4` (16px) uniform

### Footer (mobile)
1. 5 product/learn links centered
2. 2 legal links centered
3. Hairline divider 32px wide, 0.5px, `rgba(255,255,255,0.18)`
4. Centered disclaimer max 320px, 12px, lh 1.7, 0.65 opacity
5. `© 2026 · Built with care.` 11px 0.65
6. SOLACE wordmark Cormorant 18px, 0.32em letter-spacing, 0.55 opacity

---

## Tools, Lab landing, Lab archive, Article template, Article CTAs

(Locked Apr 2026 — see prior master version for full details. No changes this update cycle.)

---

## SessionComplete v3 — LOCKED ✅ (Apr 2026)

### Architecture
Per-tool components extracted into separate files (one for each of Breathing, Sleep, Focus, Mood, Gratitude). Mood was extracted from inline JSX inside MoodSession.tsx.

### Layout (mobile)
Compact two-row mobile layout:
- Row 1: eyebrow + close (✕)
- Row 2: title (Cormorant italic)
- Row 3: full-width body
- Row 4: dual CTA — primary (solid-tinted) START FREE + ghost ALL TOOLS

### Dual CTA pattern (lesson 38 — conversion protection)
- Primary: solid-tinted in tool's accent colour (`bg: rgba(accent, 0.08-0.10)`, `border: rgba(accent, 0.70)`, `color: rgba(accent, 0.95)`)
- Secondary: ghost in tool's accent colour (`border: rgba(accent, 0.35)`, `color: rgba(accent, 0.70)`)
- Stacks vertically below 350px viewport

### Per-tool locked copy
| Tool | Title | Body | Primary | Secondary |
|---|---|---|---|---|
| Breathing | `Well done.` | `Save history and track streaks with a free account.` | `START FREE →` | `ALL TOOLS →` |
| Sleep Wind-Down | `Rest well.` | `Save history and track streaks.` | `START FREE →` | `ALL TOOLS →` |
| Focus Timer | `Good work.` | `Save sessions and track focus patterns with a free account.` | `START FREE →` | `ALL TOOLS →` |
| Mood Tracker | `Noted.` | TBD | `START FREE →` | `ALL TOOLS →` |
| Gratitude Log | `Captured.` | TBD | `START FREE →` | `ALL TOOLS →` |

### Three-layer colour enforcement (lesson 37)
1. `getToolRgb()` audit — function returns the right RGB string
2. EXPECTED ACCENT comments inline in each SessionComplete file:
   ```ts
   // EXPECTED ACCENT:
   //   breathing  → 60, 192, 212 (teal, Calm)
   //   sleep      → 60, 192, 212 (teal, Calm)
   //   focus      → 232, 168, 62 (gold, Clarity)
   //   mood       → 232, 168, 62 (gold, Clarity)
   //   gratitude  → 232, 168, 62 (gold, Clarity)
   ```
3. Pre-deploy DevTools paste verification (bash query rgba values on live page)

### PostHog event tracking
Both CTAs fire `session_complete_cta_clicked` with `action: 'start_free' | 'all_tools'`.

---

## AI Tools Auth UX — LOCKED ✅ (Apr 2026)

### Architecture
Shared `components/shared/AuthMessage.tsx` component handles all unauthenticated/quota-exhausted/paid-required states for the 3 AI tools.

### Trigger conditions
| Tool | 401 (logged out) | 403 (free plan) | 429 (quota) |
|---|---|---|---|
| Choose | `logged-out` | — | `quota-exhausted` |
| Clear Your Mind | `logged-out` | `paid-required` | — |
| Break It Down | `logged-out` | `paid-required` | — |

**Status code discipline (lesson 49):** API routes must return distinct codes (401/403/429) so the frontend can pick the right variant. One status code for all failures = ambiguous frontend state.

### Locked copy
| Tool | Variant | Title | Body | Primary | Secondary |
|---|---|---|---|---|---|
| Choose | logged-out | `Almost there.` | `Choose is part of your free account. Sign in to continue your decision.` | `SIGN IN →` | `CREATE ACCOUNT →` |
| Choose | quota-exhausted | `That's today's session.` | `Choose is one decision per day on the free plan. Tomorrow it resets — or unlock unlimited now.` | `UPGRADE →` | `BACK TO TOOLS →` |
| Clear Your Mind | logged-out | `Almost there.` | `Clear Your Mind is part of a paid account. Sign in to keep going.` | `SIGN IN →` | `CREATE ACCOUNT →` |
| Clear Your Mind | paid-required | `One step away.` | `Clear Your Mind is part of the paid plan. Unlock it for A$9/month.` | `UPGRADE →` | `BACK TO TOOLS →` |
| Break It Down | logged-out | `Almost there.` | `Break It Down is part of a paid account. Sign in to keep going.` | `SIGN IN →` | `CREATE ACCOUNT →` |
| Break It Down | paid-required | `One step away.` | `Break It Down is part of the paid plan. Unlock it for A$9/month.` | `UPGRADE →` | `BACK TO TOOLS →` |

### Per-tool canonical colour
- Choose → violet (Decide)
- **Clear Your Mind → gold (Clarity)** ⚠️ not violet
- Break It Down → violet (Decide)

### Layout
On 401/403/429, the entire form/results area is replaced with `<AuthMessage>` panel. No partial state.

---

## Focus Timer — sound architecture (Apr 2026)

### Sounds
- `/sounds/focus-start.mp3` — start of focus block
- `/sounds/rest-start.mp3` — start of rest block
- `/sounds/session-done.mp3` — full Pomodoro complete
- `/audio/silent-loop.mp3` — iOS Web Audio unlock loop (must be ≤ 3 KB; verify silence audibly before shipping)

### One sound set for all presets (lesson 48 — locked product decision)
Pomodoro 25/5, Custom, Deep Work, Flow ALL use the same 3 sounds. Sound personalisation per preset rejected pre-launch — complexity outweighs differentiation. Revisit only if post-launch data shows mute-rate varies meaningfully between presets.

### iOS Safari Web Audio unlock pattern (lesson 40)
Three things together; missing any one = silent on mobile:
1. AudioContext created/resumed inside user-gesture handler (not at component mount)
2. 1-sample silent buffer played on first gesture to unlock
3. Silent `<audio loop muted volume:0>` element override iPhone silent switch
   - File must be truly silent (verify ≤ 3 KB)
   - `muted` attribute in JSX (compile-time guarantee)
   - `volume: 0` set on ref (belt + braces)

### Timer label typography
- `text-[10px] md:text-[13px]` for `tap to start` / `tap to resume` / `tap to pause`
- 10px exception to 11px floor — labels embedded in tight visual containers permitted

---

## Pages Status

| Page | Status |
|---|---|
| Home (mobile) | ✅ LOCKED Apr 2026 |
| Home (desktop) | ✅ LOCKED Apr 2026 |
| Tools (mobile) | ✅ LOCKED Apr 2026 |
| Tools (desktop) | ✅ |
| Lab landing (mobile) | ✅ LOCKED Apr 2026 |
| Lab landing (desktop) | ✅ LOCKED Apr 2026 |
| Lab archive (mobile) | ✅ LOCKED Apr 2026 |
| Lab archive (desktop) | ✅ LOCKED Apr 2026 |
| Article template | ✅ LOCKED Apr 2026 |
| Article CTAs | ✅ LOCKED Apr 2026 |
| All 15 Lab articles | ✅ Zero TR references |
| SiteHeader | ✅ LOCKED Apr 2026 (with documented exception) |
| Mobile menu drawer | ✅ LOCKED Apr 2026 (React Portal) |
| Pricing | ✅ A$9/A$79 |
| About / Principles / Privacy / Terms | ✅ |
| Dashboard | ✅ All 8 tools, AI sessions logging |
| **SessionComplete (Breathing, Sleep, Focus)** | ✅ LOCKED Apr 2026 (v3 dual-CTA) |
| **SessionComplete (Mood, Gratitude)** | ⏳ Pending Breathing-benchmark application |
| **AI tools auth UX** | ✅ LOCKED Apr 2026 (AuthMessage shared component) |
| **/api/reflect** | ✅ Auth-gated Apr 2026 (legacy, scheduled for post-stable-month removal) |

---

## Lab — Human Behaviour Lab

### 15 articles
(Same as previous master — zero TR references, all CTAs current tools.)

**Category balance:** Calm 5, Think clearly 6, Notice what's good 2 ← needs more

---

## Tool Build Status

### Free/Paid Gating

| Tool | History API | 7-day cutoff | Upgrade prompt | SessionComplete v3 |
|---|---|---|---|---|
| Breathing | ✅ | ✅ | ✅ | ✅ |
| Sleep Wind-Down | ✅ | ✅ | ✅ | ✅ |
| Focus Timer | ✅ | ✅ | ✅ | ✅ |
| Mood Tracker | ✅ | ✅ | ✅ | ⏳ |
| Gratitude Log | ✅ | ✅ | ✅ | ⏳ |
| Choose (AI) | — | — | ✅ AuthMessage | ✅ |
| Clear Your Mind (AI) | — | — | ✅ AuthMessage | ✅ |
| Break It Down (AI) | — | — | ✅ AuthMessage | ✅ |

### AI Tools ✅
- Crisis detection: 15/15 tests passing
- Cross-tool routing: working
- Dashboard session logging: all 3 AI tools
- Auth UX: AuthMessage component handles 401/403/429 distinctly

### Stripe ✅ LIVE
- End-to-end test PASSED (A$9 real payment → webhook → plan=paid → refunded)

---

## Still Needed (priority order)

- [x] All Apr 2026 audits complete
- [x] SessionComplete v3 for Breathing, Sleep, Focus
- [x] AI tools AuthMessage component shipped
- [x] /api/reflect auth-gated
- [ ] **iPhone Focus sound verification** — Juan to test on real device, silent switch ON and OFF
- [ ] **SessionComplete v3 for Mood + Gratitude** — apply Breathing benchmark
- [ ] **BreathingOrb flicker** — needs local interactive debugging
- [ ] Vercel env-var hygiene — uncheck Development, enable Sensitive on production secrets
- [ ] `.env.local` backup to password manager
- [ ] Upgrade Supabase to Pro at launch ($25/month)
- [ ] Newsletter opt-in UI (dashboard checkbox → Brevo list 5)
- [ ] Brevo Phase 2 email sequences
- [ ] Export feature (not built for any tool)
- [ ] PostHog saved insights (after 7 days traffic)
- [ ] Sitemap update — add Lab article URLs
- [ ] notice-whats-good Lab category needs more articles (only 2)
- [ ] Reddit account + first post
- [ ] Google Postmaster Tools — register `try-solace.app`
- [ ] Monthly Lab article agent (calendar 23 May 2026)
- [ ] **Tech Debt:** remove legacy tool-interface system (post-stable-month, dedicated spec)
- [ ] **Tech Debt:** middleware → proxy file rename (after Clerk migration guide)

---

## Process Lessons

### 1-21 (pre-existing)
See prior master version — layout, hero/nav, container relationships, mobile breakpoint discipline, SEO essay handling.

### 22-41 (pre-existing)
Card density vs uniformity (22), editorial vs scan cards (23), pills vs labels (24), DevTools-first diagnosis (25), LOCK doesn't mean bug-free (26), JS inspection before guessing CSS (27), `position: fixed` containing-block escape (28), `text-wrap: pretty` (29), audit content when deleting tools (30), one-article-one-tool-one-CTA (31), reference-read working component before writing CTAs (32), audit copy semantic accuracy when copying (33), component colour from semantic data not contextual (34), hardcoded backgrounds defeat colour systems (35), interactive elements need hover (36), measure before resizing (37), iOS Safari + nowrap + React HTML comments (38), DOM-tree check when CSS computes correct (39), container relationship not control size (40), inspect DevTools before writing another spec (41).

### Apr 24-26 2026 cycle (42-55)

**42. Never ship "throw on unknown key" without first auditing every caller passes a known key.** The previous lesson was "silent fallbacks cause silent bugs" — that's true, but throws cause LOUD bugs (production outages). The correct defense is: cover all keys + warn in dev + fallback to safe neutral in prod. Caused the Mood + Gratitude page outage Apr 24.

**43. CSS border shorthand beats per-side properties.** `borderColor: X` covers all 4 sides; `borderTopColor: X` + 3 more is 4 chances to forget one and ship a white-line-on-dark bug. Use shorthand unless there's a specific reason to set sides individually. `rounded-X` without `border-X` (or visible border colour) = invisible corners.

**44. Verify any "silent" asset is actually silent.** File size is a tell: true silence at 64kbps mono = ~2-3KB. Anything more contains audio. Open the file before shipping. The 15.8KB "silent-loop.mp3" was actually a bell sound — caused desktop ghost-bell.

**45. One component, one element.** When a JSX element renders a critical singleton (audio sink, portal, global toast), verify `document.querySelectorAll(selector).length === 1` at runtime. Double-render = duplicated side-effects. `hidden md:block` + `md:hidden` wrapping the SAME component mounts it twice — both run `useEffect`s.

**46. Verify the component renders exactly once before chasing platform bugs.** A double-mounted component with side-effects produces non-deterministic behaviour that LOOKS like a platform bug. Count the components first. Saved hours of false iOS-audio diagnosis.

**47. Next.js streaming SSR leaves DOM artefacts.** A `<div id="S:0" style="display:none">` containing pre-hydration HTML can persist in the DOM. Counts of `querySelectorAll(...).length === 2` may be a single React component + its SSR scaffold, not a true double-render. Verify by checking `offsetParent === null` and checking ancestor tree, not just count.

**48. One sound set for all Focus presets.** Locked product decision. Sound personality per preset considered and rejected. Complexity cost outweighs differentiation pre-launch. Revisit only if post-launch data shows sound-mute-rate varies meaningfully between presets.

**49. Status codes are the API of failure mode.** When a frontend needs to distinguish "logged out" / "needs paid plan" / "quota exhausted", the API must return distinct codes (401/403/429). One code for all = ambiguous state. Spec the route's failure responses as carefully as success.

**50. Orphan API routes are vulnerabilities.** Any unused server route still runs and may be unprotected. When migrating frontend code, audit and delete the corresponding API endpoints. Run grep for frontend references to every `/api/*` path quarterly.

**51. "Logged-out user reached this page" is a conversion moment, not an error.** Treating 401 as a UX moment with warmth + clear CTA recovers users who would otherwise bounce. Apply the same pattern to any future protected feature.

**52. Mitigate first, clean up second.** When a security/cost issue is found in legacy code with non-trivial dependencies, the immediate fix is the gate (auth check, rate limit). Cleanup belongs in a dedicated spec with proper audit. Bundling cleanup with mitigation introduces regression risk on a live product.

**53. `[slug]` → `[slugdisabled]` is a valid Next.js soft-delete pattern.** Functionally disables a dynamic route without removing the code. Use when the code is referenced by other dependencies that aren't ready to be removed. Document the disable + removal plan in a code comment so future devs don't re-enable it.

**54. Defence in depth: middleware AND in-route auth.** Don't rely on one layer alone. Middleware is the primary gate; in-route `auth()` is the safety net if middleware ever changes. Both are cheap; either alone is brittle.

**55. Security/auth fixes require live-production verification before claiming "shipped."** "Tested locally" or "git pushed" is insufficient. Every spec involving auth/security gates must include: `curl -X POST <production URL>` test from logged-out terminal, and pasting back the actual status code + response body to Juan. Caused a 30-minute false-alarm on `/api/reflect` Apr 26 where I tested before Vercel finished deploying.

---

## Key Rules (Never Break)

- Read solace-master before any work
- **Solace is LIVE post-launch.** Every change ships to production. Apply post-launch risk discipline (smallest correct change, mitigate before cleanup).
- **Breathing is the benchmark** — take live screenshots of both tools side-by-side before writing any spec
- **BENCHMARK RULE:** Screenshot both tools at 375px before reading any source code. Visual first.
- **SiteHeader.tsx — LOCKED with one documented exception** (`max(0px, ...)` background offset). Never revert.
- **SiteHeaderMobileMenu.tsx — locked at portal pattern.** Never inline back into SiteHeader.
- **SiteFooter.tsx** — blur removed; desktop wordmark added; mobile structure documented.
- Background always `#090d14`
- Never define colours inline — always `lib/design-tokens.ts`
- **`getToolRgb()` covers all keys + warns in dev + fallbacks in prod. Never throws.** (lesson 42)
- Never below 0.65 opacity for functional text
- Never below 11px for visible body/functional text (lesson: shape-embedded labels permitted at 10px)
- Always use Claude Code for implementation
- `'use client'` components must return `<div>` root, never `<>` fragment
- Specs via bash_tool, presented with present_files — **never widgets**
- Always `await` Supabase inserts in Vercel serverless
- AI tool routes must NOT be in `isPublicRoute` in middleware.ts
- Never use module-scope `createClient()` or `new Stripe()` — always lazy-init
- **Every spec must end with git + Vercel deploy block** — `cd /Users/angelamanzano/Documents/Solace/solace-clean && git add . && git commit -m "..." && git push`
- **Every spec must explicitly instruct Claude Code to EXECUTE the git block**
- **Verify Vercel deployment is Current AND check live DOM before claiming fix is deployed** (lesson 41)
- **Security/auth fixes require live-production curl verification, not 'shipped'** (lesson 55)
- **Never approximate Breathing values** — read actual source and copy exactly
- **No sounds on Breathing or Sleep Wind-Down** — silence intentional
- **Border colour: shorthand `borderColor` over per-side properties** (lesson 43)
- **Verify "silent" assets are actually silent** — file size ≤ 3KB tell (lesson 44)
- **Singleton DOM elements: verify `querySelectorAll(...).length === 1` at runtime** (lesson 45)
- **Component double-render check before platform-specific debugging** (lesson 46)
- **Distinguish SSR scaffold vs real double-render** via `offsetParent` and ancestor tree (lesson 47)
- **Status codes 401/403/429 distinct in API responses for distinct failure modes** (lesson 49)
- **Quarterly grep audit for orphan `/api/*` routes** (lesson 50)
- **401/403/429 are conversion moments — render Solace-voice messages, not raw JSON** (lesson 51)
- **Mitigate first, clean up second on a live product** (lesson 52)
- **`[slugdisabled]` folder rename = soft-delete; document plan in code** (lesson 53)
- **Middleware AND in-route auth — defence in depth** (lesson 54)
- (All previous lessons 1-41 retained as Key Rules — see prior master version)

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