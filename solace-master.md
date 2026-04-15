# Solace Master Reference

## Product Definition
**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked):**
```
You know something needs to change.
You just can't see it clearly yet.
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
- **Stripe:** Sandbox configured, product "Solace Pro" created, webhook at `https://www.try-solace.app/api/webhooks/stripe`

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

**Lab categories:**
- `calm-your-state` → Teal
- `think-clearly` → Gold
- `notice-whats-good` → Violet

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

## Design System (Locked)

### Colours
- **Background:** `#090d14` (dark navy)
- **Category colours:** import from `lib/design-tokens.ts` — never hardcode

### Typography
- **Display/headlines:** Cormorant Garamond (serif)
- **UI/body:** Jost (sans-serif)
- **Logo:** "SOLACE" wordmark only, Cormorant Garamond spaced caps (Direction C)

### Favicon & App Icons
- `app/icon.svg` — SVG favicon, S on `#090d14` ✅ live
- `app/apple-icon.png` — 180x180 PNG for iOS home screen
- `app/favicon.ico` — removed (was showing Vercel icon) ✅

### Text Standards — ALL pages must follow this
- Primary: `TEXT_COLOURS.primary` = `rgba(255,255,255,1.0)`
- Body: `TEXT_COLOURS.body` = `rgba(255,255,255,0.80)`
- Secondary: `TEXT_COLOURS.secondary` = `rgba(255,255,255,0.65)`
- **Never below 0.65 for functional text**
- Always import from `lib/design-tokens.ts` — never write raw rgba values

### Font Size Floors — ALL pages must follow this
- Functional labels: `FONT_SIZE.functionalLabel` = 12px minimum
- Body text: `FONT_SIZE.body` = 14px minimum
- Eyebrows/pills: `FONT_SIZE.eyebrow` = 11px minimum
- Never use `text-[9px]` or `text-[10px]` for functional content
- Always import from `lib/design-tokens.ts`

### Components
- Ghost pill buttons, tinted glass cards
- SiteHeader.tsx and SiteFooter.tsx — LOCKED, never modify layout
- FooterAuthLink.tsx — auth-aware sign in/out
- **Particles:** disabled globally via `PageShell` default `particles={false}` ✅

### Card Colour Pattern (dashboard-first, applies to all pages)
- Use `glassBackground(slug, 0.07)` + `glassBorder(slug, 0.18)` from design-tokens
- Add `2px solid` top or left border in tool/category colour for accent
- Never define colours inline — always import from `lib/design-tokens.ts`

---

## Design Token File (`lib/design-tokens.ts`)
- `CATEGORY_COLOURS` — 3 categories with hex, rgb, tool slugs
- `TOOL_CATEGORY` — all 9 tool slugs → category
- `getToolColour/Rgb/Category` helpers
- `getLabCategoryColour/Rgb` helpers
- `TEXT_OPACITY`, `TEXT_COLOURS`, `FONT_SIZE`
- `glassBackground/glassBorder` helpers

---

## Tool Build Status (All Complete)

### Free/Paid Gating — ALL 9 TOOLS DONE ✅
| Tool | History API | 7-day cutoff | Upgrade prompt | SessionComplete upsell |
|---|---|---|---|---|
| Breathing | ✅ | ✅ | ✅ | ✅ |
| Focus Timer | ✅ | ✅ | ✅ | ✅ |
| Sleep Wind-Down | ✅ | ✅ | ✅ | — (silent reset) |
| Thought Reframer | ✅ | ✅ | ✅ | ✅ |
| Mood Tracker | ✅ | ✅ | ✅ | ✅ |
| Gratitude Log | ✅ | ✅ | ✅ | ✅ |
| Choose (AI) | — | — | ✅ daily nudge | ✅ |
| Clear Your Mind (AI) | — | — | ✅ paid gate | ✅ |
| Break It Down (AI) | — | — | ✅ paid gate | ✅ |

### Shared Infrastructure ✅
- `hooks/useToolHistory.ts` — reusable history hook for all 6 client tools
- `components/shared/ToolUpgradePrompt.tsx` — shared upgrade prompt UI
- `app/api/_template/history/route.ts` — blueprint for history APIs

### Stripe ✅
- `app/api/stripe/checkout/route.ts` — creates checkout session + auto-creates users row if missing
- `app/api/stripe/portal/route.ts` — billing portal
- `app/api/webhooks/stripe/route.ts` — handles 4 events, updates users.plan
- `components/pricing/CheckoutButton.tsx` — client checkout button
- Pricing page wired up with correct prices, CTA copy: "Upgrade to Pro" / "Cancel anytime. Billed annually."
- Supabase `users` table: `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` columns added
- All env vars in Vercel (Production)
- **End-to-end sandbox test PASSED** ✅
- **Stripe Customer Portal activated in sandbox** ✅

### Dashboard ✅
- `app/(main)/dashboard/page.tsx` — server component, shows plan status, streak, sessions
- `app/(main)/dashboard/DashboardContent.tsx` — all 9 tool cards using canonical colours from `design-tokens.ts`, all text using `TEXT_COLOURS` + `FONT_SIZE`
- `components/dashboard/BillingPortalButton.tsx` — redirects to Stripe Customer Portal
- `components/dashboard/UpgradeBanner.tsx` — auto-dismisses after 5s on ?upgraded=true
- Dashboard shows PRO badge for paid users ✅

