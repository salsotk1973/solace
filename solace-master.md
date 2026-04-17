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
- **Vercel project:** `solace` — auto-deploys on push to `main`
- **Clerk:** Production instance active, domain verified, Google OAuth with real credentials
- **Google Cloud project:** `solace-493201` — OAuth credentials in `Solace Private` Google Drive folder
- **Stripe:** Sandbox tested and PASSED ✅ — next step: switch to live mode

---

## Email Infrastructure (Complete)

### Google Workspace ✅
- **Plan:** Business Starter — A$11.80/month
- **Primary inbox:** `hello@try-solace.app` — real Gmail inbox, DKIM + SPF + DMARC all verified
- **Aliases (Send As):**
  - `privacy@try-solace.app` → routes to `hello@try-solace.app`
  - `legal@try-solace.app` → routes to `hello@try-solace.app`
- **DNS records in Cloudflare:**
  - SPF: `v=spf1 include:_spf.google.com ~all` ✅
  - DKIM: `google._domainkey` TXT record ✅
  - DMARC: `_dmarc` TXT record ✅
- **Google Postmaster Tools:** register `try-solace.app` to monitor domain reputation

### Brevo ✅ (Phase 1 complete)
- **Account:** active, `try-solace.app` domain authenticated
- **Sender:** `hello@try-solace.app` verified ✅
- **Lists:**
  - `Solace Users` — ID **3** (all signups, auto-added on `user.created`)
  - `Solace Newsletter` — ID **5** (opt-in only, UI not yet built)
- **Templates:**
  - ID 1: Welcome — "You've found a quieter place." — with unsubscribe footer
  - ID 2: Day 3 follow-up — "How's it going?" — with unsubscribe footer
  - ID 3: Day 14 check-in — "Still here when you need it." — with unsubscribe footer
  - All templates include: `<a href="{{ unsubscribe }}">unsubscribe</a>` footer
- **Automation #1** — Active: contact added to list 3 → wait 3 days → template 2 → wait 11 days → template 3 ✅
- **Code:** `lib/brevo.ts` — `addBrevoContact` + `sendBrevoTemplate`
- **Clerk webhook** — on `user.created`: adds to list 3 + sends template 1 ✅
- `BREVO_API_KEY` in Vercel ✅

### Email addresses on site
- `privacy@try-solace.app` — Privacy page ✅
- `legal@try-solace.app` — Terms page ✅
- No personal Gmail addresses anywhere on the site

### Brevo Phase 2 (post-launch — needs real user data)
1. Welcome Day 2 + Day 5 (currently only Day 0)
2. Free-to-paid nudge Day 1, 4, 8 — needs plan check from Supabase
3. Re-engagement Day 14, 21, 30 no login — needs `last_login` column in Supabase
4. Post-upgrade onboarding Day 0, 3, 30 — needs Stripe webhook trigger

---

## Pricing (Locked)

- **Free tier:**
  - All 6 client tools — unlimited sessions
  - Choose (AI) — 1 session/day free
  - 7-day session history
- **Paid tier:** A$9/month or A$79/year (A$6.58/month)
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history (no cutoff)
  - Mood patterns + gratitude archive + export + early access

**Key insight:** 7-day history cutoff is the conversion trigger — day 8 is the natural upgrade moment.

---

## Category System (Locked — Single Source of Truth)

All 9 tools belong to one of 3 categories. Colour = category. Defined in: `lib/design-tokens.ts`

| Category | Colour | Hex | Tools |
|---|---|---|---|
| **Calm** | Teal | `#3CC0D4` | Breathing, Sleep Wind-Down |
| **Clarity** | Gold | `#E8A83E` | Focus Timer, Mood Tracker, Thought Reframer, Gratitude Log, Clear Your Mind (AI) |
| **Decide** | Violet | `#7C6FCD` | Choose (AI), Break It Down (AI) |

---

## The 6 Client-Side Tools

1. **Breathing** — Calm (teal)
2. **Sleep Wind-Down** — Calm (teal)
3. **Focus Timer** — Clarity (gold)
4. **Thought Reframer** — Clarity (gold)
5. **Mood Tracker** — Clarity (gold)
6. **Gratitude Log** — Clarity (gold)

## The 3 AI Tools

- **Choose** — Decide (violet) — 1 session/day free, unlimited paid
- **Clear Your Mind** — Clarity (gold) — paid only
- **Break It Down** — Decide (violet) — paid only

---

## Privacy & Data (Locked)

- **Choose route:** `session_data` field removed from `tool_sessions` insert ✅ — only `user_id`, `tool`, `completed` stored. No user input retained.
- **Clear Your Mind + Break It Down:** No Supabase writes at all — confirmed clean ✅
- **FAQ claim "Nothing is stored after your session"** — accurate as of Apr 2026 ✅
- **"Private by design"** positioning is technically accurate and legally defensible

---

## Design System (Locked)

