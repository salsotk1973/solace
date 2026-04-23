# Solace Master Reference

## Product Definition

**Solace** is a wellness SaaS focused on **decision clarity and mental uncluttering** for people overwhelmed by life — career crossroads, relationship strain, feeling lost. NOT a meditation app. NOT a journal. A thinking partner.

**Positioning (locked):** "Clarity and decisions for people overwhelmed by life"

**Hero copy (locked, mobile + desktop):**
```
When your mind won't settle, it's hard to think clearly.
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

### Mobile spacing token cheat sheet

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

## Mobile Homepage — LOCKED ✅ (Apr 2026)

**Both mobile and desktop homepage audits complete. Homepage is locked.**

### Hero (mobile)
- **`pt-[18vh]`** (was `pt-[12vh]`) — more breathing room below nav on real iPhone
- **Hairline divider between hero and FREE START HERE removed** (Spec 09) — was `md:hidden h-px w-16`, read as visual artifact

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

## Tools Page — LOCKED ✅ (Apr 2026)

**Mobile audit T1-T4 shipped and live. Tools page is locked on mobile. Desktop unchanged and untouched.**

### ToolCard (mobile — scoped style)
- Padding: `14px 18px 14px` (compact, tighter than desktop)
- `min-height: auto` — **desktop min-height explicitly overridden on mobile**. Never inherit desktop calibration into mobile.
- Hover-row: `display: none` — phantom footer hover indicators dead on touch devices, hidden entirely
- Description: `13px / line-height 1.5` (was 14px / 1.72 on desktop — desktop calibration too loose for mobile column width)

### FamilyGroup (mobile)
- Eyebrow: `margin-bottom: 3` (12px), `padding-bottom: 0`
- Divider: `md-only` — **mobile has no divider between family groups**. Spacing is carried by the eyebrow + card gap, not by a horizontal rule.

### page.tsx (mobile structural changes)
- Hero: `padding-top: 100` — matches tools hero offset below nav
- Gap: `24` between family groups
- **SEO essay: `hidden md:block`** — essay is in DOM (Google reads it via mobile-first indexing of source HTML), but visually hidden on mobile. Keeps mobile page clean while preserving SEO value.
- FAQ: `margin-bottom: 12`

### Scoping rule (locked)
- All mobile ToolCard overrides are **scoped** — they do not bleed into desktop.
- Use media queries or mobile-specific class variants. **Never change desktop ToolCard to fix mobile.**

---

## Lab Landing Page — LOCKED ✅ (Apr 2026)

**Mobile audit completed in 3 rounds (R1-R3). Lab landing page (`/lab`) is locked on both breakpoints. Desktop was always good — mobile required structural rebuild.**

### Mobile Lab Landing — what shipped (R1 + R2 + R3)

#### LabSecondaryCard (mobile — scoped overrides)
- **Eyebrow:** Plain small-caps label (no pill chrome) — `font-size: 11px`, `letter-spacing: 0.18em`, `text-transform: uppercase`, color = category accent (teal/gold/violet from design-tokens)
- **No background, no border, no padding-as-pill** on mobile — just text. Saves ~20px vertical per card.
- **Title:** Reduced from desktop 20px to mobile size that fits long titles in 1-2 lines (Cormorant)
- **Excerpt:** `display: none` on mobile — dropped entirely (excerpts answer the curiosity gap and slow click-through; titles do the work)
- **Reading time ("X MIN READ"):** `display: none` on mobile — metadata, not hierarchy. Wrapper hidden too (lesson 15)
- **Padding:** `14px 18px 14px` (matches Tools ToolCard mobile)
- **`min-height: auto`** on mobile — overrides desktop calibration (lesson 19)

#### FeaturedLabCard (Editor's Pick — mobile scoped overrides)
- **One pill only:** "Editor's Pick" — category pill removed (lesson 17 — pill IS the hierarchy signal)
- **Excerpt:** Kept on mobile (Editor's Pick is editorial — its job is to persuade, not just scan)
- **Excerpt color:** `rgba(255,255,255,0.80)` — body text floor
- **Reading time:** `display: none` on mobile — consistent with secondary cards (R3 decision)
- **Padding:** `14px 18px 14px` mobile (matches secondary cards)
- **Desktop:** unchanged

#### Closing CTA section ("These ideas come to life in the tools.")
- **Mobile padding-top:** Reduced from desktop-calibrated value to ~48-64px — eliminated viewport-sized dead space between "BROWSE ALL ARTICLES →" and the closing eyebrow
- **Body text "Eight tools for breathing, focus, sleep, decisions, and AI-powered reflection."** — color `rgba(255,255,255,0.80)` body floor, `14px` minimum, `line-height: 1.5-1.6`
- **Stale copy fix (R1):** Was "Nine tools for breathing, focus, sleep, thought reframing, and AI-powered reflection." Thought Reframer removed Apr 2026. Now reads "Eight tools..." with "decisions" replacing "thought reframing" (covers Choose + Break It Down — reinforces paid-tier value prop)

#### Weekly Dispatch newsletter section
- **Body text "No noise. One piece of honest writing about how we think and feel — straight to your inbox."** — color `rgba(255,255,255,0.80)` body floor on mobile
- **Email input placeholder ("enter your email"):** `color: rgba(255,255,255,0.65)`, `font-size: 14px` — applied globally (mobile + desktop) — placeholder readability isn't viewport-specific

#### "BROWSE ALL ARTICLES →" link
- Mobile readability: `rgba(255,255,255,0.65)` minimum, 12px minimum
- Mobile spacing: tight to cards above (24-32px gap)

### Lab landing — what stayed unchanged
- Hero ("Understand yourself / a little better.") — mobile + desktop
- Newsletter form layout
- All desktop styling — entirely untouched (except global placeholder color and stale copy fix)

### Lab landing — design rationale (locked)
- Editor's Pick = editorial hero. Keeps excerpt + larger card. Job: persuade.
- Secondary cards = scan. No excerpt, no reading time on mobile. Job: title-driven click-through.
- Curiosity gap principle: titles unanswered = clicks. Excerpts that answer = bounces.
- Pattern matches NYT, Atlantic, Stratechery on mobile — listings are denser than feature pages.

---

## Lab Archive Page — LOCKED ✅ (Apr 2026)

**Mobile audit shipped. Lab archive page (`/lab/archive`) is locked on both breakpoints. Desktop was perfect — only mobile changed.**

### ArchiveCard (mobile — scoped overrides, more compact than Lab landing secondary)
- **Eyebrow:** Plain small-caps label (no pill chrome) — same as Lab landing pattern
- **`margin-bottom: 8px`** below eyebrow (tighter than Lab landing's 12px — Archive is denser)
- **Reading time ("X MIN READ"):** `display: none` on mobile (consistent with Lab landing)
- **Title:** Mobile-specific font-size to fit all titles in max 2 lines (smaller than Lab landing if needed)
- **Padding:** `12px 16px 12px` (tighter than Lab landing's `14px 18px 14px`)
- **`min-height: auto`** on mobile (lesson 19)
- **Border-radius:** `14px` mobile (slightly tighter than landing)
- **Card gap:** `12px` between cards mobile (down from desktop 16-24px)

### Hero, filter pills, "← LAB" back link
- All unchanged — looked good in audit, no changes needed
- Filter pills (`All / Calm your state / Think clearly / Notice what's good`) intentionally KEEP their pill chrome — they're interactive controls, not passive metadata. Different visual treatment from card category labels is correct (lesson 24).

