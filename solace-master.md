# Solace Master Reference

## Product Definition

**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked, mobile + desktop):**
```
When your mind won't settle,
it's hard to think clearly.

Solace helps you find the next right step — through thought, not noise.

[Begin with Breathing →]
```

(CTA links to `/tools/breathing` — strongest internal SEO signal from homepage to highest-polish tool page.)

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
- **Aliases:** `privacy@` and `legal@` → route to `hello@try-solace.app`

### Brevo ✅ (Phase 1 complete)
- **Lists:** `Solace Users` ID 3, `Solace Newsletter` ID 5
- **Templates:** ID 1 Welcome, ID 2 Day 3, ID 3 Day 14
- **Automation #1** active: list 3 → wait 3d → template 2 → wait 11d → template 3 ✅
- **Clerk webhook** on `user.created`: adds to list 3 + sends template 1 ✅

### Brevo Phase 2 (post-launch)
1. Welcome Day 2 + Day 5
2. Free-to-paid nudge Day 1, 4, 8
3. Re-engagement Day 14, 21, 30 no login
4. Post-upgrade onboarding Day 0, 3, 30

---

## Pricing (Locked)

- **Free tier:** All tools with limits, 7-day history, Choose 1/day free
- **Paid tier:** A$9/month or A$79/year
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history, patterns, streaks, export, early access

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

Removed entirely. Routes 308 → `/tools`. All DB records deleted. Removed from design-tokens, middleware, sitemap, FAQ, dashboard.

---

## Design System (Locked)

### Colours
- **Background:** `#090d14` (dark navy)
- **Canonical teal:** `#3CC0D4` = `rgba(60,192,212,a)` — use `T = (a) => \`rgba(60,192,212,${a})\``
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
- SiteHeader.tsx — **LOCKED, never modify**
- SiteFooter.tsx — **LOCKED, never modify** (mobile restructured Apr 2026 — see "Mobile Homepage" section)
- `PageShell` default `particles={false}` ✅
- `glassBackground()`, `glassBorder()`, `getToolRgb()` helpers from design-tokens

---

## Mobile Homepage — LOCKED ✅ (Apr 2026)

**Full mobile audit and redesign session completed. ~1,050px of vertical scroll removed. Free tools surface 2 screens earlier in the funnel. Footer redesigned from text-dump to ceremonial closing with repeated SOLACE wordmark.**

### Hero
- Section: `min-h-[55vh] md:min-h-[82vh] flex items-start md:items-center justify-center px-6 pt-[12vh] pb-12 md:pt-0 md:pb-0`
- Headline: `text-[36px] md:text-[72px] font-light leading-[1.08] md:leading-[0.95]`
- Headline wrapper: `overflow-visible md:overflow-hidden pt-1 md:pt-0` (overflow-visible prevents Cormorant ascender clipping on mobile)
- CTA: "Begin with Breathing →" → `/tools/breathing` — teal `rgba(60,192,212,0.85)`, `text-[12px]` uppercase, `tracking-[0.18em]`, `mt-10`
- **Mobile only `min-h` removed**; `pb-12` controls bottom space deterministically (no flex-center void)
- **`pt-[12vh]` is the calibrated value** — 8vh too tight (clipped against nav), 18vh too low

### AI Tool Cards
- `<Link>` className: `ai-tool-card group relative rounded-2xl border border-l-2 backdrop-blur-sm p-5 md:p-6 md:min-h-[280px] flex flex-col …`
- **`min-h-[280px]` desktop only** (mobile cards size to content)
- Title: `text-[26px] md:text-[34px] leading-[1.05] md:leading-[1.02] mt-3 md:mt-4`
- **Body paragraph hidden on mobile via `hidden md:block`** (kept in DOM for SEO, removes ~160px per card × 3)
- CTA: `mt-3 md:mt-auto pt-0 md:pt-6` (with body removed mobile no longer uses mt-auto)
- Section: `pt-8 pb-8 md:pt-16 md:pb-14`
- Grid: `mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6`
- Hairline divider before "FREE — START HERE": 64px-wide, mobile-only via `md:hidden`

### FREE — START HERE (no spec needed — already clean)
- Single column on mobile, well-sized cards, colour-coded accents work as-is

