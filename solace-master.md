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
- **Stripe:** Live mode active ✅ — webhook configured, 6 events, 0% error rate

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

### Next.js 15 App Router — Critical Pattern
- **Never use React Fragment `<>...</>` as the root return of a `'use client'` component.** This causes SSR hydration to double-mount the component. Always wrap in a `<div>` instead.

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

### Stripe ✅ LIVE MODE ACTIVE
- Full checkout + webhook + portal flow working ✅
- End-to-end sandbox test PASSED ✅
- **Live mode active** — `pk_live_` + `sk_live_` in Vercel ✅
- **Live webhook:** "Solace Live Webhook" — Active, 0% error rate ✅
- **6 webhook events:** `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.deleted`, `customer.subscription.updated`, `invoice.payment_failed`, `invoice.payment_succeeded` ✅
- Webhook endpoint: `https://www.try-solace.app/api/webhooks/stripe`
- **Pending:** live end-to-end test with real card (A$9, verify webhook fires, refund)

### Supabase ✅
- Status: **Healthy** — not paused
- Region: Oceania (Sydney) — ap-southeast-2
- Plan: NANO (Free) — upgrade to Pro at launch for daily backups + no pause risk
- Advisor: no security or performance errors

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
- **Note:** Lab article URLs not yet in sitemap — add post-launch

### Analytics ✅
- PostHog firing on all routes ✅
- `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` in Vercel ✅
- PostHog project: `us.posthog.com/project/382430`

---

## Pages Status

| Page | Status |
|---|---|
| Home | ✅ |
| Tools | ✅ Pricing A$9/A$79, FAQ 8 questions |
| Pricing | ✅ Mobile responsive, A$9/A$79 |
| Lab | ✅ Editor's Pick + 6 most recent, no filter pills, "Browse all" with hover |
| Lab Archive | ✅ All 15 articles, filter pills, article count |
| About | ✅ Full rewrite, tinted cards, disclaimer kept |
| Principles | ✅ 6 principles, coloured border mobile fix (no negative marginLeft) |
| Privacy | ✅ `privacy@try-solace.app` |
| Terms | ✅ `legal@try-solace.app`, payments/refunds correct |
| Dashboard | ✅ All 9 tools, design-tokens |

---

## Lab — Human Behaviour Lab

### Architecture (Locked)
- **Lab landing (`/lab`):** Editor's Pick + 6 most recent non-featured articles + "Browse all articles →" link (hover: brightens, underline, arrow slides 4px right)
- **Lab archive (`/lab/archive`):** All 15 articles, filter pills (All / Calm your state / Think clearly / Notice what's good), article count, 3-col → 2-col → 1-col
- **Article cap:** `nonFeatured.filter(...).slice(0, 6)` in `app/(main)/lab/page.tsx`
- **Sorting:** `publishedAt` desc — 6 most recent always shown

### Article Count: 15 total

| Slug | Category | Published |
|---|---|---|
| `why-you-cant-stop-overthinking` | think-clearly | Mar 28 (featured ✅) |
| `how-to-feel-less-overwhelmed` | think-clearly | Mar 2026 |
| `how-box-breathing-actually-works` | calm-your-state | Mar 2026 |
| `why-you-cant-focus` | calm-your-state | Mar 2026 |
| `how-to-wind-down-before-sleep` | calm-your-state | Mar 2026 |
| `what-is-cognitive-reframing` | think-clearly | Mar 2026 |
| `how-to-track-your-mood` | think-clearly | Mar 2026 |
| `does-gratitude-journalling-work` | notice-whats-good | Mar 2026 |
| `how-to-make-a-hard-decision` | think-clearly | Mar 2026 |
| `what-is-the-human-behaviour-lab` | think-clearly | Mar 2026 |
| `why-you-feel-anxious-for-no-reason` | calm-your-state | Apr 21 |
| `how-to-stop-worrying-about-things-you-cant-control` | calm-your-state | Apr 23 |
| `what-is-decision-fatigue` | think-clearly | Apr 25 |
| `how-to-stop-being-so-hard-on-yourself` | notice-whats-good | Apr 28 |
| `how-to-actually-rest` | calm-your-state | Apr 30 |

**Category balance:**
- Calm your state: 5 articles
- Think clearly: 6 articles
- Notice what's good: 2 articles ← thinnest, prioritise next batch

### Lab Component Notes (`components/lab/LabFilter.tsx`)
- `ArticleCard` — exported (`export function ArticleCard`) so archive can reuse it
- `BrowseAllLink` — separate component with hover state (colour, underline, arrow animation)
- `CATEGORY_LABEL` map — single source of truth for display labels (preserves apostrophes)
- Mobile card layout: pill + reading time inline (same row), no excerpt, no bottom border
- **Root return must be `<div>`, not `<>` fragment** — fragment causes Next.js 15 SSR double-mount

### Lab Archive (`components/lab/LabArchiveFilter.tsx`)
- `ARCHIVE_CSS` exported and injected via `dangerouslySetInnerHTML` in `page.tsx` (server component) — not inside the client component, to prevent double-render
- Filter state: `useState<Category>('all')`
- Article count shown below pills
- **Root return must be `<div>`, not `<>` fragment**

---

## Still Needed (priority order)

- [ ] **Live Stripe end-to-end test** — real card, A$9, verify webhook fires in Stripe dashboard, check Supabase user plan updated, refund immediately
- [ ] **Upgrade Supabase to Pro** — at launch (daily backups, no pause risk, $25/month)
- [ ] Newsletter opt-in UI (checkbox on dashboard → Brevo list 5)
- [ ] Brevo Phase 2 email sequences (post-launch)
- [ ] Export feature (not built for any tool)
- [ ] PostHog saved insights (after 7 days traffic)
- [ ] Google Postmaster Tools — register `try-solace.app`
- [ ] Sitemap update — add Lab article URLs
- [ ] notice-whats-good category: needs more articles (only 2 currently)

---

## Key Rules (Never Break)

- **Read solace-master before any work — non-negotiable**
- SiteHeader.tsx and SiteFooter.tsx locked
- Background always `#090d14`
- Never define colours inline — always `lib/design-tokens.ts`
- Never below 0.65 opacity for functional text
- Never below 11px for visible text
- Always use Claude Code for implementation
- **`'use client'` components must return a `<div>` root, never `<>` fragment**
- Specs always written via bash_tool, presented with present_files

---

## Post-Launch Tasks

- Brevo Phase 2 email sequences
- Solace Weekly Intelligence Report (~day 30)
- Cloudflare bot fight mode + AI Labyrinth post-launch
- Update Cloudflare to Business + ABN at ~A$20K MRR
- PostHog saved insights after 7 days traffic
- Lab archive pagination (when articles exceed ~24)
- Next article batch — prioritise notice-whats-good category

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