### Archive — design rationale (locked)
**Archive is reference, not browse.** Different job-to-be-done from Lab landing:
- **Landing:** Editorial discovery. Hero + curated 6 secondaries. "Show me what's interesting."
- **Archive:** Index. All 15 articles. "Scan, filter, find, click."

Therefore archive cards are MORE compact than landing cards even though they share the design system. Visual hierarchy via:
- Smaller cards = more visible per scroll = faster scanning (target: 3-4 cards per mobile viewport)
- Same colour system (Calm/Clarity/Decide) = users can colour-scan if they remember a category
- Plain labels (no pill chrome) = cleaner, more list-like, less marketing-card feel

This pattern matches editorial archive UIs (NYT archive, Atlantic archive) — listings are denser than feature pages, and within listings, archives are denser than landings.

### Density target (achieved)
- ~3-4 cards visible per mobile viewport (up from ~1.2 pre-fix)
- ~5 swipes to scan all 15 articles (down from ~13 pre-fix)

---

## Process Lessons

### From prior mobile audit (retained)
1–10: [all prior lessons retained — see previous version]

### Lessons from desktop homepage audit (Apr 2026)

#### 11. When widening a parent container, audit constrained children too
When changing a grid cell width or container width, check if child components have their own internal `maxWidth` values that won't grow automatically. FeaturedLabCard had `maxWidth: 520px` on title and `440px` on excerpt — widening the grid cell to 632px had zero effect on those internal constraints. Always trace: container → grid cell → component → content widths.