### FeaturedLabCard
- Padding via scoped `<style>` block: desktop `34px 38px`, mobile `22px 22px`
- "Editor's Pick" pill hidden on mobile via `.featured-lab-pill-editors-pick { display: none !important }` — only "THINK CLEARLY" category pill visible
- Excerpt colour: `rgba(200,192,230,0.70)` (was `rgba(135,128,178,0.48)` — below WCAG AA on dark bg) — applied to desktop too (accessibility fix)
- Excerpt line-height: `1.65` (was `1.8`)
- Title margin: `0 0 12px` (was `0 0 16px`)
- Pill row: `gap: 8px, marginBottom: 14px, flexWrap: wrap`
- Title minimum: `clamp(26px, 3.1vw, 42px)` (was `clamp(28px, …)`)

### Footer — Designed Mobile Closing
**Deliberate exception to the "SiteFooter LOCKED" rule. Mobile only. Desktop 3-column layout untouched.**

Mobile footer structure (top to bottom):
1. **Row 1 — 5 product/learn links centered:** Tools, Pricing, Lab, Principles, About — `font-size: 13px`, gap `12px 18px`, marginBottom `16px`
2. **Row 2 — 2 legal links centered:** Privacy, Terms — gap `24px`, sharing vertical axis with row 1's center
3. **Hairline divider:** `width: 32px, height: 0.5px, background: rgba(255,255,255,0.18), margin: 32px auto 24px` — ceremonial, not structural
4. **Centered disclaimer:** max-width `320px` (forces 3-line wrap on iPhone), `font-size: 12px, lineHeight: 1.7, color: rgba(255,255,255,0.65)` (Spec 04c)
5. **Copyright + tagline merged:** `© 2026 · Built with care.` on one centered line, `font-size: 11px, color: rgba(255,255,255,0.65)` (Spec 04c — was 0.50, bumped to match disclaimer)
6. **SOLACE wordmark closing:** Cormorant Garamond, `font-size: 18px, letterSpacing: 0.32em, color: rgba(255,255,255,0.55)` (Spec 04c — was 0.35, bumped so brand anchors the footer), `paddingLeft: 0.32em` (compensates for letter-spacing right-bias for optical centering)

**Hierarchy after Spec 04c:** SOLACE wordmark (0.55) is the visual anchor. Disclaimer + copyright (both 0.65) sit at equal supporting weight. Brand bookends the page; legal/meta is quieter than brand. This is the correct hierarchy for a wellness product.

Mobile footer hides:
- The 3-column PRODUCT/LEARN/LEGAL grid (`display: none`)
- "Dashboard" link (already in hamburger nav)
- "Sign in/Sign out" `<FooterAuthLink />` (already in hamburger nav)
- The desktop full-width hairline divider
- The desktop 3-part bottom bar (copyright/disclaimer/built-with-care)

Mobile padding: `28px 16px 20px` (was desktop `48px 16px 32px`)

**Why the wordmark works:** SOLACE at the top opens the experience. SOLACE at the bottom closes it. Brand bookends the page. Ralph Lauren / Aēsop / A24 / Studio Bun pattern. Costs nothing, signals care.

### Mobile spacing token cheat sheet

