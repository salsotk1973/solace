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
- **Production domain:** `try-solace.app` (Cloudflare Registrar, purchased April 2026)
- **Canonical URL:** `https://www.try-solace.app`
- **Vercel project:** `solace` — auto-deploys on push to `main`
- **Clerk:** Production instance active, domain verified, Google OAuth configured with real credentials
- **Google Cloud project:** `solace-493201` — OAuth credentials stored in `Solace Private` folder on Google Drive

---

## Pricing (Locked — Do Not Revisit)
- **Free tier:** Choose (1 AI session/day) + all 6 client tools unlimited + 7-day history
- **Paid tier:** A$9/month or A$79/year
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history (no cutoff)
  - Patterns + export + streaks + Lab digest email

**Key insight:** 7-day history cutoff is the conversion trigger — day 8 is the natural upgrade moment.

---

## Category System (Locked — Single Source of Truth)
All 9 tools belong to one of 3 categories. Colour = category. No per-tool colours.
Defined in: `lib/design-tokens.ts`

| Category | Colour | Hex | Tools |
|---|---|---|---|
| **Calm** | Teal | `#3CC0D4` | Breathing, Sleep Wind-Down |
| **Clarity** | Gold | `#E8A83E` | Focus Timer, Mood Tracker, Thought Reframer, Gratitude Log, Clear Your Mind (AI) |
| **Decide** | Violet | `#7C6FCD` | Choose (AI), Break It Down (AI) |

**Lab categories map to the same colours:**
- `calm-your-state` → Teal
- `think-clearly` → Gold
- `notice-whats-good` → Violet

**Rules:**
- Never define tool colours inline anywhere — always import from `lib/design-tokens.ts`
- New tools get assigned to an existing category — no new colours ever
- Lab articles use the category colour of the tool they link to

---

## The 6 Client-Side Tools (Unlimited for all users)
1. **Breathing** — Calm (teal) — guided breathing exercises
2. **Sleep Wind-Down** — Calm (teal) — evening relaxation sequence
3. **Focus Timer** — Clarity (gold) — distraction-free work sessions
4. **Thought Reframer** — Clarity (gold) — reframe anxious thoughts
5. **Mood Tracker** — Clarity (gold) — daily emotional check-in with patterns
6. **Gratitude Log** — Clarity (gold) — gratitude practice with reflection

---

## The 3 AI Tools (Gated by paywall)
- **Choose** — Decide (violet) — helps users make decisions they've been stuck on
  - Free tier: 1 session/day
  - Paid tier: unlimited

- **Clear Your Mind** — Clarity (gold) — dumps mental load, clears noise
  - Paid tier only

- **Break It Down** — Decide (violet) — makes overwhelming things manageable
  - Paid tier only

---

## Design System (Locked)

### Colours
- **Background:** `#090d14` dark navy across all pages
- **Category colours:** See Category System above — import from `lib/design-tokens.ts`
- **Never hardcode rgba tool colour values inline** — always use token helpers

### Typography
- **Display/headlines:** Cormorant Garamond (serif)
- **UI/body:** Jost (sans-serif)
- **Logo/wordmark:** "SOLACE" in Cormorant Garamond, spaced caps — Direction C (wordmark only, no icon)

### Favicon & App Icons (Implemented)
- `app/icon.svg` — SVG favicon, S on `#090d14`, Georgia serif, rounded corners (primary)
- `app/apple-icon.png` — 180x180 PNG for iOS home screen (real PNG, generated via sips)
- `app/favicon.ico` — ICO fallback
- `app/layout.tsx` metadata.icons wired correctly

### Text Standards (from `lib/design-tokens.ts`)
- **Primary text:** `rgba(255,255,255,1.0)` — headings, key labels
- **Body text:** `rgba(255,255,255,0.80)` — descriptions, paragraph copy
- **Secondary text:** `rgba(255,255,255,0.65)` — metadata, dates, supporting copy
- **Tertiary text:** `rgba(255,255,255,0.45)` — hints, placeholders, decorative only
- **Never below 0.50** for any user-facing functional text