#### 12. Inline `style={{ display: "..." }}` beats CSS class rules — check before writing CSS
If a JSX element has `style={{ display: "block" }}`, any CSS class rule setting `display: flex` will lose without `!important`. Before writing layout CSS, check the element's inline style for any property you're trying to override. Either remove the inline value or fight it with `!important` (use sparingly — creates maintenance debt).

#### 13. On fixed-nav pages, hero `pt` must be computed as `nav-height + intended-air`
Solace nav = 80px fixed. To give the headline 120px of visual air below the nav, set `md:pt-[200px]` (= 80 + 120), NOT `md:pt-[120px]`. Always compute from nav-bottom, not viewport-top.

#### 14. Equal columns beat clever asymmetric layouts when content is similar
The 1+2 magazine layout (hero col-span-2, 2 secondaries stacked) required 7 specs to debug because the hero card kept having height mismatches, fill problems, and alignment issues. The final decision (3 equal columns) resolved all of them in one spec. When in doubt: equal columns. Reserve asymmetric layouts for when content genuinely has different hierarchy needs.

#### 15. Don't hide elements — hide their wrapper too
Hiding a pill with `display: none` but leaving its wrapper div with `marginBottom: 24px` creates a visible empty gap. Always hide the wrapper, not just the content inside it.

#### 16. `backdrop-filter: blur()` causes bleed-through on gradient backgrounds
Any page with complex background gradients (like the homepage radial system) will show a visible smudge where a blurred element overlaps. The blur samples and amplifies the gradient colours. Solution: remove backdrop blur from elements that sit over gradient backgrounds.

#### 17. The pill IS the hierarchy signal — don't use size to signal importance
Multiple specs tried to make the Editor's Pick card larger than secondary cards to signal "this is important." Every attempt created alignment and fill problems. The correct solution: equal card size, "Editor's pick" pill is the sole differentiator. Lesson: hierarchy in UI = labels + colour + typographic weight, not physical size of containers.

### Lessons from Tools Page mobile audit (Apr 2026)

#### 18. Phantom hover footers are dead on mobile — `display: none` them
Hover-row indicators ("tap to open", trailing arrows, footer chrome visible on desktop hover) serve zero purpose on touch devices. They take vertical space for no affordance. Always set `display: none` on mobile rather than trying to "soften" or "fade" them. Dead pixels = dead, not dim.

#### 19. `min-height` calibrated for desktop is wrong for mobile — override to `auto`
A card `min-height` that looks balanced at desktop column widths (300px+) creates empty vertical air at mobile widths (343px). Never inherit desktop `min-height` into mobile. Either scope the value per breakpoint or explicitly set `min-height: auto` on mobile.

#### 20. Desktop font sizes don't translate — recalibrate for mobile column width
Body `14px / line-height 1.72` reads fine in a 320px-wide desktop card. In a 311px mobile card with 36px horizontal padding taken out, that same spec reads loose and wastes 2-3 lines of vertical space. Drop to `13px / 1.5` for mobile. Typography calibrations are not breakpoint-agnostic.

