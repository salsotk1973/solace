# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What Solace Is

Solace is a mental wellness web app — a thinking space for people when their mind is too full to think clearly. It is NOT a therapy app, NOT a chatbot, NOT a productivity tool. It is a calm, premium, emotionally intelligent space that helps users find their next right step through thought, not noise.

The Solace promise: "When your mind is too full to think clearly, Solace helps you find the next right step."

Target users: People going through anxiety, overwhelm, or difficult decisions.
Tone: Like a brilliant, caring friend — never clinical, never corporate.

---

## Commands

```bash
npm run dev        # start development server (Turbopack)
npm run build      # production build
npm run lint       # ESLint check
npx vitest         # run all unit tests
npx vitest <path>  # run a single test file, e.g. npx vitest lib/engine/__tests__/crisis.test.ts
npx playwright test  # run e2e tests (requires production build running on :3000)
```

After every implementation: confirm no TypeScript errors, no console errors, then start the dev server, take a screenshot of localhost:3000 and review it against the spec above. If anything doesn't match, fix it and screenshot again until it does.

---

## Tech Stack

- Next.js 16 App Router with Turbopack
- React 19 / TypeScript 5
- Tailwind CSS v4 (`@import "tailwindcss"` syntax — NOT `@tailwind base/components/utilities`)
- Framer Motion, Three.js / @react-three/fiber
- OpenAI SDK (server-side only)
- Vitest (unit tests in `lib/**/__tests__/`), Playwright (e2e in `e2e/`)
- Path alias: `@/*` maps to repo root

---

## Architecture

### App Router Structure

```
app/
  page.tsx                        # Home page (hero + realm cards + footer)
  layout.tsx                      # Root layout — loads Google Fonts
  globals.css                     # Design tokens, keyframes, global resets
  tools/
    clear-your-mind/page.tsx
    choose/page.tsx
    break-it-down/page.tsx
    slow-down/page.tsx
  api/solace/[tool-name]/route.ts # AI endpoints (OpenAI, server-side)
  api/reflect/route.ts
  about/ principles/ scope/ lab/
```

### Key Lib Modules

```
lib/
  solace/
    routes.ts          # SOLACE_ROUTES constants — import for all hrefs
    openai.ts          # Client-side OpenAI wrapper
    safety.ts          # Safety orchestrator (runs before every AI call)
    safety/            # red-flags.ts, classify.ts — crisis detection
    routing/           # tool-intent.ts, redirect-copy.ts
    clear-your-mind/   # engine.ts, types.ts, use-clear-your-mind.ts (hook)
    break-it-down/     # ai.ts, context.ts
  engine/              # Core inference engines + __tests__/
  thread/              # thread-helpers.ts, thread-reducer.ts, thread-types.ts
  server/openai.ts     # Server-side OpenAI wrapper (for API routes)
```

### Component Organisation

```
components/
  hero/         # HeroSection.tsx — animated headline, "Breathe", particle dots removed to page-level
  layout/       # GlobalHeader, SiteHeader, SiteFooter, ToolShell, Container
  solace/       # BreathingOrb, ReflectionOrb, SolaceSphere, ToolContainer, tokens.ts
  tool-interface/  # Composer, ThreadContainer, ReflectionCard, ThinkingState
  tools/        # ClarityTool, ChooseFlow, SlowDownFlow, OverthinkingBreakerTool
  ui/           # Button, Card (primitives)
```

---

## CSS / Animation Architecture

### Critical: Tailwind v4 + Turbopack keyframe delivery

`@keyframes` defined only in `globals.css` are **unreliable** under Turbopack/Tailwind v4 — they may not fire on component load. The working pattern is **dual delivery**:

1. Define keyframes in `globals.css` (fallback)
2. Also inject them via `<style jsx global>` directly inside the component that uses them

This is already in place on `HeroSection.tsx`. Follow the same pattern for any new component-level animations.

### Keyframes in use

All defined in `globals.css` AND mirrored in `HeroSection.tsx` via `<style jsx global>`:
- `riseUp` — ambient dot particles (uses CSS custom props `--ty`, `--tx`)
- `appear` — opacity-only hero headline letter reveal
- `letterLand` — tagline letter illuminate-on-land
- `floatUpDown` — tagline hover float
- `breatheReveal` / `breathePulse` — "Breathe" text animation
- `heroColorFadeIn` — sub-headline colour fade

### Ambient Particle Dots

- **160 dots**, generated in `useEffect` (hydration safety), state held in `page.tsx`
- Container: `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none`
- Each dot: pure CSS `riseUp` animation, `--ty` / `--tx` CSS custom properties set inline
- **No mouse interaction. No canvas. No connection lines.**
- Size: 0.8–3.8px, alpha: 0.10–0.45, duration: 12–32s, delay: 0 to -32s