### Font Size Floors (from `lib/design-tokens.ts`)
- Functional labels: `12px` minimum
- Body/description text: `14px` minimum
- Eyebrow pills/tags: `11px` minimum
- Button labels: `13px` minimum
- Metadata: `12px` minimum
- **Never use `text-[9px]` or `text-[10px]` for functional content**

### Components
- **Cards:** Tinted glass cards — colour from `glassBackground()` / `glassBorder()` token helpers
- **Buttons:** Ghost pill buttons, no borders
- **Layout:** No white bands between sections; dark mode only
- **Arrows:** On tool cards — invisible at rest, appears on hover only

### Background & Animation Rules
- ALL background effects and animations: `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;`
- Always full-screen, never constrained to a section or container
- **SiteHeader.tsx and SiteFooter.tsx locked — never modify layout or structure**
- FooterAuthLink.tsx handles auth-aware sign in/sign out in footer

---

## Design Token File (lib/design-tokens.ts)
Single source of truth for all design values. Exports:
- `CATEGORY_COLOURS` — 3 categories with hex, rgb, tool slugs, Lab category slug
- `TOOL_CATEGORY` — all 9 tool slugs mapped to category key
- `getToolColour(slug)` / `getToolRgb(slug)` / `getToolCategory(slug)` — tool helpers
- `getLabCategoryColour(cat)` / `getLabCategoryRgb(cat)` — Lab helpers
- `TEXT_OPACITY` — 5 semantic opacity levels
- `TEXT_COLOURS` — pre-built rgba strings for inline use
- `FONT_SIZE` — size floors for 5 content roles
- `glassBackground(slug)` / `glassBorder(slug)` — card tint helpers

---

## Lab Content System
- **Format:** MDX, file-based
- **Status:** 10 SEO-optimised articles completed
- **SEO metadata:** 400+ words of copy per article, JSON-LD schema
- **Linking rule:** Every Lab article links to one specific tool (no orphan content)
- **Category colours:** Fixed — Lab categories map to same token system as tools
- **Post-launch strategy:** 1–2 articles/week, long-tail high-intent tool-adjacent keywords only
- **Homepage teaser:** Currently hardcoded; future task: make dynamic

---

## Tool Build Status (Current — April 2026)

### Breathing (Blueprint — most complete)
- ✅ POST API — saves session to DB
- ✅ GET /history API — 7-day cutoff free, full for paid
- ✅ isPaid check via lib/auth-plan.ts
- ✅ hasOlderSessions flag
- ✅ History section UI
- ✅ BreathingUpgradePrompt component
- ✅ Pattern gating — Calm + Double Exhale locked → /pricing with lock icon
- ✅ SessionComplete drawer (logged-out CTA)
- ✅ Mobile layout — fits 390x844px without scrolling
- ❌ SessionComplete — no upsell for free logged-in users (needs fix)
- ❌ Export — paid feature, not built
- ❌ Pattern analysis UI — paid feature, not built

### Focus Timer
- ✅ POST API — saves session
- ✅ SessionComplete drawer exists
- ❌ GET /history API — not built
- ❌ 7-day cutoff — not built
- ❌ Upgrade prompt — not built
- ❌ Free/paid gating — not built
- ❌ Mobile layout — not audited

### Sleep Wind-Down, Thought Reframer, Mood Tracker, Gratitude Log
- ⚠️ Unknown — full audit needed
- ❌ History API — not built for any
- ❌ Free/paid gating — not built for any
- ❌ Upgrade prompt — not built for any

### Choose (AI)
- ⚠️ Partial — rate limiting unclear
- ❌ 1 session/day enforcement for free — not verified
- ❌ Unlimited for paid — not verified

### Clear Your Mind, Break It Down (AI)
- ⚠️ Unknown — full audit needed
- ❌ Paid-only gate — not verified

---

## Critical Build Order (Non-negotiable)
**NEVER connect Stripe before all paid features work.**