#### 21. SEO essays: `hidden md:block` keeps DOM, hides visual
When a page needs an SEO essay (long-tail keywords, tool context) but the essay clutters mobile UX, `hidden md:block` is the correct pattern. Google's mobile-first indexer reads the source HTML, not the rendered viewport — the essay is indexed regardless of visibility. Mobile users get a clean page, Google gets the content. Never `remove` SEO content to improve mobile UX.

### Lessons from Lab landing + Lab archive mobile audits (Apr 2026)

#### 22. Card density follows job-to-be-done, not design-system uniformity
Lab landing secondary cards and Lab archive cards share the same content model (article preview), the same colour system, and live on related pages. But they have different jobs: landing = editorial discovery, archive = index/scan. Density should follow job, not design-system consistency. Archive cards are MORE compact than landing cards on purpose. Never enforce visual uniformity at the cost of usability — the design system serves the job, not the other way around.

#### 23. Editorial cards keep their excerpt; scan cards drop it
Excerpt copy on a card answers the curiosity gap that the title creates. On editorial/hero cards (Editor's Pick) where the job is persuasion, the excerpt earns its space. On scan cards (secondary cards on a listing, archive cards) where the job is title-driven click-through, the excerpt slows the user and reduces clicks. The unanswered question drives the click. Drop excerpts on scan-mode cards; keep them on persuade-mode cards.

#### 24. Filled pills = interactive control. Plain labels = passive metadata.
The Lab archive filter pills (`All / Calm your state / Think clearly / Notice what's good`) keep their filled pill shape because they're tappable controls — the pill shape signals "I am a toggle." The card category labels (`CALM YOUR STATE` on a card) drop the pill chrome on mobile because they're passive metadata, not interactive. Same visual element, different jobs, different correct treatment. Don't enforce visual consistency between elements that have different interaction roles.

#### 25. Diagnose before you fix — open DevTools when a CSS issue is mysterious
The "dead space between BROWSE ALL ARTICLES and the closing CTA" issue persisted across two rounds of fixing because the spec said "find the culprit" without forcing actual diagnostic inspection. When a layout issue isn't responding to fixes, the spec must require Claude Code to open DevTools, inspect the element tree, identify the actual offending property/value, and only then write the override. Saves rounds of guessing. The diagnostic step is not optional.

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
- [x] **Tools page mobile audit** — ✅ COMPLETE Apr 2026
- [x] **Lab landing mobile audit** — ✅ COMPLETE Apr 2026 (R1+R2+R3)
- [x] **Lab archive mobile audit** — ✅ COMPLETE Apr 2026
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
| Tools (mobile) | ✅ LOCKED Apr 2026 |
| Tools (desktop) | ✅ |
| Lab landing (mobile) | ✅ LOCKED Apr 2026 |
| Lab landing (desktop) | ✅ LOCKED Apr 2026 |
| Lab archive (mobile) | ✅ LOCKED Apr 2026 |
| Lab archive (desktop) | ✅ LOCKED Apr 2026 |
| Pricing | ✅ A$9/A$79 |
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

### Components
- `components/home/LabSecondaryCard.tsx` — secondary Lab card for homepage. Per-instance scoped hover classes. Mobile-scoped overrides documented in Lab Landing section.
- `components/home/FeaturedLabCard.tsx` — Editor's Pick card for homepage. Mobile-scoped overrides documented in Lab Landing section.
- Lab archive card component — mobile-scoped overrides documented in Lab Archive section.

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
- **Mobile `min-height` must override desktop — never inherit** (lesson 19)
- **SEO essays use `hidden md:block` — never remove DOM content to clean mobile UX** (lesson 21)
- **Card density follows job-to-be-done, not design-system uniformity** (lesson 22) — archive cards are denser than landing cards by design
- **Editorial cards keep excerpts; scan cards drop them** (lesson 23) — Editor's Pick keeps excerpt, secondary/archive cards don't
- **Filled pills = interactive controls. Plain labels = passive metadata.** (lesson 24) — never enforce visual uniformity between elements with different interaction roles
- **Diagnose before fixing — open DevTools when a layout issue is mysterious** (lesson 25) — diagnostic step is not optional

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