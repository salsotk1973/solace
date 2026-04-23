# Solace Master Reference

## Product Definition

**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked, mobile + desktop):**
```
When your mind won't settle, it's hard to think clearly.
Solace helps you find the next right step — through thought, not noise.
```

---

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Auth:** Clerk
- **Database:** Supabase (with RLS enabled)
- **Payments:** Stripe (LIVE mode active)
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
- **GitHub:** `https://github.com/salsotk1973/solace` — `main` is deploy branch
- **Vercel projects:** `solace` (production) + `solace-clean` (secondary)
- **Auto-deploy:** push to `main` → both Vercel projects deploy
- **Clerk:** Production instance active, Google OAuth configured
- **Stripe:** Live mode, webhook configured, 6 events, 0% error rate

---

## Email Infrastructure

### Google Workspace ✅
- **Plan:** Business Starter — A$11.80/month
- **Primary inbox:** `hello@try-solace.app`
- **Aliases:** `privacy@`, `legal@` → `hello@`

### Brevo ✅ (Phase 1 complete)
- **Lists:** `Solace Users` ID 3, `Solace Newsletter` ID 5
- **Templates:** ID 1 Welcome, ID 2 Day 3, ID 3 Day 14
- **Automation #1** active: list 3 → wait 3d → template 2 → wait 11d → template 3 ✅
- **Clerk webhook** on `user.created`: adds to list 3 + sends template 1 ✅

### Brevo Phase 2 (post-launch)
- Welcome Day 2 + Day 5
- Free-to-paid nudge Day 1, 4, 8
- Re-engagement Day 14, 21, 30
- Post-upgrade onboarding Day 0, 3, 30

---

## Pricing (Locked)

- **Free tier:** All tools with limits, 7-day history, Choose 1/day free
- **Paid tier:** A$9/month or A$79/year
  - Unlimited Choose, Clear Your Mind, Break It Down
  - Full history, patterns, streaks, export, early access

**Conversion trigger:** 7-day history cutoff = day 8 is natural upgrade moment.

---

## Category System (Locked)

| Category | Colour | Hex | Tools |
|---|---|---|---|
| **Calm** | Teal | `#3CC0D4` | Breathing, Sleep Wind-Down |
| **Clarity** | Gold | `#E8A83E` | Focus Timer, Mood Tracker, Gratitude Log, Clear Your Mind (AI) |
| **Decide** | Violet | `#7C6FCD` | Choose (AI), Break It Down (AI) |

**Tool count: 8 total** (Thought Reframer removed Apr 2026)

### The 5 Client-Side Tools
Breathing, Sleep Wind-Down (Calm) · Focus Timer, Mood Tracker, Gratitude Log (Clarity)

### The 3 AI Tools
- **Choose** — Decide (violet) — 1/day free, unlimited paid
- **Clear Your Mind** — Clarity (gold) — paid only
- **Break It Down** — Decide (violet) — paid only

---

## Thought Reframer — REMOVED ✅ (Apr 2026)
Removed entirely. Routes 308 → `/tools`. All DB records deleted. Removed from design-tokens, middleware, sitemap, FAQ, dashboard. **All Lab article references cleaned up Apr 2026** (see Lab section).

---

## Design System (Locked)

### Colours
- **Background:** `#090d14`
- **Canonical teal:** `#3CC0D4` = `rgba(60,192,212,a)` — `T = (a) => \`rgba(60,192,212,${a})\``
- **Category colours:** import from `lib/design-tokens.ts` — never hardcode
- **`getToolRgb(tool)` helper** — derive canonical RGB from tool slug

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
- **SiteHeader.tsx — LOCKED with one documented exception** (see SiteHeader section)
- **SiteHeaderMobileMenu.tsx** — React Portal pattern (see Drawer section)
- SiteFooter.tsx — see footer section
- `PageShell` default `particles={false}` ✅
- `glassBackground()`, `glassBorder()`, `getToolRgb()` from design-tokens

---

## SiteHeader — LOCKED with documented exception ✅ (Apr 2026)

**SiteHeader.tsx is LOCKED. One documented modification was made Apr 2026 to fix mobile full-width.**

### The fix (DO NOT REVERT)

The header's background gradient div uses inline styles. Original (broken):
```
left: max(24px, calc(50% - 696px));
right: max(24px, calc(50% - 696px));
```