### Colours
- **Background:** `#090d14` (dark navy)
- **Category colours:** import from `lib/design-tokens.ts` — never hardcode

### Typography
- **Display/headlines:** Cormorant Garamond (serif)
- **UI/body:** Jost (sans-serif)
- **Logo:** "SOLACE" wordmark only, Cormorant Garamond spaced caps (Direction C)

### Favicon & App Icons
- `app/icon.svg` — SVG favicon ✅ live
- `app/favicon.ico` — removed (was showing Vercel icon) ✅

### Text Standards — ALL pages must follow
- Primary: `TEXT_COLOURS.primary` = `rgba(255,255,255,1.0)`
- Body: `TEXT_COLOURS.body` = `rgba(255,255,255,0.80)`
- Secondary: `TEXT_COLOURS.secondary` = `rgba(255,255,255,0.65)`
- **Never below 0.65 for functional text**
- Always import from `lib/design-tokens.ts`

### Font Size Floors
- Functional labels: `FONT_SIZE.functionalLabel` = 12px minimum
- Body text: `FONT_SIZE.body` = 14px minimum
- Eyebrows/pills: `FONT_SIZE.eyebrow` = 11px minimum
- Always import from `lib/design-tokens.ts`

### Components
- Ghost pill buttons, tinted glass cards
- SiteHeader.tsx and SiteFooter.tsx — LOCKED, never modify
- **Particles:** disabled globally — `PageShell` default `particles={false}` ✅

### Card Colour Pattern
- `glassBackground(slug, 0.07)` + `glassBorder(slug, 0.18)` from design-tokens
- 2px solid top or left border in tool/category colour for accent
- Never define colours inline

---

## Design Token File (`lib/design-tokens.ts`)

- `CATEGORY_COLOURS` — 3 categories with hex, rgb, tool slugs
- `TOOL_CATEGORY` — all 9 tool slugs → category
- `getToolColour/Rgb/Category` helpers
- `TEXT_OPACITY`, `TEXT_COLOURS`, `FONT_SIZE`
- `glassBackground/glassBorder` helpers

---

## Tool Build Status

### Free/Paid Gating — ALL 9 TOOLS DONE ✅

| Tool | History API | 7-day cutoff | Upgrade prompt | SessionComplete upsell |
|---|---|---|---|---|
| Breathing | ✅ | ✅ | ✅ | ✅ |
| Focus Timer | ✅ | ✅ | ✅ | ✅ |
| Sleep Wind-Down | ✅ | ✅ | ✅ | — |
| Thought Reframer | ✅ | ✅ | ✅ | ✅ |
| Mood Tracker | ✅ | ✅ | ✅ | ✅ |
| Gratitude Log | ✅ | ✅ | ✅ | ✅ |
| Choose (AI) | — | — | ✅ daily nudge | ✅ |
| Clear Your Mind (AI) | — | — | ✅ paid gate | ✅ |
| Break It Down (AI) | — | — | ✅ paid gate | ✅ |

### Stripe
- Full checkout + webhook + portal flow working ✅
- End-to-end sandbox test PASSED ✅
- Stripe Customer Portal activated in sandbox ✅
- Webhook: `https://www.try-solace.app/api/webhooks/stripe`
- **Next:** switch to live mode

### Dashboard ✅
- All 9 tool cards with canonical colours from `design-tokens.ts`
- All text using `TEXT_COLOURS` + `FONT_SIZE`
- Unauthenticated redirect to `/sign-in?redirect_url=/dashboard` ✅

### Clerk Webhook ✅
- `user.created` → Supabase upsert + Brevo contact + welcome email
- `CLERK_WEBHOOK_SECRET` in Vercel ✅

### SEO ✅
- Sitemap at `/sitemap.xml` — all 9 tool pages + core pages
- Google Search Console verified ✅
- All pages have title + description metadata

### Analytics ✅
- PostHog firing on all routes ✅
- `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` in Vercel ✅
- PostHog project: `us.posthog.com/project/382430`

---

## Pages Status

| Page | Status |
|---|---|
| Home | ✅ |
| Tools | ✅ Pricing fixed A$9/A$79, FAQ expanded to 8 questions |
| Pricing | ✅ Mobile responsive, correct features, A$9/A$79 |
| Lab | ✅ Editor's Pick + 5 most recent, no filter pills, "Browse all" link |
| Lab Archive | ⏳ Not built yet — build when article count hits ~14+ (currently 15, ready now) |
| About | ✅ Full rewrite, tinted cards, disclaimer paragraph kept |
| Principles | ✅ Full rewrite, 6 principles, bottom disclaimer box removed |
| Privacy | ✅ `privacy@try-solace.app` |
| Terms | ✅ `legal@try-solace.app`, payments/refunds section correct |
| Dashboard | ✅ All 9 tools, design-tokens |

---

## Lab — Human Behaviour Lab