---

## Design System

### Colour Tokens (`globals.css` / `styles/tokens.css`)

```css
--solace-void: #050508;       /* Primary background */
--solace-ink:  #0e0c1e;       /* Deep surface */
--solace-aura: #7B6FA0;       /* Primary accent — purple */
--solace-dusk: #4A5A8A;       /* Secondary accent — blue */
--solace-rose: #C4788A;       /* Emotional accent */
--solace-gold: #C8A870;       /* Premium accent — use sparingly */
--solace-fog:  #8B8FA8;       /* Secondary text / labels */
--font-display: 'Cormorant Garamond', serif;
--font-body:    'DM Sans', sans-serif;
```

### Realm Colours

| Realm | Route | Feeling | BG gradient | Accent |
|-------|-------|---------|-------------|--------|
| Emerald — Clear Your Mind | `/tools/clear-your-mind` | "When my mind won't stop" | `145deg, #0a1a12, #0d2018, #081610` | `rgba(68,200,110,1)` |
| Azure — Choose | `/tools/choose` | "When I can't decide" | `145deg, #080e1a, #0c1428, #080c18` | `rgba(68,138,228,1)` |
| Amber — Break It Down | `/tools/break-it-down` | "When I feel overwhelmed" | `145deg, #1a1008, #281808, #180e04` | `rgba(218,148,48,1)` |

### Typography

- **Display / Headlines**: Cormorant Garamond 300
  - Hero headline: `clamp(38px, 5.8vw, 70px)`, line-height 1.18
  - Section headings: `clamp(26px, 3.2vw, 40px)`
  - Italic variant colour on dark: `rgba(200,182,248,0.65)`
- **UI / Body**: DM Sans 300–400
  - Body: 14px, line-height 1.72, `rgba(155,147,200,0.52)`
  - Eyebrows/labels: 10px, letter-spacing 0.22–0.24em, uppercase
- **Never use**: Inter, Roboto, Arial, or system-ui for display text

### Spacing

```
4px → icon gaps    8px → inline    16px → component padding
24px → card        48px → section  96px → hero breathing room
```

### Borders & Radius

- Cards: 14–22px | Buttons: 2px (sharp — intentional) | Pills: 100px | Orbs: 50%
- Card borders: 0.5px solid, low-opacity accent colour

### Animation

- Hero headline letters: **pure opacity dissolve only** — never `translateY`, never movement
- All transitions: `ease` or `cubic-bezier(0.22,1,0.36,1)` — never `linear` on UI
- Minimum transition: 300ms. Preferred: 400–600ms
- Hover states: smooth in AND out
- Orb pulse: 5–6s `ease-in-out infinite`

---

## Layout Constraints

**Max content width: 1100px, centred**. Applies to nav inner content, footer inner content, and all sections. The outer element can be full-width; the inner wrapper is always constrained.

**Nav pattern** (outer `<nav>` full-width, inner `<div>` constrained):
```jsx
<nav style={{ position: "relative", zIndex: 10, padding: "32px 0" }}>
  <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px",
                display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    {/* Logo | Links */}
  </div>
</nav>
```

**Footer pattern** (border-top goes on inner `<div>`, NOT the `<footer>` element):
```jsx
<footer style={{ width: "100%" }}>
  <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "18px 40px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "24px", borderTop: "0.5px solid rgba(255,255,255,0.04)" }}>
    {/* Disclaimer | Read scope */}
  </div>
</footer>
```

**Cards / grids**: max-width 1000px

---

## Hard Rules

- Never add orb/sphere elements inside tool cards or the lab card
- Never use `translateY` on hero headline letters
- Never put `box-shadow` or glow on the lab card
- Never add vertical decorative lines between sections
- Never let nav or footer content stretch beyond 1100px
- Never place `border-top` on the outer `<footer>` element — only on the inner container
- All interactive components require `'use client'` directive
- Store all `setTimeout` refs in arrays (`timers.current`), clear on unmount
- Particle/dot generation always in `useEffect` to avoid hydration mismatch
- When adding CSS custom properties (`--ty`, `--tx`) as inline React styles, cast as `React.CSSProperties`

---

## Work Philosophy

Built by one person, 3-hour daily workflow. Implement precisely, verify after each change, never over-engineer. When in doubt, do less and do it better.
---

## Product Vision & Business Context

Solace is a bootstrapped solo project. There is one person building it.
Every decision must balance quality with speed. Do not over-engineer.
Do not add complexity that wasn't asked for. Implement precisely what
is specified — nothing more.

