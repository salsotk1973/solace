# Solace Master Reference

## Product Definition

**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked, mobile + desktop):**
```
When your mind won't settle,
it's hard to think clearly.

Solace helps you find the next right step — through thought, not noise.
```
(No CTA on desktop — removed Spec 02b. Destination is visible 334px below the fold after section reorder.)

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
- SiteFooter.tsx — see footer section for documented exceptions
- `PageShell` default `particles={false}` ✅
- `glassBackground()`, `glassBorder()`, `getToolRgb()` helpers from design-tokens

---

## Homepage — Desktop ✅ LOCKED (Apr 2026)

**Full desktop audit completed. Section reorder, hero void fix, AI card polish, Lab magazine layout, footer wordmark, dynamic Lab secondaries all shipped.**

### Section Order (locked)
Hero → FREE — START HERE → AI Tools → FROM THE LAB → Footer

Rationale: free tools (friction-free) surface immediately after hero. AI tools (higher commitment) appear after user has seen the free entry points. Lab is editorial — deepest section for engaged users.

### Hero (desktop)
- **Padding:** `md:pt-[200px] md:pb-16` — deterministic, no min-h, no items-center void
- **Headline:** `md:text-[64px]` with non-breaking space: `won't{"\u00A0"}settle,` (prevents orphan wrap at 768-789px)
- **Headline line-height:** `md:leading-[1.0]`
- **Subhead:** unchanged
- **No CTA on desktop** — removed Spec 02b (destination visible in viewport)
- **Nav offset rule:** with 80px fixed nav, hero `md:pt-[200px]` = 80 nav + 120px air below nav to headline. Always compute as nav-height + intended-air, not from viewport top.

### FREE — START HERE (desktop)
- Container: `max-w-6xl mx-auto px-6 md:px-12 lg:px-24`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- 6 cards: Breathing, Focus Timer, Sleep Wind-Down, Mood Tracker, Gratitude Log, All tools
- "All tools" card uses `neutral` tone: `rgba(148,163,184)` slate — visually distinct from 3 category colours, reads as navigation chrome
- Section padding: `pt-6 pb-16 md:pt-10 md:pb-14`

### AI Tools Section (desktop)
- Section headline: `md:text-4xl` (36px) — was 5xl/48px. Ratio hero(64) → section(36) = 1.78. Correct for "this is a section, not another hero."
- Card `md:min-h-[320px]` (was 280px) — +40px breathing room
- Card body `md:leading-[1.6]` (was 1.85) — tighter, more designed-card feel
- Section padding: `md:pt-12 md:pb-16`