### Clerk Webhook ✅
- `app/api/webhooks/clerk/route.ts` — handles user.created + user.updated, upserts Supabase users row + adds to Brevo + sends welcome email
- Clerk webhook endpoint: `https://www.try-solace.app/api/webhooks/clerk`
- `CLERK_WEBHOOK_SECRET` in Vercel ✅

### Middleware ✅
- `/api/stripe/(.*)` added to public routes
- `/sitemap.xml` and `/robots.txt` added to public routes
- Unauthenticated users hitting `/dashboard` redirect to `/sign-in?redirect_url=/dashboard` ✅

### SEO ✅
- `app/sitemap.ts` — generates `/sitemap.xml` with all 9 tool pages + core pages
- Google Search Console verified — domain `try-solace.app` ✅
- Sitemap submitted to Search Console ✅
- All pages have `title` + `description` metadata

### Analytics ✅
- PostHog installed — `components/PostHogProvider.tsx` + `components/PostHogPageView.tsx`
- Pageview tracking live on all routes ✅
- `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` in Vercel ✅
- PostHog project: `us.posthog.com/project/382430`
- Set up saved insights after 7 days of traffic data (post-launch task)

### Email System — Brevo ✅ (Phase 1)
- **Brevo account:** active, `try-solace.app` domain authenticated + DKIM + DMARC ✅
- **Sender:** `hello@try-solace.app` verified ✅
- **Lists:**
  - `Solace Users` — ID **3** (all signups)
  - `Solace Newsletter` — ID **5** (opt-in only, not yet wired)
- **Templates:**
  - ID 1: Welcome — "You've found a quieter place."
  - ID 2: Day 3 follow-up — "How's it going?"
  - ID 3: Day 14 check-in — "Still here when you need it."
- **Code:** `lib/brevo.ts` — `addBrevoContact` + `sendBrevoTemplate`
- **Clerk webhook** — on `user.created`: adds to list 3 + sends template 1 ✅
- **Brevo Automation #1** — Active: contact added to list 3 → wait 3 days → template 2 → wait 11 days → template 3 ✅
- **Tested:** welcome email delivered, contact appears in Solace Users list ✅
- `BREVO_API_KEY` in Vercel ✅

### Email System — Planned (Phase 2, post-launch)
Full sequence planned (requires Supabase login tracking + Stripe webhook triggers):
1. Welcome sequence — Day 0, 2, 5
2. Free-to-paid nudge — Day 1, 4, 8 (requires plan check)
3. Re-engagement — Day 14, 21, 30 with no login (requires last_login tracking)
4. Post-upgrade onboarding — Day 0, 3, 30 (requires Stripe webhook trigger)

### Pages — All Complete ✅
All pages use `TEXT_COLOURS` + `FONT_SIZE` from `design-tokens.ts`. No hardcoded rgba values or font sizes.

| Page | Status | Notes |
|---|---|---|
| Home | ✅ | — |
| Tools | ✅ | — |
| Pricing | ✅ | Mobile responsive, correct free/paid features, 6 FAQs |
| Lab | ✅ | Eyebrows + body text readability fixed |
| About | ✅ | Full rewrite — 3 tinted cards, coloured eyebrow pill |
| Principles | ✅ | Full rewrite — 6 principles with left accent bars |
| Privacy | ✅ | Left teal accent bars on sections |
| Terms | ✅ | Left violet accent bars on sections |
| Dashboard | ✅ | All 9 tool cards, design-tokens colours |

### Still Needed
- [ ] Switch Stripe from sandbox to live mode
- [ ] Newsletter opt-in — wire `Solace Newsletter` list (ID 5) to signup flow
- [ ] Export feature — not built for any tool
- [ ] Phase 2 email sequences
- [ ] PostHog saved insights (after 7 days of traffic)

---

## Key Rules (Never Break)
- **Read solace-master before any work begins — non-negotiable**
- SiteHeader.tsx and SiteFooter.tsx locked — never modify
- Background always fixed, full-screen `#090d14`
- Never define colours inline — always import from `lib/design-tokens.ts`
- Never use opacity below 0.65 for functional text
- Never use font size below 11px for visible text
- Always use Claude Code for implementation
- **Never connect Stripe live keys before end-to-end test passes** ← TEST PASSED ✅
- Specs always written to file via bash_tool, presented with present_files
- Particles disabled globally — `PageShell` default is `particles={false}`

---

## Post-Launch Tasks
- Phase 2 email sequences (4 sequences)
- Make Lab homepage teaser dynamic
- Solace Weekly Intelligence Report (~day 30)
- Enable Cloudflare bot fight mode + AI Labyrinth post-launch
- Update Cloudflare account to Business + ABN at ~A$20K MRR
- PostHog saved insights after 7 days of traffic data

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
3. Run in Claude Code:
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean && git add solace-master.md && git commit -m "Update: [what changed]" && git push
```