Fixed:
```
left: max(0px, calc(50% - 696px));
right: max(0px, calc(50% - 696px));
```

The `24px` floor created a 24px gap on each side of the header background at every viewport below ~1488px — most visibly on mobile (48px of dead horizontal space).

### Math reference

| Viewport | Offset | Behaviour |
|---|---|---|
| 375px | 0px | Full-width gradient (mobile) |
| 430px | 0px | Full-width gradient |
| 768px | 0px | Full-width gradient (tablet) |
| 1024px | 0px | Full-width gradient |
| 1440px | 0px | Full-width gradient (standard desktop) |
| 1622px | 115px | Centred under 1440px content area |
| 1920px | 240px | Centred under 1440px content area |

**Hard rule: Never revert `max(0px, ...)` back to `max(24px, ...)`.**

---

## Mobile Menu Drawer — Fixed ✅ (Apr 2026)

**Component:** `components/SiteHeaderMobileMenu.tsx`

### Root cause (now fixed)
SiteHeader has `backdrop-filter: blur(12px)`. Per CSS spec, ancestors with `transform`, `filter`, `backdrop-filter`, `perspective`, or `will-change` become the containing block for descendant `position: fixed` elements. The drawer's `position: fixed; left: 0; right: 0` therefore anchored to SiteHeader (not viewport) and inherited internal width constraints → dark strips on mobile.

### The fix (commit `1af867e` + portal refactor)

Drawer rendered via React Portal to `document.body`:
```tsx
import { createPortal } from "react-dom";

const drawerContent = (
  <div style={{ position: "fixed", top: 80, left: 0, right: 0, width: "100vw" }}>
    {/* drawer children */}
  </div>
);

return typeof window !== "undefined"
  ? createPortal(drawerContent, document.body)
  : null;
```

**Hard rule: Never inline the drawer back into SiteHeader.** Must remain rendered via portal to escape the backdrop-filter containing block.

---

## Homepage — Desktop ✅ LOCKED (Apr 2026)

### Section Order (locked)
Hero → FREE — START HERE → AI Tools → FROM THE LAB → Footer

### Hero (desktop)
- `md:pt-[200px] md:pb-16` — deterministic, no min-h
- Headline `md:text-[64px]` with non-breaking space: `won't{"\u00A0"}settle,`
- Headline line-height `md:leading-[1.0]`
- **No CTA on desktop** (Spec 02b)
- **Nav offset rule:** with 80px fixed nav, hero `md:pt-[200px]` = 80 nav + 120 air

### FREE — START HERE
- Container `max-w-6xl mx-auto px-6 md:px-12 lg:px-24`
- Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- 6 cards (Breathing, Focus Timer, Sleep Wind-Down, Mood Tracker, Gratitude Log, All tools)
- "All tools" card uses `neutral` slate
- Section padding `pt-6 pb-16 md:pt-10 md:pb-14`

### AI Tools (desktop)
- Section headline `md:text-4xl` (36px)
- Card `md:min-h-[320px]`, body `md:leading-[1.6]`
- Section padding `md:pt-12 md:pb-16`

### Lab Section (desktop)
- Container matches AI section width
- Grid `grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6`
- 3 equal columns. **No col-span-2 hero.**
- Section padding `py-8 md:py-10`

#### FeaturedLabCard (Editor's Pick)
- Padding `20px 22px`
- Title `20px` Cormorant flat
- Pill `3px 10px` — "Editor's pick" only
- Pill wrapper `marginBottom: 24px`
- Bottom row `justifyContent: space-between`
- Hover `translateY(-2px)`, bg +0.03, border +0.12, 220ms
- Box shadow `0 0 8px 1px rgba(accent,0.12)`

#### LabSecondaryCard (cards 2 + 3)
- Padding `20px 22px`, border-radius `16px`
- Title `20px` Cormorant, lineHeight `1.2`
- Excerpt `12px` Jost, lineHeight `1.6`
- Per-instance hover scope class `lab-secondary-${article.category}`
- `@media (hover: hover)` guard

#### Lab data
- **Editor's Pick:** Manual via `FEATURED_LAB` in `page.tsx`
- **Secondary cards:** Dynamic via `getAllArticles().filter(excludeEditorsPick).slice(0,2)`
- Calendar reminder set: 23 May 2026 (monthly)

