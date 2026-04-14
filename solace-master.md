# Solace Master Reference

## Product Definition
**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked):**
```
You know something needs to change.
You just can't see it clearly yet.

Solace gives you the space to think it through —
privately, gently, without judgement.

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
- **Background:** `#090d14` dark navy
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
- `app/api/stripe/checkout/route.ts` — creates checkout session
- `app/api/stripe/portal/route.ts` — billing portal
- `app/api/webhooks/stripe/route.ts` — handles 4 events, updates users.plan
- `components/pricing/CheckoutButton.tsx` — client checkout button
- Pricing page wired up with correct prices
- Supabase `users` table: `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` columns added
- All env vars in Vercel (Production)

### Still Needed
- [ ] Verify Stripe checkout flow end-to-end (test with sandbox card 4242 4242 4242 4242)
- [ ] Enable Stripe Customer Portal in dashboard
- [ ] Switch Stripe from sandbox to live mode when ready
- [ ] Export feature — not built for any tool
- [ ] Dashboard page — show plan status + billing portal link
- [ ] Activate Google Search Console
- [ ] Activate PostHog analytics

---

## Key Rules (Never Break)
- SiteHeader.tsx and SiteFooter.tsx locked
- Background always fixed, full-screen
- Never define colours inline — always import from `lib/design-tokens.ts`
- Never use opacity below 0.50 for functional text
- Always use Claude Code for implementation
- **Never connect Stripe live keys before end-to-end test passes**
- Specs always written to file via bash_tool, presented with present_files

---

## Post-Launch Tasks
- Email sequences in Brevo (4 sequences)
- Make Lab homepage teaser dynamic
- Solace Weekly Intelligence Report (~day 30)
- Enable Cloudflare bot fight mode + AI Labyrinth post-launch
- Update Cloudflare account to Business + ABN at ~A$20K MRR

---

## Master Files & Workflow (Locked)

**GitHub raw URL:** `https://raw.githubusercontent.com/salsotk1973/solace/main/solace-master.md`

### Session Start
```
Load solace-master. Working on: [specific task]. Go.
```
I fetch via web_fetch from the URL above.

### Updating Master Files
1. I present updated file
2. You copy → paste into VS Code → save
3. Run in Claude Code:
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean && git add solace-master.md && git commit -m "Update: [what changed]" && git push
```