### Monetisation Model
Freemium with subscription:
- Free tier: Limited sessions per month, no memory between sessions
- Pro (£9/mo or £79/yr): Unlimited sessions + Solace remembers the user
  over time — this memory is the core value of Pro
- The freemium line is: free users experience the full beauty of Solace,
  paid users experience a Solace that knows them
- B2B / Teams is a future phase — do not build for it yet

### The Retention Hook
Memory and personalisation are the primary retention drivers.
Solace gets to know the user over time. Past sessions inform future
responses. Users fear losing this accumulated insight — that's the moat.
Do not build streaks, push notifications, or gamification — these are
explicitly NOT part of the Solace philosophy.

---

## Solace Tone of Voice

This is critical. Every word in the UI must sound like Solace, not like
a generic SaaS product.

### Solace sounds like:
- A brilliant, caring friend who genuinely wants the best for you
- Calm, unhurried, intelligent
- Honest without being blunt
- Warm without being saccharine
- It asks good questions rather than giving fast answers

### Solace never sounds like:
- A therapist ("How does that make you feel?")
- A productivity app ("Optimise your decision-making")
- A chatbot ("I'm here to help! 😊")
- A self-help book ("Unlock your potential")
- Corporate wellness ("Your mental health matters to us")

### Tone examples
Wrong: "Enter your thoughts below to get started."
Right: "What's on your mind?"

Wrong: "Our AI will analyse your input."
Right: "Solace will think alongside you."

Wrong: "Break It Down helps you decompose complex problems."
Right: "When something feels too large to begin."

Wrong: "You have 3 sessions remaining this month."
Right: "You've used 3 of your sessions this month."

### Key language rules
- Never say "AI" in user-facing copy — say "Solace"
- Never say "data" or "input" — say "thoughts" or "what you've shared"
- Never say "features" — say "tools" or "realms"
- Never say "users" in UI copy — address as "you"
- Buttons should feel like invitations, not commands
  Wrong: "Submit" / "Analyse" / "Process"
  Right: "Begin" / "Help me see this clearly" / "I'm ready"

---

## Design Philosophy

### The core principle
Every element on every page must earn its place.
If it doesn't serve the user's emotional journey, remove it.
Less is always more in Solace.

### Visual hierarchy rules
1. The user always knows where they are
2. The user always knows what the next step is
3. The user never has to think "what do I do here?"
4. Nothing competes with the primary focal point on any given screen

### What Solace looks like
- Dark, atmospheric, deep — like a night sky
- Typography does the heavy lifting — not graphics or illustrations
- Motion is slow and intentional — nothing snaps or pops
- Colour is used sparingly and always carries meaning
  (Emerald = clarity of mind, Azure = decisions, Amber = complexity → order)
- Empty space is not wasted space — it is breathing room

### What Solace never looks like
- Bright, clinical, white
- Busy or cluttered
- Generic wellness (no mandalas, no abstract watercolours, no gradients on white)
- Corporate or SaaS-y

---

## Work Philosophy & Pace

This project is built by one person in 3 hours per day, Monday to Friday:
- Hour 1: Design & decide (with Claude.ai — visual design, strategy, copy)
- Hour 2: Build (Claude Code implements the designs from Hour 1)
- Hour 3: Grow (strategy, new ideas, new projects)
Everything else — testing, backups, audits — is automated.

### What this means for Claude Code
- Implement precisely what is specified — no scope creep
- After every implementation: run the dev server, check for errors
- If something is unclear, ask before implementing — don't assume
- Prefer targeted, surgical changes over rewrites
- Never touch files that weren't mentioned in the task
- Always confirm what you changed and why at the end of each task

---

## The Three Realms — Concept Only

Note: Tool page animations and interactions are still being designed.
Do not implement tool page animations without explicit instruction.
The realm concepts below are for context only — they will evolve.

### Emerald Realm — Clear Your Mind
Feeling: "When my mind won't stop"
Concept: A space to release thoughts and find what's actually there.
Status: Tool exists, animation TBD

### Azure Realm — Choose
Feeling: "When I can't decide"
Concept: A space to see a decision more clearly.
Status: Tool exists, animation TBD

### Amber Realm — Break It Down
Feeling: "When I feel overwhelmed"
Concept: A space to turn complexity into steps.
Status: Tool exists, animation TBD

---

## Questions to Ask Before Implementing

Before touching any file, confirm:
1. Have I read CLAUDE.md fully this session?
2. Do I know exactly which files need to change?
3. Does this change affect the hero section? (If yes — be extremely careful)
4. Will this break any existing animations or transitions?
5. Is the content width constrained to 1100px where needed?
6. Does any new text follow the Solace tone of voice?

If any answer is uncertain — check first, implement second.