### Footer (desktop)
- Backdrop blur + dark gradient REMOVED (was bleeding through gradients)
- SOLACE wordmark below bottom bar: Cormorant 18px, `letterSpacing: 0.32em`, `rgba(255,255,255,0.12)`
- Hidden on mobile via `footer-desktop-wordmark { display: none !important }`

---

## Mobile Homepage — LOCKED ✅ (Apr 2026)

### Hero
- `pt-[18vh]`
- Hairline divider between hero and FREE START HERE removed

### Lab Cards
- All 3 cards stack vertically
- "Editor's pick" pill visible on mobile
- Gap `gap-4` (16px) uniform

### Footer (mobile)
1. 5 product/learn links centered
2. 2 legal links centered
3. Hairline divider 32px wide, 0.5px, `rgba(255,255,255,0.18)`
4. Centered disclaimer max 320px, 12px, lh 1.7, 0.65 opacity
5. `© 2026 · Built with care.` 11px 0.65
6. SOLACE wordmark Cormorant 18px, 0.32em letter-spacing, 0.55 opacity

---

## Tools Page — LOCKED ✅ (Apr 2026)

### ToolCard (mobile scoped)
- Padding `14px 18px 14px`
- `min-height: auto` — desktop calibration overridden
- Hover-row `display: none`
- Description `13px / 1.5`

### FamilyGroup (mobile)
- Eyebrow `mb-3 pb-0`
- Divider `md-only`

### page.tsx (mobile)
- Hero `padding-top: 100`
- Gap `24` between groups
- **SEO essay `hidden md:block`** — DOM kept, hidden on mobile
- FAQ `mb-12`

**Scoping rule:** All mobile ToolCard overrides scoped — never modify desktop to fix mobile.

---

## Lab Landing Page — LOCKED ✅ (Apr 2026)

### Mobile Lab Landing (R1 + R2 + R3)

#### LabSecondaryCard (mobile scoped)
- Eyebrow: plain small-caps label (no pill chrome) — 11px Jost, 0.18em, uppercase, category color
- Title reduced from desktop 20px to fit 1-2 lines
- Excerpt `display: none` on mobile
- Reading time `display: none` on mobile (wrapper hidden too)
- Padding `14px 18px 14px`
- `min-height: auto`

#### FeaturedLabCard (mobile scoped)
- One pill only: "Editor's Pick"
- Excerpt KEPT on mobile (editorial — persuade, not just scan)
- Excerpt color `rgba(255,255,255,0.80)`
- Reading time `display: none` (R3)
- Padding `14px 18px 14px`

#### Closing CTA section
- Mobile padding-top reduced to ~48-64px
- Body text `rgba(255,255,255,0.80)`, 14px, lh 1.5-1.6
- Stale copy fixed: "Eight tools for breathing, focus, sleep, decisions, and AI-powered reflection." (was "Nine tools... thought reframing")

#### Weekly Dispatch
- Body text `rgba(255,255,255,0.80)`
- Email placeholder `rgba(255,255,255,0.65)`, 14px (global)

#### "BROWSE ALL ARTICLES →" link (locked benchmark)
- Jost, sans-serif
- 12px, 400 weight
- letter-spacing 1.68px (`tracking-[0.14em]`)
- color `rgba(255, 255, 255, 0.65)`
- uppercase

### Lab landing rationale (locked)
- Editor's Pick = editorial hero, keeps excerpt, larger card
- Secondary cards = scan, no excerpt, no reading time on mobile
- Curiosity gap principle: titles unanswered = clicks; excerpts that answer = bounces

---

## Lab Archive Page — LOCKED ✅ (Apr 2026)

### ArchiveCard (mobile scoped — denser than landing)
- Eyebrow: plain small-caps label (no pill chrome)
- `margin-bottom: 8px` below eyebrow
- Reading time `display: none`
- Title fits in max 2 lines
- Padding `12px 16px 12px`
- `min-height: auto`
- Border-radius `14px`
- Card gap `12px`

### Filter pills (KEEP pill chrome)
- Filter pills are interactive controls — DIFFERENT visual treatment from passive metadata labels (lesson 24)