### Architecture (Locked)
- **Lab landing (`/lab`):** Editor's Pick + 5 most recent articles (no filter pills) + "Browse all articles →" link
- **Lab archive (`/lab/archive`):** All articles, filter pills (All / Calm your state / Think clearly / Notice what's good), 3-col grid → 2-col tablet → 1-col mobile. Build trigger: ✅ ready now (15 articles)
- **Article cap:** `nonFeatured.slice(0, 5)` in `app/(main)/lab/page.tsx`
- **"Browse all" link:** points to `/lab/archive` — 404 until archive is built

### Article Count: 15 total

**Original 10:**
| Slug | Category |
|---|---|
| `why-you-cant-stop-overthinking` | think-clearly (featured ✅) |
| `how-to-feel-less-overwhelmed` | think-clearly |
| `how-box-breathing-actually-works` | calm-your-state |
| `why-you-cant-focus` | calm-your-state |
| `how-to-wind-down-before-sleep` | calm-your-state |
| `what-is-cognitive-reframing` | think-clearly |
| `how-to-track-your-mood` | think-clearly |
| `does-gratitude-journalling-work` | notice-whats-good |
| `how-to-make-a-hard-decision` | think-clearly |
| `what-is-the-human-behaviour-lab` | think-clearly |

**New 5 (added Apr 18 2026):**
| Slug | Category | Published |
|---|---|---|
| `why-you-feel-anxious-for-no-reason` | calm-your-state | Apr 21 |
| `how-to-stop-worrying-about-things-you-cant-control` | calm-your-state | Apr 23 |
| `what-is-decision-fatigue` | think-clearly | Apr 25 |
| `how-to-stop-being-so-hard-on-yourself` | notice-whats-good | Apr 28 |
| `how-to-actually-rest` | calm-your-state | Apr 30 |

**Category balance:**
- Calm your state: 5 articles
- Think clearly: 6 articles
- Notice what's good: 2 articles ← thinnest, prioritise next batch
- What is the Lab: 1 article

### Lab Mobile Fixes (done Apr 2026)
- Filter pill contrast: unselected opacity 0.45 → 0.70 ✅
- Featured card padding reduced on mobile ✅
- Article excerpts hidden on mobile (`display:none` < 640px) ✅
- Reading time moved inline with category pill on mobile (pill left, time right) ✅
- Bottom border line removed on mobile cards ✅
- Category label apostrophe fixed: `CATEGORY_LABEL` map replaces `.replace(/-/g, ' ')` ✅

### Lab Card Component Notes (`components/lab/LabFilter.tsx`)
- `CATEGORY_LABEL` map: single source of truth for display labels (includes apostrophes)
- Mobile layout: `lab-card-left` (44%) = pill row + title; `lab-card-right` (56%) = excerpt (hidden) + bottom row (hidden)
- Reading time duplicate: one instance in `lab-card-pill-row` (mobile only), one in `lab-card-bottom-row` (desktop only)
- CSS classes: `lab-card-reading-time`, `lab-card-pill-row`, `lab-card-bottom-row`, `lab-card-excerpt`, `lab-featured-card-root`, `lab-featured-card-link`, `lab-featured-title`

---

## Still Needed (priority order)

- [ ] **Verify Supabase is not paused** ← check before Stripe live
- [ ] **Switch Stripe to live mode** ← next task
- [ ] **Build `/lab/archive` page** ← ready now, 15 articles in overflow
- [ ] Newsletter opt-in UI (checkbox on dashboard → Brevo list 5)
- [ ] Brevo Phase 2 email sequences (post-launch)
- [ ] Export feature (not built for any tool)
- [ ] PostHog saved insights (after 7 days traffic)
- [ ] Google Postmaster Tools — register `try-solace.app`
- [ ] Sitemap update — add Lab article URLs

---

## Key Rules (Never Break)

- **Read solace-master before any work — non-negotiable**
- SiteHeader.tsx and SiteFooter.tsx locked
- Background always `#090d14`
- Never define colours inline — always `lib/design-tokens.ts`
- Never below 0.65 opacity for functional text
- Never below 11px for visible text
- Always use Claude Code for implementation
- **Never connect Stripe live keys before end-to-end test passes** ← PASSED ✅
- Specs always written via bash_tool, presented with present_files

---

## Post-Launch Tasks

- Brevo Phase 2 email sequences
- Solace Weekly Intelligence Report (~day 30)
- Cloudflare bot fight mode + AI Labyrinth post-launch
- Update Cloudflare to Business + ABN at ~A$20K MRR
- PostHog saved insights after 7 days traffic
- Lab archive page (ready to build now)

---

## Master Files & Workflow (Locked)

**GitHub raw URL:** `https://raw.githubusercontent.com/salsotk1973/solace/main/solace-master.md`

### Session Start
```
Load solace-master. Working on: [specific task]. Go.
```
Fetch via Chrome MCP: navigate to raw URL → get_page_text.

### Updating Master Files
1. I present updated file
2. You copy → paste into VS Code → save
3. Run:
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean && git add solace-master.md && git commit -m "Update: [what changed]" && git push
```