| Element | Mobile value | Desktop value |
|---|---|---|
| Hero `min-h` | none | `82vh` |
| Hero `pt` | `[12vh]` | `0` |
| Hero `pb` | `12` (48px) | `0` |
| Hero `items` | `start` | `center` |
| Headline size | `36px` | `72px` |
| Headline leading | `1.08` | `0.95` |
| AI section `pt` / `pb` | `8` / `8` | `16` / `14` |
| AI card padding | `p-5` | `p-6` |
| AI card title | `26px` | `34px` |
| AI card body | `hidden` | visible |
| AI grid gap | `gap-4` | `gap-6` |
| Lab card padding | `22px 22px` | `34px 38px` |
| Lab card pills | 1 (Think Clearly) | 2 (Editor's Pick + category) |
| Footer padding | `28px 16px 20px` | `48px 16px 32px` |
| Footer layout | centered 5+2 + wordmark | 3-column grid |

---

## Breathing Tool — Design Benchmark ✅

**Breathing is the benchmark for ALL tools.** Every tool must match Breathing exactly on all shared elements. Read Breathing source before writing any other tool spec.

### BENCHMARK RULE — NON-NEGOTIABLE
Before writing any spec that matches a tool to Breathing: take live screenshots of BOTH tools side-by-side first. Visual comparison before any code. Always.

### 11 decisions locked (apply to ALL tools):
1. Stop = Begin (solid filled teal pill)
2. SessionComplete = visible moment, slides up from bottom
3. Info cards: Duration + Best For only, compact sizing
4. History collapses on mobile behind toggle
5. Begin button py-3 for 44px tap target
6. Pattern pills: same exact classes as Breathing PatternSelector
7. All text ≥ 0.65 opacity
8. Canonical teal `#3CC0D4` everywhere
9. Cross-links use `glassBackground()`, `glassBorder()`, `getToolRgb()`
10. Cross-links hidden on mobile (`hidden md:block`)
11. No container on mobile — elements float on dark page

### Exact classes to copy (never approximate):
- **Pattern pills mobile:** `px-2 py-1.5`, text `text-[10px]`
- **Pattern pills desktop:** `md:px-7 md:py-3`, text `md:text-[12px]`
- **Active pill:** `bg: rgba(60,192,212,0.22)`, `border: rgba(60,192,212,0.90)`, `color: rgba(200,248,255,1.0)`, `boxShadow: 0 0 12px rgba(60,192,212,0.25)`
- **Inactive pill:** `bg: rgba(60,192,212,0.10)`, `border: rgba(60,192,212,0.45)`, `color: rgba(140,225,240,0.85)`
- **Begin/Stop:** `bg-[rgba(60,192,212,0.85)] border border-[rgba(60,192,212,0.90)] text-[rgba(10,30,36,0.95)] px-8 py-3 rounded-full`
- **Info cards:** `p-2 rounded-[12px] md:gap-1.5 md:px-4 md:py-4`, border `T(0.15)`, bg `T(0.04)`
- **Info label:** `text-[11px] tracking-[0.18em] uppercase md:text-[12px]`, color `T(0.65)`
- **Info value:** `text-[13px] md:text-[15px]`, color `T(0.92)`
- **History toggle:** `rounded-[14px] px-4 py-3`, bg `T(0.05)`, border `T(0.14)`, `+` icon `T(0.80)` bg `T(0.10)` border `T(0.25)`
- **History content:** `px-3 py-3 md:px-5 md:py-4 md:rounded-[14px]`, border `T(0.12)`, bg `T(0.03)`
- **Page wrapper:** `max-w-[780px] mx-auto px-6 pt-[96px] md:pt-[140px] pb-28`
- **Cycle counter:** `w-full text-center text-[10px] tracking-[0.22em] uppercase h-4`, color `rgba(100,190,210,0.38)`

### BreathingOrb — Known Issue ⚠️
Flicker on phase transitions caused by React `useState` re-renders. Multiple rewrite attempts failed. Current state: original React-state version restored (`e46f3ce`). **Do not attempt without local interactive debugging.**

---

## Sleep Wind-Down — Build Complete ✅ (Apr 2026)

### What's done
- Benchmark applied: exact Breathing classes for pills, cards, buttons, history toggle ✅
- Canonical teal `#3CC0D4` throughout — orb is teal (same family as Breathing) ✅
- Orb personality: softer gradient `rgba(60,192,212,0.16)` at center with wider fade — "dissolves into dark" ✅
- RAF loop animation: smooth continuous easing (different from Breathing's phase-based setTimeout) ✅
- Progress ring + travelling bead — both driven by RAF `sessionProg` every frame ✅
- Phase label inside the orb (centred absolutely), same as Breathing ✅
- Responsive orb: 130px mobile, 228px desktop ✅
- SessionComplete: "Rest well." — same slide-up pattern as Breathing ✅
- Free/paid history gating via `useToolHistory` hook ✅
- Session saved to Supabase on completion ✅
- Cross-links: desktop only, Breathing + Choose ✅
- Dimming vignette: **removed** — was hiding the UI ✅
- **Sound decision: NO sound** — silence is part of the tool experience ✅

### Key technical decisions
- **Bead transformOrigin:** `"50% 50%"` not `"114px 114px"` — percentage scales with SVG viewBox ✅
- **Ring + bead driven by RAF only** — no CSS transitions on ring/bead, they fight each other ✅
- **Stop resets ring + bead immediately** — CSS transitions don't stop on cancelAnimationFrame ✅
- **`doSilentReset` does NOT clear `sessionComplete`** — user must dismiss "Rest well." manually ✅
- **History card border:** `...(historyOpen && { borderTop: "none", borderRadius: "..." })` spread — never removes top border on desktop ✅
- **Cycle counter inside the flex column** — between orb and Begin button ✅

### Sleep insights (paid users)
- `app/api/sleep/history/route.ts` returns `insights`: most used pattern, weekly comparison, best streak ✅
- Rendered in history card identical to Breathing's patterns section ✅
- `hooks/useToolHistory.ts` updated with optional `insights` field ✅

---

## Focus Timer — Build Complete ✅ (Apr 2026)

### What's done
- Benchmark applied: exact Breathing classes for pills, cards, history toggle ✅
- Amber token helper: `const A = (a: number) => \`rgba(232,168,62,${a})\`` throughout ✅
- ModeSelector: 2×2 grid on mobile, flex row on desktop, exact PatternSelector structure ✅
- Circle: 130px mobile / 220px desktop, dynamic radius + circumference ✅
- Arc + digits + circle border: amber always (never teal, even during Rest phase) ✅
- Phase label: amber always, `marginTop: 4px` inline to guarantee gap ✅
- "Tap to start" pulse: `animate-pulse` + amber glow `textShadow: 0 0 8px rgba(232,168,62,0.60)` ✅
- Skip: solid amber pill (matches Breathing BEGIN). Reset: ghost amber pill ✅
- Info cards: exact Breathing classes `p-2 md:px-4 md:py-4`, amber tokens ✅
- History toggle: exact Breathing structure, amber tokens, mobile collapses ✅
- History content: full border all sides desktop, top border removed on mobile when open ✅
- Cross-links: `hidden md:block` ✅
- SessionDots: fully amber (active, completed, empty states) ✅
- SessionComplete: slide-up banner on `allDone` ✅
- Page padding: `pt-[96px] md:pt-[140px]` matching Breathing ✅
- **Sound toggle**: centred above circle, amber ON/OFF states, UPPERCASE ✅
- **Sound effects**: real MP3s via Web Audio API, preloaded on mount ✅
  - Focus start: `public/sounds/focus-start.mp3` (copper bell ding 23, 4s)
  - Rest start: `public/sounds/rest-start.mp3` (copper bell ding 14, 5s)
  - Session done: `public/sounds/session-done.mp3` (copper bell ding 1, 7s)
  - Default: sound ON, preference saved to localStorage `solace_focus_sound`
- Session history saves to `focus_sessions` table on full completion ✅
- History API: `app/api/focus/history/route.ts` — 7-day cutoff free, full paid ✅

### Key technical decisions
- **No Begin/Stop/Resume button** — circle is the only tap target
- **All amber, no teal** — Rest phase does NOT switch to teal (Focus tool = amber only)
- **CIRCUMFERENCE removed** — dynamic `radius` and `circumference` derived from `circleSize`
- **Sound loads on mount** via `fetch` + `decodeAudioData` — not oscillator
- **iOS audio unlock**: `AudioContext.resume()` called on first tap

### Sound decision: Breathing and Sleep Wind-Down
- **Breathing: NO sound** — orb animation is the sensory experience; silence is part of it
- **Sleep Wind-Down: NO sound** — same reasoning; users in bed, partner consideration

---

## Build Infrastructure — Fixed ✅ (Apr 2026)

### Supabase Lazy-Init (critical — both files fixed)
- `lib/supabase/server.ts` — Proxy lazy-init ✅
- `lib/supabase.ts` — Proxy lazy-init ✅ (health route imports this one)

### Stripe Lazy-Init (all 3 routes fixed)
- `app/api/stripe/checkout/route.ts` ✅
- `app/api/stripe/portal/route.ts` ✅
- `app/api/stripe/webhooks/stripe/route.ts` ✅

### GitHub Actions ✅
- All 9 secrets set via `gh secret set`
- `playwright.yml` has all env vars
- `e2e/clear-your-mind.spec.ts` — crisis test skipped (requires auth), page test uses `h1.first()`
- All tests green ✅

---

## SEO ✅ (Apr 2026)

- Sitemap: 17 pages, submitted Apr 15, last read Apr 18 ✅
- `metadataBase: new URL("https://www.try-solace.app")` in `layout.tsx` — canonical tags auto-generated ✅
- 11 pages indexed by Google
- `clerk.try-solace.app` — "indexed without content" — not our domain, no action needed
- **Homepage hero CTA "Begin with Breathing →" → `/tools/breathing`** — strongest internal SEO signal from highest-authority page

---

## Tool Build Status

### Free/Paid Gating

| Tool | History API | 7-day cutoff | Upgrade prompt | SessionComplete |
|---|---|---|---|---|
| Breathing | ✅ | ✅ | ✅ | ✅ "Well done." |
| Sleep Wind-Down | ✅ | ✅ | ✅ | ✅ "Rest well." |
| Focus Timer | ✅ | ✅ | ✅ | ✅ |
| Mood Tracker | ✅ | ✅ | ✅ | — |
| Gratitude Log | ✅ | ✅ | ✅ | — |
| Choose (AI) | — | — | ✅ daily nudge | ✅ |
| Clear Your Mind (AI) | — | — | ✅ paid gate | ✅ |
| Break It Down (AI) | — | — | ✅ paid gate | ✅ |

### AI Tools ✅
- Crisis detection: 15/15 tests passing ✅
- Cross-tool routing: all redirects working ✅
- Dashboard session logging: all 3 AI tools ✅

### Stripe ✅ LIVE
- End-to-end test PASSED (A$9 real payment → webhook → plan=paid → refunded) ✅

### Supabase
- Status: Healthy, not paused
- Plan: NANO (Free) — **upgrade to Pro at launch** ($25/month, daily backups)

---

## Still Needed (priority order)

- [ ] **Desktop homepage audit** — same protocol as mobile audit (next session — see "Desktop Homepage Audit" prompt)
- [ ] **BreathingOrb flicker** — needs local interactive debugging with dev server running. Do not attempt via specs.
- [ ] **Mood Tracker** — apply Breathing benchmark
- [ ] **Gratitude Log** — apply Breathing benchmark
- [ ] **SessionComplete** for Mood Tracker, Gratitude Log
- [ ] **Upgrade Supabase to Pro** — at launch ($25/month)
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
| Home (mobile) | ✅ LOCKED Apr 2026 — see Mobile Homepage section above |
| Home (desktop) | Needs audit (next session) |
| Tools | ✅ |
| Pricing | ✅ A$9/A$79 |
| Lab | ✅ 15 articles |
| Lab Archive | ✅ |
| About | ✅ |
| Principles | ✅ |
| Privacy | ✅ |
| Terms | ✅ |
| Dashboard | ✅ All 8 tools, AI sessions logging ✅ |

---

## Lab — Human Behaviour Lab

### 15 articles

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
- **Breathing is the benchmark** — take live screenshots of both tools side-by-side before writing any spec
- **BENCHMARK RULE:** Screenshot both tools at 375px before reading any source code. Visual first. Always.
- SiteHeader.tsx — **LOCKED**
- SiteFooter.tsx — **LOCKED** (mobile is the documented exception in the Mobile Homepage section above)
- Background always `#090d14`
- Never define colours inline — always `lib/design-tokens.ts`
- Never below 0.65 opacity for functional text
- Never below 11px for visible text
- Always use Claude Code for implementation
- `'use client'` components must return `<div>` root, never `<>` fragment
- Specs via bash_tool, presented with present_files — **never widgets**
- Always `await` Supabase inserts in Vercel serverless
- AI tool routes must NOT be in `isPublicRoute` in middleware.ts
- Never use module-scope `createClient()` or `new Stripe()` — always lazy-init
- **Every spec must end with git + Vercel deploy block** — `cd /Users/angelamanzano/Documents/Solace/solace-clean && git add . && git commit -m "..." && git push`
- **Every spec must explicitly instruct Claude Code to EXECUTE the git block** — exact wording: *"Execute the git block at the end — do NOT stop at 'ready to commit'. RUN the command. Do NOT preview it, RUN it."* Without this, Claude Code stops one step short and Juan has to commit manually. Missing either the block OR the execute instruction = incomplete spec.
- **Verify Vercel deployment is Current AND check live bundle before claiming fix is deployed**
- **Never approximate Breathing values — read the actual source and copy exactly**
- **No sounds on Breathing or Sleep Wind-Down** — silence is intentional

---

## Process Lessons (Apr 2026 — Mobile Homepage Audit)

These were learned the hard way during the mobile homepage redesign. Encode them so they don't have to be re-learned.

### 1. One spec = one number when calibrating spacing
When spacing values are unknown, move in **2vh / 8px increments**, never 4vh+ jumps. Bundle multiple changes only when each change is independently necessary — not because "let me solve it perfectly this time." Bundling causes cascading failures and wastes sessions. The mobile hero took 6 specs (01, 01b, 01c, 02b, 02c, 02d) to nail one number because the first specs bundled 3 changes each. Don't do this again.

### 2. Real-device screenshot BEFORE every spacing spec, not just after
The benchmark rule says screenshot at 375px before writing any spec. Extend it: when calibrating mobile spacing, also request a real iPhone screenshot AFTER the previous spec deploys, BEFORE writing the next one. DevTools emulation at 375px is necessary but not sufficient — real iPhones have safari nav chrome, status bars, dynamic islands, and tall viewports (812px+) that change how flex centering composes. Six hero specs in a row would have been one if I'd asked for the iPhone screenshot before each calibration, not after.

### 3. `overflow-hidden` clips Cormorant Garamond ascenders
Cormorant has tall ascenders that extend above the leading line. With tight `leading-[0.95]` or smaller and a parent `overflow-hidden`, the top of capital letters gets clipped. Solution: use `overflow-visible md:overflow-hidden pt-1 md:pt-0` on mobile. Or remove the wrapper if no slide-up animation needs it.

### 4. `min-h-[Xvh] + items-center` on mobile = void below content
On tall iPhones (812px+), centering content in a 55–62vh container creates 100–150px of empty space below the content. Better pattern: drop `min-h` on mobile, use `items-start` with `pt-[Nvh]` for top placement and `pb-N` for bottom space. This gives deterministic control instead of flex-distributed emptiness.

### 5. Card body text on homepage = duplicate content
If a homepage card describes a tool/article, and the destination page already has that description, the card body is duplicate content. Strip it on mobile (where space is precious). Use `hidden md:block` to keep it in DOM for SEO. Eyebrow + title + CTA is usually enough on mobile to commit to a tap.

### 6. Inline styles don't respond to Tailwind breakpoints
Components using inline `style={{padding: "34px 38px"}}` need a scoped `<style>` block with media queries to be responsive. Use the same pattern as SiteFooter.tsx — add a className, target it from a `<style>` tag. Don't try to add Tailwind classes alongside inline styles for the same property — specificity wars.

### 7. Footer is part of the brand experience, not exit signage
A "dumped list of links" footer signals an unfinished product. A designed footer with intentional composition (centered links, hairline divider, repeated wordmark) signals care. The SOLACE wordmark at the bottom bookends the experience the SOLACE logo opened at the top. Cost: ~30 lines of CSS. Value: massive perceived quality lift.

### 8. Optical centering ≠ mathematical centering for letter-spaced text
Letter-spaced text always sits slightly right of mathematical center because the letter-spacing pushes letters to the right of their box. Compensate with `paddingLeft` equal to one letter-spacing unit (e.g., `paddingLeft: "0.32em"` for `letterSpacing: "0.32em"`).

### 9. Re-read solace-master.md when I think it's missing something
When specifying changes, if I think "the routine for X isn't documented," check the file first. The routine is probably there and I just haven't internalised it.

### 10. Opacity is the wrong lever for "quiet" — use size, weight, tracking instead
A brand mark at 0.35 opacity reads as "ghost text," not "quiet." If you want something to feel restrained but present, use small font-size + light font-weight + heavy letter-spacing + serif. Then set opacity at 0.55+ so it's actually visible. Opacity below 0.55 should only be used for true secondary metadata, never for brand or anchor elements. (Spec 04c lesson: wordmark went from 0.35 → 0.55 to become the visible anchor.)

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