### Back-link "← THE LAB" (locked Apr 2026)
- Jost, 12px, 400, `tracking-[0.14em]`, uppercase
- color `rgba(255, 255, 255, 0.65)`, hover `rgba(255, 255, 255, 0.85)` 200ms
- "THE LAB" not "Back to Lab" — destination naming, NYT/Atlantic pattern, stronger SEO anchor
- Was "← Lab" at `rgba(170, 158, 220, 0.55)` (below 0.65 floor + purple)

### Archive density target
- 3-4 cards per mobile viewport (was 1.2 pre-fix)
- ~5 swipes to scan all 15 articles (was 13)

---

## Article Template — LOCKED ✅ (Apr 2026)

### Back-links (header + footer)
Both header and footer back-links unified to `← THE LAB`:
- Jost, 12px, 400, `tracking-[0.14em]`, uppercase
- color `rgba(255, 255, 255, 0.65)`, hover `rgba(255, 255, 255, 0.85)` 200ms
- Was: header "← The Lab" at purple 0.42; footer "← Back to the Lab" at purple 0.38

### "MORE FROM THE LAB" eyebrow
- color `rgba(255, 255, 255, 0.65)` (was purple 0.42)
- 11px (master floor)

### Related cards mobile
- Single column, full width
- Plain small-caps label (no pill chrome on mobile)
- Padding `14px 18px 14px`
- "X MIN READ" hidden on mobile
- **Excerpt KEPT** (intentional divergence from Lab landing — lesson 22/23: article footer = retention, not discovery)
- Desktop unchanged: 2-column, pill chrome, padding preserved

### Article italic Cormorant headline ("This is what X was built for.")
- `text-wrap: pretty` applied — prevents orphan widow
- Browser auto-fixes on iOS 17.4+ / Chrome 117+ / Safari 17.4+
- Graceful degradation on older browsers

---

## Lab Article Tool CTAs — LOCKED ✅ (Apr 2026)

### Thought Reframer cleanup (deployed Apr 2026)
All 6 affected articles fixed. Zero TR references remain in any article.

