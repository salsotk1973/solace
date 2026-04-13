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

### Text Standards (from `lib/design-tokens.ts`)
- **Primary text:** `rgba(255,255,255,1.0)` — headings, key labels
- **Body text:** `rgba(255,255,255,0.80)` — descriptions, paragraph copy
- **Secondary text:** `rgba(255,255,255,0.65)` — metadata, dates, supporting copy
- **Tertiary text:** `rgba(255,255,255,0.45)` — hints, placeholders, decorative only
- **Never below 0.50** for any user-facing functional text

### Font Size Floors (from `lib/design-tokens.ts`)
- Functional labels (streak, history, section headings): `12px` minimum
- Body/description text: `14px` minimum
- Eyebrow pills/tags: `11px` minimum
- Button labels: `13px` minimum
- Metadata (dates, read time): `12px` minimum
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
- FooterAuthLink.tsx handles auth-aware sign in/sign out in footer — do not replace with static link

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
- **Category colours:** Fixed — Lab categories now map to same token system as tools
- **Post-launch strategy:** 1–2 articles/week, long-tail high-intent tool-adjacent keywords only
- **Homepage teaser:** Currently hardcoded; future task: make dynamic (pull latest MDX title + slug)

---

## Completed Features

### Infrastructure
- Production domain `try-solace.app` live on Vercel + Cloudflare
- Clerk Production instance: domain verified, Google OAuth with real credentials, 5 DNS CNAME records in Cloudflare
- FooterAuthLink.tsx — auth-aware sign in/out in footer (client component, minimal)
- Breathing layout.tsx stale boilerplate fixed (was rendering own html/body)

### Design System
- `lib/design-tokens.ts` — complete token system (colours, text, font sizes, glass helpers)
- Global text contrast fixed — 11 opacity values corrected, 25 font size instances fixed
- All tool + Lab colours wired to token system — no more scattered inline rgba values
- Logo direction locked: Direction C — wordmark only, Cormorant Garamond spaced caps, S as favicon

### Pages & Components
- All 9 tool pages built (6 client + 3 AI)
- SEO copy completed & locked (universal audience, no identity gatekeeping)
- Tool page SEO metadata with HowTo schema (Breathing) and WebApplication schema (others)
- Shared `components/ToolSeoContent.tsx`
- Glassmorphism SiteHeader.tsx and SiteFooter.tsx (locked)
- HeroSection.tsx with h-screen, CSS radial gradient, GSAP curtain reveal
- Privacy and Terms pages
- Pricing page (A$9/month copy locked)

### Database
- 4-table schema with RLS enabled
- Clerk auth integration with `isPaidUser()` and `requirePaidPlan()` helpers in `lib/auth.ts`

### Breathing Tool — Gating (partially implemented)
- History API: 7-day cutoff for free users, full history for paid — EXISTS
- `hasOlderSessions` flag — EXISTS
- `BreathingUpgradePrompt` component — EXISTS (needs visual polish)
- Locked patterns (Calm, Double Exhale) — UI dead, no upgrade path — NEEDS SPEC
- SessionComplete post-session drawer — no upsell for free users — NEEDS SPEC
- Pattern lock spec: Option A — lock icon on button, click goes to `/pricing` (approved)

---

## Launch Checklist

### Pre-Launch (Must complete before Vercel deploy)
- [x] Domain purchased and connected (`try-solace.app`)
- [x] Clerk Production instance configured
- [x] Design token system created
- [x] Global text contrast fixed
- [x] Footer auth-aware sign in/out
- [ ] Free/paid gating on 6 client tools — Breathing pattern lock + SessionComplete upsell NEXT
- [ ] Verify Choose gives one free AI session/day
- [ ] Choose animation implemented and tested on mobile
- [ ] Fix 4 bugs:
  - [ ] Duplicate footer on /pricing and /dashboard
  - [ ] Ghost header on homepage
  - [ ] White band on /tools page
  - [ ] "Everything above is free" single line formatting
- [ ] Visual consistency pass — tinted glass cards, arrow hover animation, homepage tool hierarchy
- [ ] Stripe + Clerk webhook payment flow complete
- [ ] Cormorant Garamond font fix
- [ ] Homepage OGL shader background (if proceeding)
- [ ] GSAP curtain animation confirmed
- [ ] Favicon — implement S in Cormorant Garamond as favicon/app icon

### Immediately After Vercel Deploy
- [ ] Activate Google Search Console
- [ ] Activate PostHog analytics
- [ ] Submit sitemap to Search Console

### Post-Launch Week 1
- [ ] List on Product Hunt, AlternativeTo, Wellfound, wellness newsletters
- [ ] First Reddit posts: r/Anxiety, r/Meditation, r/productivity, r/mentalhealth
- [ ] Breathing tool featured in first Reddit post

### Post-Launch (2 weeks)
- Build content calendar only after 2 weeks of real traffic data
- 1–2 articles/week targeting long-tail, high-intent tool-adjacent keywords
- Every article links to one specific tool