1. **Shared infrastructure** — `useToolHistory` hook + `ToolUpgradePrompt` shared component
2. **Focus Timer** — history API + 7-day cutoff + upgrade prompt
3. **Sleep Wind-Down** — same
4. **Thought Reframer** — same
5. **Mood Tracker** — same (highest value — pattern analysis is THE paid feature)
6. **Gratitude Log** — same
7. **Choose** — verify/enforce 1/day free + unlimited paid
8. **Clear Your Mind** — verify paid gate
9. **Break It Down** — verify paid gate
10. **Breathing SessionComplete** — add free-user upsell
11. **Stripe webhook** — LAST, only when all paid features confirmed working

---

## Shared Infrastructure Needed (Build First)
- `useToolHistory` hook — reusable across all 6 client tools
  - Takes: toolSlug, userId
  - Returns: sessions, isPaid, hasOlderSessions, currentStreakDays, streakFraming
  - Handles: 7-day cutoff for free, full history for paid
- `ToolUpgradePrompt` shared component — takes tool colour + copy as props
  - Blueprint: `components/breathing/BreathingUpgradePrompt.tsx`
- Shared history API pattern — replicate `app/api/breathing/history/route.ts` for each tool

---

## Completed Features

### Infrastructure
- Production domain `try-solace.app` live on Vercel + Cloudflare
- Clerk Production: domain verified, Google OAuth with real credentials, 5 DNS CNAMEs
- Favicon system: SVG (browser tabs) + PNG (iOS home screen) + ICO fallback
- FooterAuthLink.tsx — auth-aware sign in/out
- Breathing layout.tsx stale boilerplate fixed

### Design System
- `lib/design-tokens.ts` — complete token system
- Global text contrast: 11 opacity values + 25 font sizes fixed
- All tool + Lab colours wired to token system
- Logo locked: Direction C — wordmark only

### Pages & Components
- All 9 tool pages built
- SEO copy completed & locked (universal audience)
- Glassmorphism SiteHeader.tsx and SiteFooter.tsx (locked)
- Privacy and Terms pages
- Pricing page (A$9/month copy locked)

### Database
- 4-table schema with RLS enabled
- Clerk auth: `isPaidUser()` and `requirePaidPlan()` in `lib/auth.ts`

---

## Key Rules (Never Break)
- SiteHeader.tsx and SiteFooter.tsx locked — never modify
- Background always fixed, full-screen
- Never duplicate footer
- Specs always written to file via bash_tool, presented with present_files
- One spec per task — short and focused
- Every Claude Code instruction ends with: screenshot at localhost:3001, review, fix until matches
- Never define colours inline — always import from `lib/design-tokens.ts`
- Never use opacity below 0.50 for user-facing functional text
- Always use Claude Code for implementation — never ask Juan to run terminal commands
- **Never connect Stripe before all paid features are working**

---

## Post-Launch Tasks (Real — Not Deferred)
- Email sequences in Brevo (4 sequences, 12 emails total)
- Make Lab homepage teaser dynamic
- Build Solace Weekly Intelligence Report (~day 30)
- Enable Cloudflare bot fight mode + AI Labyrinth when real traffic arrives
- Update Cloudflare account type to Business + add ABN once Pty Ltd formed (~A$20K MRR)

---

## Master Files & Workflow (Locked)

**GitHub raw URL:** `https://raw.githubusercontent.com/salsotk1973/solace/main/solace-master.md`

### Session Start
```
Load solace-master. Working on: [specific task]. Go.
```
I fetch it via web_fetch from the URL above — no browser MCP, no pasting.

### Updating Master Files
1. I say: "Should I update solace-master?"
2. You approve: "Yes"
3. I present the updated file
4. You copy → paste into VS Code → save
5. Run in Claude Code:
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean && git add solace-master.md && git commit -m "Update: [describe what changed]" && git push
```

### Why This Works
- No re-pasting files every session
- Token-efficient — only loads when needed
- Live GitHub version always current
- Clear Git audit trail