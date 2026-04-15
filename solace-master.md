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
- **Free tier:** Choose (1 AI session/day) + all 6 client tools unlimited + 7-day history
- **Paid tier:** A$9/month or A$79/year (A$6.58/month)
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history (no cutoff)
  - Patterns + export + streaks + Lab digest email

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
- `app/icon.svg` — SVG favicon, S on `#090d14`
- `app/apple-icon.png` — 180x180 PNG for iOS home screen
- `app/favicon.ico` — ICO fallback

### Text Standards
- Primary: `rgba(255,255,255,1.0)`
- Body: `rgba(255,255,255,0.80)`
- Secondary: `rgba(255,255,255,0.65)`
- Never below 0.50 for functional text

### Font Size Floors
- Functional labels: 12px minimum
- Body text: 14px minimum
- Eyebrows/pills: 11px minimum
- Never use `text-[9px]` or `text-[10px]` for functional content

### Components
- Ghost pill buttons, tinted glass cards
- SiteHeader.tsx and SiteFooter.tsx — LOCKED, never modify layout
- FooterAuthLink.tsx — auth-aware sign in/out

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
- **End-to-end sandbox test PASSED** — checkout → webhook → users.plan='paid' confirmed ✅
- **Stripe Customer Portal activated** in sandbox ✅

### Dashboard ✅
- `app/(main)/dashboard/page.tsx` — server component, shows plan status, streak, sessions
- `app/(main)/dashboard/DashboardContent.tsx` — all 9 tool cards using canonical colours from `design-tokens.ts`
- `components/dashboard/BillingPortalButton.tsx` — redirects to Stripe Customer Portal
- `components/dashboard/UpgradeBanner.tsx` — auto-dismisses after 5s on ?upgraded=true
- Dashboard shows PRO badge for paid users ✅
- All text readability fixed — `TEXT_COLOURS` and `FONT_SIZE` from design-tokens.ts ✅

### Clerk Webhook ✅
- `app/api/webhooks/clerk/route.ts` — handles user.created + user.updated, upserts Supabase users row + adds to Brevo + sends welcome email
- Clerk webhook endpoint registered: `https://www.try-solace.app/api/webhooks/clerk`
- Events subscribed: `user.created`, `user.updated`
- `CLERK_WEBHOOK_SECRET` in Vercel ✅
- Note: webhook fires on new sign-ups; checkout route self-heals (creates row if missing)

### Middleware ✅
- `/api/stripe/(.*)` added to public routes — no longer blocked by Clerk middleware
- `/sitemap.xml` and `/robots.txt` added to public routes ✅

### SEO ✅
- `app/sitemap.ts` — generates `/sitemap.xml` with all 9 tool pages + core pages
- Google Search Console verified — domain `try-solace.app` ✅
- Sitemap submitted to Search Console ✅

### Analytics ✅
- PostHog installed — `components/PostHogProvider.tsx` + `components/PostHogPageView.tsx`
- Pageview tracking live on all routes ✅
- `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` in Vercel ✅
- PostHog project: `us.posthog.com/project/382430`

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

### Still Needed
- [ ] Dashboard tool card fix — spec written (v3), not yet run in Claude Code
- [ ] Switch Stripe from sandbox to live mode
- [ ] Newsletter opt-in — wire `Solace Newsletter` list (ID 5) to signup flow
- [ ] Export feature — not built for any tool
- [ ] Phase 2 email sequences

---

## Key Rules (Never Break)
- SiteHeader.tsx and SiteFooter.tsx locked
- Background always fixed, full-screen
- Never define colours inline — always import from `lib/design-tokens.ts`
- Never use opacity below 0.50 for functional text
- Always use Claude Code for implementation
- **Never connect Stripe live keys before end-to-end test passes** ← TEST PASSED ✅
- Specs always written to file via bash_tool, presented with present_files

---

## Post-Launch Tasks
- Phase 2 email sequences (4 sequences — see Email System above)
- Make Lab homepage teaser dynamic
- Solace Weekly Intelligence Report (~day 30)
- Enable Cloudflare bot fight mode + AI Labyrinth post-launch
- Update Cloudflare account to Business + ABN at ~A$20K MRR
- Set up PostHog saved insights after 7 days of traffic data

---

## Master Files & Workflow (Locked)
**GitHub raw URL:** `https://raw.githubusercontent.com/salsotk1973/solace/main/solace-master.md`

### Session Start
```
Load solace-master. Working on: [specific task]. Go.
```
I fetch via Chrome MCP navigate + get_page_text from the URL above.

### Updating Master Files
1. I present updated file
2. You copy → paste into VS Code → save
3. Run in Claude Code:
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean && git add solace-master.md && git commit -m "Update: [what changed]" && git push
```

---

## Session Apr 15 — Additional Updates (post-master commit)

### Middleware ✅ Fixed
- Unauthenticated users hitting `/dashboard` now redirect to `/sign-in?redirect_url=/dashboard`
- After sign-in they land back on dashboard
- Removed blank dark page fallback for page routes (kept for API routes → 401)
- Commit: `8b160be`

### Dashboard Cards ✅ Final
- `DashboardContent.tsx` fully refactored to use `lib/design-tokens.ts`
- No hardcoded colours anywhere in the file
- All 9 tool cards render canonical category colours
- All text uses `TEXT_COLOURS` and `FONT_SIZE` constants