### Post-Launch (~30 days)
- Build Solace Weekly Intelligence Report (Claude agent)
  - Pulls: GSC (traffic), PostHog (sessions/tool usage), Stripe (MRR/churn), Clerk (signups/free vs paid)
  - Outputs: 6-section Monday report — Traffic, Revenue, Content, Product, Security, Opportunity
  - Requires paid Ahrefs/SEMrush for competitor gap
  - ~2–3hr build session
  - **Calendar reminder set for May 4, 2026 — adjust once real launch date confirmed**

---

## Current Session Status
- **Completed this session:** Domain, Clerk Production, design tokens, text contrast, colour system, footer auth fix
- **Next session starts with:** Breathing tool — pattern lock (Option A) + SessionComplete upsell spec → then remaining 5 tools

---

## Tool-by-Tool Free/Paid Strategy (Locked)

### Breathing Tool (NEXT — audit complete, pattern lock approved)
**Free features:** Unlimited sessions, Box + 4-7-8 patterns, 7-day history, basic stats
**Paid features:** Full history, Calm + Double Exhale patterns, export, pattern analysis, streak tracking
**Conversion triggers:**
1. Day 8 history cutoff (user sees they can't access older sessions)
2. Locked pattern — lock icon on Calm + Double Exhale buttons, click → `/pricing`
3. Post-session — SessionComplete drawer needs free-user upsell copy
**Pattern lock UI:** Option A — lock icon on button, direct to `/pricing` on click, more visible styling than current disabled state
**Existing gating:** History cutoff + `BreathingUpgradePrompt` exist but need visual polish

### Focus Timer (AFTER BREATHING)
**Free features:** Timer, basic stats, 7-day history
**Paid features:** Productivity insights, weekly reports, focus streaks
**Conversion trigger:** User notices trend — unlock with paid
**Positioning:** "See your productivity patterns"

### Sleep Wind-Down (AFTER FOCUS)
**Free features:** Sessions, 7-day history
**Paid features:** Sleep quality tracking, personalized routines, export
**Conversion trigger:** User realizes they can't track sleep patterns long-term
**Positioning:** "Track your sleep over time"

### Thought Reframer (AFTER SLEEP)
**Free features:** Reframe sessions, 7-day history
**Paid features:** Pattern detection, AI insights, export
**Conversion trigger:** User reframes same thought twice
**Positioning:** "See your thinking patterns"

### Mood Tracker (HIGHEST VALUE — AFTER REFRAMER)
**Free features:** Daily check-in, 7-day history
**Paid features:** Pattern analysis — correlations, triggers, trends, export
**Conversion trigger:** User realizes "I'm always low on Mondays"
**Positioning:** "Understand what affects your mood"

### Gratitude Log (LAST)
**Free features:** Daily entries, 7-day history
**Paid features:** Export, reflection prompts by mood, archive search
**Conversion trigger:** User wants to revisit past gratitudes (beyond 7 days)
**Positioning:** "Build your gratitude practice"

---

## Key Rules (Never Break)
- SiteHeader.tsx and SiteFooter.tsx locked — never modify layout or structure
- Background always fixed, full-screen
- Never duplicate footer
- Specs always written to file via bash_tool, presented with present_files
- One spec per task — short and focused
- Every Claude Code instruction ends with: "After implementing, start dev server, take screenshot of localhost:3001, review against spec. Fix and screenshot again until it matches."
- Design decisions locked in mockup before implementation begins
- **Stress-test all specs before handing to Claude Code**
- Never define tool/category colours inline — always import from `lib/design-tokens.ts`
- Never use `text-[9px]` or `text-[10px]` for functional content
- Never use opacity below 0.50 for user-facing functional text
- Always use Claude Code (claude CLI) for implementation — never ask Juan to run terminal commands

---

## Post-Launch Future Tasks (Deferred)
- Email sequences in Brevo (Welcome, Free-to-Paid Nudge, Re-engagement, Post-Upgrade Onboarding)
- Email stack upgrade: alfred_ or Superhuman when support exceeds ~20 emails/week
- Make Lab homepage teaser dynamic
- Build Solace Weekly Intelligence Report (~day 30 post-launch)
- Enable Cloudflare bot fight mode + AI Labyrinth post-launch when real traffic arrives
- Update Cloudflare account type from Personal to Business + add ABN once Pty Ltd formed (~A$20K MRR)

---

Master Files & Workflow (Locked)
GitHub raw URL: https://raw.githubusercontent.com/salsotk1973/solace/main/solace-master.md

Session Start
When starting any session (new chat or continuation):
Load solace-master. Working on: [specific task]. Go.
I fetch it via web_fetch from the URL above — no browser MCP, no pasting.
Why This Works

No re-pasting files every session
Token-efficient — only loads when needed
Live GitHub version always current
Clear Git audit trail

### Updating Master Files
When new information needs documenting:
1. I say: "Should I update solace-master?"
2. You approve: "Yes"
3. I present: Updated file (copy/paste ready)
4. You: Copy → paste into VS Code → save locally
5. Terminal: Run the Git commit prompt I provide

### Git Commit Prompt
After updating in VS Code, run in Claude Code:
```bash
cd /Users/angelamanzano/Documents/Solace/solace-clean && git add solace-master.md && git commit -m "Update: [describe what changed]" && git push
```

### Why This Works
- No re-pasting files every session
- No token waste re-reading
- Live GitHub version always current
- Clear Git audit trail
- Scalable across new chats