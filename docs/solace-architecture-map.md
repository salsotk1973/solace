# Solace Architecture Map

## Purpose

This document defines the **canonical structure of Solace**.

All development (human or AI) must follow this map.

---

## Current Baseline (April 2026)

* `_archived/` is isolated and must not be re-imported into active app code.
* TypeScript excludes archived code via `tsconfig.json` (`"exclude": ["node_modules", "_archived"]`).
* ESLint ignores archived code via `eslint.config.mjs` (`globalIgnores(["_archived/**", ...])`).
* CI is currently passing.
* Playwright CI injects required secrets in `.github/workflows/playwright.yml`:

  * `NEXT_PUBLIC_SUPABASE_URL`
  * `SUPABASE_SERVICE_ROLE_KEY`
  * `OPENAI_API_KEY`
* CI-safe Clerk fallback is active (missing Clerk env must not block rendering in CI).
* Current lint baseline: **0 errors / 11 warnings**.
* Pre-animation cleanup is complete.
* Next approved focus: **Home page + Hero**.

---

## 1. Active Architecture (DO NOT DEVIATE)

### Core App Structure

* Next.js App Router (`/app`)
* Global layout: `app/layout.tsx`
* Header/Footer:

  * `components/SiteHeader.tsx`
  * `components/SiteFooter.tsx`

---

### Core Tool System (CANONICAL)

Primary tools live in:

* `/app/tools/choose`
* `/app/tools/clear-your-mind`
* `/app/tools/break-it-down`

These use:

* `lib/solace/*` (core logic, safety, routing)
* `/api/solace/*` (AI endpoints)

👉 This is the **ONLY system to build new tools on**

---

### Feature Tools (CURRENTLY ACTIVE)

Standalone pages:

* `/mood`
* `/focus`
* `/sleep`
* `/breathing`
* `/gratitude`
* `/reframe`

These are active but must progressively align with the canonical tool system.

---

### Core Logic

Primary logic lives in:

* `lib/solace/*` → canonical system
* `lib/supabase/*` → data layer
* `lib/auth.ts`

---

## 2. Legacy Systems (DO NOT BUILD ON)

These exist but are not part of the future system:

* `app/tools/[slugdisabled]/page.tsx`
* `components/tool-interface/*`
* `lib/tools/tool-registry.ts`
* `lib/thread/*`

👉 These must not be used for new features.

---

## 3. Deprecated Candidates (REVIEW BEFORE REMOVAL)

These paths have been isolated under `_archived/` and must stay isolated from active imports:

* `_archived/components/solace/*`
* `_archived/components/anchors/*`
* `_archived/components/background/*`
* `_archived/components/discovery/*`
* `_archived/components/ToolShell.tsx`
* `_archived/components/SiteHeaderShell`
* `_archived/components/GlobalHeader.tsx`
* `_archived/components/Container.tsx`
* `_archived/lib/modules/*`
* `_archived/lib/solace-content/tools.ts`
* `_archived/lib/solace/break-it-down/ai.ts`
* `_archived/lib/solace/openai.ts`
* `_archived/lib/supabase/client.ts`
* `_archived/lib/tools.ts`
* `_archived/lib/tools/tool-discovery.ts`
* `_archived/lib/thread/thread-helpers.ts`
* `_archived/lib/thread/thread-reducer.ts`

👉 Review before any removal, but do not re-activate.

---

## 4. Unclear / Needs Verification

* `lib/engine/*`
* `components/ui/*`
* `/app/scope`

👉 Do not modify or delete until verified.

---

## 5. API Rules

Canonical API pattern:

* `/api/solace/*` → AI tool endpoints

Avoid creating new endpoints outside this structure.

---

## 6. Architecture Rules (MANDATORY)

* Build ONLY on active architecture
* Do NOT extend legacy systems
* Do NOT import from `_archived/*`
* Prefer reuse over duplication
* Keep layout consistency across pages
* Maintain a single source of truth per system

---

## 7. Future Direction

* All tools should converge into the canonical `/tools/*` system
* Legacy systems will be removed progressively
* Architecture must remain simple, consistent, and scalable
* Near-term implementation focus is Home page + Hero improvements

---

## Final Rule

If unsure:

👉 Follow the **Active Architecture**

Never guess.