### Lab Section (desktop)
- Container: `max-w-6xl mx-auto px-6 md:px-12 lg:px-24` — matches AI section width exactly
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6` — 3 equal columns, 304px each
- **No col-span-2 hero.** All 3 cards equal width — visual consistency with AI section above.
- Section padding: `py-8 md:py-10`

#### FeaturedLabCard (Editor's Pick — card 1)
- Padding: `20px 22px` desktop + mobile (matched to secondary cards — Spec 04h/04i)
- Title: `20px` Cormorant flat (not clamp) — matches secondary card titles exactly
- Pill: `3px 10px` padding — matches secondary cards
- Pill: **"Editor's pick" only** — category pill removed (Spec 04g)
- Pill wrapper `marginBottom: "24px"` — matches secondary card pill-to-title gap exactly (Spec 04j)
- Height: `height: 100%` on wrapper + link — fills grid cell to match secondary stack height
- Bottom row: `justifyContent: "space-between"` — "READ →" pins right, matching secondary cards
- Hover: `translateY(-2px)`, bg +0.03, border +0.12, 220ms — matches secondary cards
- Box shadow: `0 0 8px 1px rgba(accent,0.12)` — subtle glow, distinguishes hero from secondaries
- **Mobile: pill wrapper visible** — "Editor's pick" pill shows on mobile (Spec 08). No hide rules.

#### LabSecondaryCard (cards 2 + 3) — `components/home/LabSecondaryCard.tsx`
- New component created this session
- Padding: `20px 22px`, border-radius: `16px`
- Title: `20px` Cormorant, `lineHeight: 1.2`
- Pill: `3px 10px` padding, category label
- Excerpt: `12px` Jost, `lineHeight: 1.6`, `color: rgba(200,192,230,0.60)`
- Bottom row: `justifyContent: space-between` — reading time left, "Read →" right
- Hover: per-instance scoped class `lab-secondary-${article.category}` — each card hovers into its own accent colour (teal vs violet)
- `@media (hover: hover)` guard — prevents stuck-hover on iOS

#### Lab data — locked decisions
- **Editor's Pick:** Manual, editorial, monthly cadence. Update `FEATURED_LAB` in `page.tsx` (one line).
- **Secondary cards:** Dynamic — `getAllArticles().filter(excludeEditorsPick).slice(0,2)`. Auto-promotes 2 most recent articles on every deploy. No `page.tsx` edits needed.
- **Monthly article brief process:**
  1. Check GSC + PostHog for page-2 keywords or unserved search terms
  2. Brief Claude: topic, category, tool link, ~800 words
  3. Review → approve → add MDX to `content/lab/` → push to main
  4. Update `FEATURED_LAB.slug` in `page.tsx`
  5. New article auto-appears on homepage secondaries on next deploy
- **Calendar reminder set:** 23 May 2026 (monthly repeat)

### Footer (desktop)
- **Backdrop blur + dark gradient REMOVED** (Spec 06) — footer wrapper is now fully transparent. Was causing dark smudge band on homepage due to radial gradients bleeding through blur.
- **SOLACE wordmark added below bottom bar** (Spec 05): Cormorant Garamond, `18px`, `letterSpacing: 0.32em`, `color: rgba(255,255,255,0.12)`, centered. Hidden on mobile via `footer-desktop-wordmark { display: none !important }` in mobile media query (mobile has its own 0.55 opacity wordmark).
- Desktop 3-column grid (PRODUCT / LEARN / LEGAL) unchanged.

### Mobile spacing token cheat sheet (updated this session)

| Element | Mobile value | Desktop value |
|---|---|---|
| Hero `pt` | `[18vh]` | `[200px]` |
| Hero `pb` | `12` (48px) | `16` (64px) |
| Hero `items` | `start` | `start` |
| Hero `min-h` | none | none |
| Headline size | `36px` | `64px` |
| Headline leading | `1.08` | `1.0` |
| AI section headline | `text-4xl` | `text-4xl` (36px) |
| AI card `min-h` | none | `320px` |
| AI card body | `hidden` | `leading-[1.6]` |
| AI section `pt/pb` | `8/8` | `12/16` |
| Lab card padding | `22px 22px` | `20px 22px` |
| Lab card title | `20px` | `20px` |
| Lab pill | visible (Editor's pick) | visible |
| Footer blur | none | none |
| Footer desktop wordmark | hidden | `rgba(255,255,255,0.12)` |

---

## Mobile Homepage — LOCKED ✅ (Apr 2026, updated Apr 2026)

**Both mobile and desktop homepage audits complete. Homepage is locked.**

### Hero (mobile — updated this session)
- **`pt-[18vh]`** (was `pt-[12vh]`) — more breathing room below nav on real iPhone
- **Hairline divider between hero and FREE START HERE removed** (Spec 09) — was `md:hidden h-px w-16`, read as visual artifact
- All other mobile hero values unchanged from prior mobile audit

### Lab Cards (mobile)
- All 3 cards stack vertically: Editor's Pick first, then 2 secondaries
- "Editor's pick" pill **visible** on mobile — no hide rules (Spec 08 reversed original decision)
- Gap between all cards: `gap-4` (16px) — uniform, no orphan margin

### Footer (mobile)
Mobile footer structure (top to bottom):
1. 5 product/learn links centered
2. 2 legal links centered
3. Hairline divider: `32px wide, 0.5px, rgba(255,255,255,0.18), margin 32px auto 24px`
4. Centered disclaimer: max-width `320px`, `12px, lineHeight 1.7, rgba(255,255,255,0.65)`
5. Copyright + tagline: `© 2026 · Built with care.` centered, `11px, rgba(255,255,255,0.65)`
6. SOLACE wordmark: Cormorant Garamond, `18px, letterSpacing 0.32em, rgba(255,255,255,0.55)`, `paddingLeft: 0.32em`

---

## Process Lessons (updated Apr 2026 — Desktop Homepage Audit)

### From prior mobile audit (retained)
1–10: [all prior lessons retained — see previous version]

### New lessons from desktop audit (Apr 2026)

#### 11. When widening a parent container, audit constrained children too
When changing a grid cell width or container width, check if child components have their own internal `maxWidth` values that won't grow automatically. FeaturedLabCard had `maxWidth: 520px` on title and `440px` on excerpt — widening the grid cell to 632px had zero effect on those internal constraints. Always trace: container → grid cell → component → content widths.

#### 12. Inline `style={{ display: "..." }}` beats CSS class rules — check before writing CSS
If a JSX element has `style={{ display: "block" }}`, any CSS class rule setting `display: flex` will lose without `!important`. Before writing layout CSS, check the element's inline style for any property you're trying to override. Either remove the inline value or fight it with `!important` (use sparingly — creates maintenance debt).

#### 13. On fixed-nav pages, hero `pt` must be computed as `nav-height + intended-air`
Solace nav = 80px fixed. To give the headline 120px of visual air below the nav, set `md:pt-[200px]` (= 80 + 120), NOT `md:pt-[120px]`. Always compute from nav-bottom, not viewport-top.

#### 14. Equal columns beat clever asymmetric layouts when content is similar
The 1+2 magazine layout (hero col-span-2, 2 secondaries stacked) required 7 specs to debug because the hero card kept having height mismatches, fill problems, and alignment issues. The final decision (3 equal columns) resolved all of them in one spec. When in doubt: equal columns. Reserve asymmetric layouts for when content genuinely has different hierarchy needs.

#### 15. Don't hide elements — hide their wrapper too
Hiding a pill with `display: none` but leaving its wrapper div with `marginBottom: 24px` creates a visible empty gap. Always hide the wrapper, not just the content inside it. (Spec 07 → Spec 08 lesson.)

#### 16. `backdrop-filter: blur()` causes bleed-through on gradient backgrounds
Any page with complex background gradients (like the homepage radial system) will show a visible smudge where a blurred element overlaps. The blur samples and amplifies the gradient colours. Solution: remove backdrop blur from elements that sit over gradient backgrounds.

#### 17. The pill IS the hierarchy signal — don't use size to signal importance
Multiple specs tried to make the Editor's Pick card larger than secondary cards to signal "this is important." Every attempt created alignment and fill problems. The correct solution: equal card size, "Editor's pick" pill is the sole differentiator. Lesson: hierarchy in UI = labels + colour + typographic weight, not physical size of containers.

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

[Unchanged from prior master — see previous version for full detail]

---

## Focus Timer — Build Complete ✅ (Apr 2026)

[Unchanged from prior master — see previous version for full detail]

---

## Build Infrastructure — Fixed ✅ (Apr 2026)

### Supabase Lazy-Init (critical — both files fixed)
- `lib/supabase/server.ts` — Proxy lazy-init ✅
- `lib/supabase.ts` — Proxy lazy-init ✅

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
- `metadataBase: new URL("https://www.try-solace.app")` in `layout.tsx` ✅
- 11 pages indexed by Google

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

- [x] **Desktop homepage audit** — ✅ COMPLETE Apr 2026
- [ ] **BreathingOrb flicker** — needs local interactive debugging. Do not attempt via specs.
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
- [ ] **Monthly Lab article agent** — build as part of Solace Weekly Intelligence Report (30 days post-launch). Requires paid Ahrefs/SEMrush. Calendar reminder: 23 May 2026 (monthly repeat).

---

## Pages Status

| Page | Status |
|---|---|
| Home (mobile) | ✅ LOCKED Apr 2026 |
| Home (desktop) | ✅ LOCKED Apr 2026 |
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
| `why-you-cant-stop-overthinking` | think-clearly (**Editor's Pick — hardcoded in `FEATURED_LAB`**) |
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

### Homepage secondary cards (dynamic)
- `LAB_SECONDARIES` in `page.tsx` is now **dynamic** — calls `getAllArticles().filter(excludeEditorsPick).slice(0,2)` at build time
- Every new MDX article auto-promotes to homepage on next Vercel deploy
- No `page.tsx` edits needed when publishing new articles (except updating `FEATURED_LAB.slug` for Editor's Pick changes)
- MDX frontmatter **required fields** for homepage display: `title`, `slug`, `category`, `excerpt`, `readingTime`, `publishedAt`

### New components (this session)
- `components/home/LabSecondaryCard.tsx` — secondary Lab card for homepage. Per-instance scoped hover classes. Requires `excerpt` field.

---

## Key Rules (Never Break)

- Read solace-master before any work
- **Breathing is the benchmark** — take live screenshots of both tools side-by-side before writing any spec
- **BENCHMARK RULE:** Screenshot both tools at 375px before reading any source code. Visual first. Always.
- SiteHeader.tsx — **LOCKED**
- SiteFooter.tsx — **footer blur + gradient removed**; desktop wordmark added; mobile structure documented above. Any further changes must be documented here.
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
- **Every spec must explicitly instruct Claude Code to EXECUTE the git block**
- **Verify Vercel deployment is Current AND check live bundle before claiming fix is deployed**
- **Never approximate Breathing values — read the actual source and copy exactly**
- **No sounds on Breathing or Sleep Wind-Down** — silence is intentional
- **When widening a parent container, always audit child `maxWidth` constraints** (lesson 11)
- **Check inline `style={{...}}` for property conflicts before writing CSS rules** (lesson 12)
- **Hero `pt` on fixed-nav pages = nav-height + intended-air** (lesson 13)

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