#### Worry article — full restructure
**Slug + title preserved for SEO** (`how-to-stop-worrying-about-things-you-cant-control`)
- Cut "The only question that cuts through" section (didn't map to any current tool)
- Renamed "What to do when the answer is no" → "What actually helps"
- Added bridging paragraph
- Mid-article CTA: Clear Your Mind
- End CTA: Clear Your Mind (single — multi-tool ending REJECTED, see lesson 31)
- ~150 words removed, ~50 added
- Title untouched (preserves SEO target)

#### 5 articles — secondary mention swaps
| Article | Replacement tool |
|---|---|
| how-box-breathing-actually-works | Sleep Wind-Down |
| why-you-cant-focus | Clear Your Mind |
| how-to-wind-down-before-sleep | Clear Your Mind |
| why-you-feel-anxious-for-no-reason | Clear Your Mind |
| how-to-actually-rest | Clear Your Mind |

4 of 5 → Clear Your Mind (cognitive uncluttering = TR's old job, paid → conversion). 1 → Sleep Wind-Down (somatic content fit).

### CTA card design (locked Apr 2026)

#### Card background derives from canonical tool color
Format: `linear-gradient(145deg, rgba(${rgb}, 0.06), rgba(${rgb}, 0.02), rgba(${rgb}, 0.04))` over `#0a0e15` base. **No hardcoded background gradients.** Uses `getToolRgb(tool)` helper.

Border: `0.5px solid rgba(${rgb}, 0.18)`.

### CTA button design (locked Apr 2026)

#### Layout
- Button label rendered as single template string with `\u00A0` before arrow: `{`Try ${toolName}\u00A0→`}`
  - Prevents React HTML comment between text nodes (iOS Safari nowrap edge case)
- `white-space: nowrap`, `max-width: 100%`

#### Typography (default ≥360px)
- 12px Jost, 400, `letter-spacing: 0.12em`, uppercase
- Padding `10px 24px`, border-radius `4px`
- Border `1px solid rgba(${rgb}, 0.28)`
- Background `rgba(${rgb}, 0.08)`
- Color `rgb(${rgb})`

#### iPhone SE fallback (≤360px)
- 11px font, `letter-spacing: 0.10em`, padding `9px 14px`

#### Mobile arrow hide (mid-article CTA only — Apr 2026)
- Arrow `→` wrapped in `<span className="cta-button-arrow">`
- `@media (max-width: 768px) { .cta-button-arrow { display: none; } }`
- End CTA keeps arrow on all viewports (different visual moment, more weight)

#### Hover (desktop)
- Transition `200ms ease-out` on bg + border + box-shadow + transform
- Hover bg → `rgba(${rgb}, 0.14)`, border → `rgba(${rgb}, 0.55)`
- Glow `box-shadow: 0 0 18px 2px rgba(${rgb}, 0.25)`
- Lift `translateY(-1px)` gated by `prefers-reduced-motion`

### CTA color derivation rule (locked)
End-of-article CTA button color derives from the **linked tool's category**, NOT the article's category. Article in Calm category linking to Clarity tool shows GOLD button (matching tool), not teal (matching article). Tool color is identity; article color is context.

---

## Pages Status

| Page | Status |
|---|---|
| Home (mobile) | ✅ LOCKED Apr 2026 |
| Home (desktop) | ✅ LOCKED Apr 2026 |
| Tools (mobile) | ✅ LOCKED Apr 2026 |
| Tools (desktop) | ✅ |
| Lab landing (mobile) | ✅ LOCKED Apr 2026 |
| Lab landing (desktop) | ✅ LOCKED Apr 2026 |
| Lab archive (mobile) | ✅ LOCKED Apr 2026 |
| Lab archive (desktop) | ✅ LOCKED Apr 2026 |
| Article template | ✅ LOCKED Apr 2026 (back-links + related cards mobile + headline orphan) |
| Article CTAs | ✅ LOCKED Apr 2026 (canonical color, hover, button copy, mobile arrow hide) |
| All 15 Lab articles | ✅ Zero TR references, all CTAs current tools |
| SiteHeader | ✅ LOCKED Apr 2026 (with documented exception) |
| Mobile menu drawer | ✅ LOCKED Apr 2026 (React Portal) |
| Pricing | ✅ A$9/A$79 |
| About / Principles / Privacy / Terms | ✅ |
| Dashboard | ✅ All 8 tools, AI sessions logging |

---

## Lab — Human Behaviour Lab

### 15 articles

| Slug | Category | Linked tool |
|---|---|---|
| `why-you-cant-stop-overthinking` | think-clearly | Clear Your Mind (**Editor's Pick**) |
| `how-to-feel-less-overwhelmed` | think-clearly | Break It Down |
| `how-box-breathing-actually-works` | calm-your-state | Breathing |
| `why-you-cant-focus` | calm-your-state | Focus Timer |
| `how-to-wind-down-before-sleep` | calm-your-state | Sleep Wind-Down |
| `what-is-cognitive-reframing` | think-clearly | Clear Your Mind |
| `how-to-track-your-mood` | think-clearly | Mood Tracker |
| `does-gratitude-journalling-work` | notice-whats-good | Gratitude Log |
| `how-to-make-a-hard-decision` | think-clearly | Choose |
| `what-is-the-human-behaviour-lab` | think-clearly | Clear Your Mind |
| `why-you-feel-anxious-for-no-reason` | calm-your-state | Breathing |
| `how-to-stop-worrying-about-things-you-cant-control` | calm-your-state | **Clear Your Mind** (cross-category — gold button on calm article) |
| `what-is-decision-fatigue` | think-clearly | Choose |
| `how-to-stop-being-so-hard-on-yourself` | notice-whats-good | Gratitude Log |
| `how-to-actually-rest` | calm-your-state | Breathing |

**Category balance:** Calm 5, Think clearly 6, Notice what's good 2 ← needs more

### Components
- `components/home/LabSecondaryCard.tsx`
- `components/home/FeaturedLabCard.tsx`
- Lab archive card + article CTA card/button — all locked Apr 2026

---

## Breathing Tool — Design Benchmark ✅

**Breathing is the benchmark for ALL tools.** Take live screenshots of both tools side-by-side BEFORE writing any spec.

### 11 decisions locked (apply to ALL tools):
1. Stop = Begin (solid filled teal pill)
2. SessionComplete visible moment
3. Info cards: Duration + Best For only, compact
4. History collapses on mobile
5. Begin button `py-3` for 44px tap target
6. Pattern pills exact classes
7. All text ≥ 0.65 opacity
8. Canonical teal `#3CC0D4`
9. Cross-links use `glassBackground()`, `glassBorder()`, `getToolRgb()`
10. Cross-links hidden on mobile
11. No container on mobile

### BreathingOrb — Known Issue ⚠️
Flicker on phase transitions. Original React-state version restored (`e46f3ce`). **Do not attempt without local interactive debugging.**

---

## Build Infrastructure — Fixed ✅ (Apr 2026)

### Supabase Lazy-Init ✅
- `lib/supabase/server.ts` Proxy lazy-init
- `lib/supabase.ts` Proxy lazy-init

### Stripe Lazy-Init ✅
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/portal/route.ts`
- `app/api/stripe/webhooks/stripe/route.ts`

### GitHub Actions ✅
- All 9 secrets set
- All tests green

---

## SEO ✅ (Apr 2026)
- Sitemap: 17 pages, submitted Apr 15, last read Apr 18
- `metadataBase` set in `layout.tsx`
- 11 pages indexed by Google

---

## Tool Build Status

### Free/Paid Gating

| Tool | History API | 7-day cutoff | Upgrade prompt | SessionComplete |
|---|---|---|---|---|
| Breathing | ✅ | ✅ | ✅ | ✅ |
| Sleep Wind-Down | ✅ | ✅ | ✅ | ✅ |
| Focus Timer | ✅ | ✅ | ✅ | ✅ |
| Mood Tracker | ✅ | ✅ | ✅ | — |
| Gratitude Log | ✅ | ✅ | ✅ | — |
| Choose (AI) | — | — | ✅ daily nudge | ✅ |
| Clear Your Mind (AI) | — | — | ✅ paid gate | ✅ |
| Break It Down (AI) | — | — | ✅ paid gate | ✅ |

### AI Tools ✅
- Crisis detection: 15/15 tests passing
- Cross-tool routing: working
- Dashboard session logging: all 3 AI tools

### Stripe ✅ LIVE
- End-to-end test PASSED (A$9 real payment → webhook → plan=paid → refunded)

---

## Still Needed (priority order)

- [x] Desktop homepage audit ✅ Apr 2026
- [x] Tools page mobile audit ✅ Apr 2026
- [x] Lab landing mobile audit ✅ Apr 2026 (R1+R2+R3)
- [x] Lab archive mobile audit ✅ Apr 2026
- [x] Header background full-width mobile ✅ Apr 2026
- [x] Mobile menu drawer full-width ✅ Apr 2026 (React Portal)
- [x] Archive back-link upgrade ✅ Apr 2026
- [x] Article template back-links + related cards ✅ Apr 2026
- [x] Article headline orphan ✅ Apr 2026 (`text-wrap: pretty`)
- [x] All TR references cleaned across 15 articles ✅ Apr 2026
- [x] Worry article restructured ✅ Apr 2026
- [x] CTA card canonical colors ✅ Apr 2026
- [x] CTA button hover glow + lift ✅ Apr 2026
- [x] CTA button arrow orphan (iOS Safari) ✅ Apr 2026
- [ ] CTA button mid-article arrow hide on mobile (deployed pending verification)
- [ ] **BreathingOrb flicker** — needs local interactive debugging
- [ ] **Mood Tracker** — apply Breathing benchmark
- [ ] **Gratitude Log** — apply Breathing benchmark
- [ ] SessionComplete for Mood Tracker, Gratitude Log
- [ ] Upgrade Supabase to Pro at launch ($25/month)
- [ ] Newsletter opt-in UI (dashboard checkbox → Brevo list 5)
- [ ] Brevo Phase 2 email sequences (post-launch)
- [ ] Export feature (not built for any tool)
- [ ] PostHog saved insights (after 7 days traffic)
- [ ] Sitemap update — add Lab article URLs post-launch
- [ ] notice-whats-good Lab category needs more articles (only 2)
- [ ] Reddit account + first post
- [ ] Google Postmaster Tools — register `try-solace.app`
- [ ] Monthly Lab article agent (30 days post-launch, calendar 23 May 2026)

---

## Process Lessons

### Pre-existing (1-21)
1-21: see prior version of master — covering layout, hero/nav, container relationships, mobile breakpoint discipline, SEO essay handling.

### Lessons from Lab landing + archive audits (Apr 2026)

**22. Card density follows job-to-be-done, not design-system uniformity.** Lab landing secondary cards and Lab archive cards share content model but have different jobs (discovery vs scan). Density follows job, not consistency. Archive cards are MORE compact than landing cards on purpose.

**23. Editorial cards keep their excerpt; scan cards drop it.** Excerpt copy on a card answers the curiosity gap that the title creates. On editorial/hero cards (Editor's Pick) where job is persuasion, excerpt earns space. On scan cards (secondary on listing, archive cards) where job is title-driven click-through, excerpt slows the user. Drop excerpts on scan-mode cards; keep them on persuade-mode cards.

**24. Filled pills = interactive control. Plain labels = passive metadata.** Lab archive filter pills keep filled pill shape because tappable; card category labels drop the pill chrome on mobile because passive. Same visual element, different jobs, different correct treatment. Don't enforce visual consistency between elements with different interaction roles.

**25. Diagnose before you fix — open DevTools when a CSS issue is mysterious.** When a layout issue isn't responding to fixes, the spec must require Claude Code to inspect the element tree, identify the actual offending property/value, then write the override. Diagnostic step is not optional.

### Lessons from header full-width + drawer fix (Apr 2026)

**26. When a component is LOCKED, the bug might be IN the locked component.** Three rounds of failed fixes happened because the SiteHeader LOCK made everyone (including me) assume the bug had to be in a child component. Actual bug was a one-line CSS expression INSIDE SiteHeader.tsx. **A LOCK means "don't modify casually", not "the bug can't be here."** When external fixes fail, lift the lock surgically with documentation.

**27. Use JavaScript inspection in the browser before guessing CSS.** When a CSS bug isn't responding to fixes, run JavaScript queries against the live DOM to extract actual rendered values and inline styles. Don't write more CSS specs without diagnostic data.

**28. `position: fixed` does NOT escape ancestors with `transform`, `filter`, `backdrop-filter`, `perspective`, or `will-change`.** Standard CSS gotcha. Fix: use React Portal (`createPortal`) to render at `document.body` level, escaping all ancestor containing blocks.

### Lessons from article template + headline (Apr 2026)

**29. Use `text-wrap: pretty` for short editorial headlines that mix static + dynamic text.** When a headline like "This is what [X] was built for." has variable middle content and italic typography, line breaks are unpredictable and orphans common. `text-wrap: pretty` is the modern CSS solution — one property, browser-handled, graceful fallback. Better than per-string non-breaking spaces because it's structural and survives copy changes. Reserve for short headlines/CTAs only.

### Lessons from Thought Reframer cleanup (Apr 2026)

**30. When deleting a tool, audit ALL content that references it.** TR was deleted in code (routes 308'd, DB cleared), but 6 of 15 Lab articles still referenced it. Search-and-grep across `content/` is mandatory whenever any tool is removed.

**31 (REVISED). Multi-tool endings are wrong.** Initial impulse was to map an article that taught 3+ moves to 3+ tools. In practice, rendered as a menu, broke conversion focus, implementation rendered as plain text instead of buttons. **One article = one tool = one CTA.** If article body teaches multiple moves not mapping to one tool, REWRITE the body to focus on moves that DO — don't dilute the CTA. **Articles serve tools; tools don't serve articles.**

### Lessons from CTA implementation (Apr 2026)

**32. When a previous deploy rendered CTAs as plain text, future spec MUST require Claude Code to first read a working CTA component before writing changes.** The failure mode of "wrote plain markdown link instead of using the CTA component" is preventable by mandating the reference-read step.

**33. When copying a working component pattern, audit the COPY for semantic accuracy.** Pattern-copy is fast but blind — "Free to use. No account needed." was ported onto a paid tool from a free-tool article without semantic check. Verify every claim against the linked tool's actual properties (free/paid, login/no-login, category) when copying CTA structures.

**34. Component color must derive from semantic data, not contextual data.** End-CTA button inheriting article's category color is a category error — button represents a tool, so its color must match the tool. When a component visually represents an entity, its visual properties must derive from THAT entity's data — never from surrounding context.

**35. Hardcoded backgrounds defeat color systems.** A correctly-colored border can't visually compete with a saturated wrong-colored background. Color systems work top-down: large surface (background) > medium surface (border) > small accent (text/icon). When implementing canonical color treatments, prioritise the LARGEST visible surface first.

**36. Interactive elements without hover feedback feel broken on desktop.** A button that doesn't respond to mouse-over reads as decorative or disabled. Always include hover states for interactive elements; gate motion via `prefers-reduced-motion`.

**37. When text wraps unexpectedly, measure before resizing.** When a layout issue can be either "size mismatch" or "wrap behaviour," measure both before choosing the fix. Wrap-permission fixes preserve the design system; resizing fixes erode it.

**38. When `white-space: nowrap` doesn't prevent wrapping on iOS Safari, check for React-emitted HTML comments between text nodes.** React + Next.js production builds sometimes emit `<!-- -->` between adjacent text nodes from interpolated JSX. iOS Safari treats these comments as soft break points that nowrap doesn't reliably honor. Fix: render the entire label as a single template string with explicit non-breaking space where needed.

**39. When measurement says a CSS fix should work but the visual bug persists, the bug isn't in the CSS — it's in the DOM structure.** When computed styles look correct but visual behavior is wrong, inspect the DOM tree (innerHTML, child nodes). Structure may differ from what the JSX implies.

**40. When a button looks "lost" in its container, change the container relationship — not just the button size.** When a control feels visually wrong inside its container, examine the layout relationship (width, alignment, justification) BEFORE adjusting the control's intrinsic styling.

**41. When a deploy "didn't take effect," inspect via DevTools FIRST — before writing another spec.** Multiple times this session, a spec apparently didn't ship and my reflex was to write a new spec. The right move is always: inspect the live DOM, confirm what shipped, then decide. Specs based on the assumption that the previous spec shipped are dangerous when it didn't.

---

## Key Rules (Never Break)

- Read solace-master before any work
- **Breathing is the benchmark** — take live screenshots of both tools side-by-side before writing any spec
- **BENCHMARK RULE:** Screenshot both tools at 375px before reading any source code. Visual first.
- **SiteHeader.tsx — LOCKED with one documented exception** (`max(0px, ...)` background offset). Never revert to `max(24px, ...)`.
- **SiteHeaderMobileMenu.tsx — locked at portal pattern.** Never inline back into SiteHeader.
- **SiteFooter.tsx** — blur removed; desktop wordmark added; mobile structure documented.
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
- **Verify Vercel deployment is Current AND check live bundle before claiming fix is deployed** (lesson 41)
- **Never approximate Breathing values** — read actual source and copy exactly
- **No sounds on Breathing or Sleep Wind-Down** — silence intentional
- When widening a parent container, audit child `maxWidth` constraints (lesson 11)
- Check inline `style={{...}}` for property conflicts before writing CSS rules (lesson 12)
- Hero `pt` on fixed-nav pages = nav-height + intended-air (lesson 13)
- Mobile `min-height` must override desktop — never inherit (lesson 19)
- SEO essays use `hidden md:block` — never remove DOM content to clean mobile UX (lesson 21)
- Card density follows job-to-be-done, not design-system uniformity (lesson 22)
- Editorial cards keep excerpts; scan cards drop them (lesson 23)
- Filled pills = interactive controls. Plain labels = passive metadata. (lesson 24)
- Diagnose before fixing — open DevTools when layout issue is mysterious (lesson 25)
- A LOCK doesn't mean the bug can't be inside the locked component (lesson 26)
- Use JavaScript inspection before guessing CSS (lesson 27)
- `position: fixed` does NOT escape `transform`/`filter`/`backdrop-filter`/`perspective`/`will-change` ancestors — use React Portal (lesson 28)
- Use `text-wrap: pretty` for short editorial headlines (lesson 29)
- When deleting a tool, audit all content referencing it (lesson 30)
- **One article = one tool = one CTA. Articles serve tools.** (lesson 31)
- When copying CTA pattern, audit copy for semantic accuracy (lesson 33)
- Component color derives from semantic data (the tool), not contextual (the article) (lesson 34)
- Hardcoded backgrounds defeat color systems — prioritise largest visible surface (lesson 35)
- Interactive elements without hover feedback feel broken on desktop (lesson 36)
- Measure before resizing when text wraps unexpectedly (lesson 37)
- iOS Safari + nowrap + React HTML comments = single-string template fix (lesson 38)
- When CSS computes correct but renders wrong, check DOM tree (lesson 39)
- When a control looks lost in its container, change the container relationship (lesson 40)
- **When a deploy "didn't take effect," inspect DevTools FIRST before writing another spec** (lesson 41)

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