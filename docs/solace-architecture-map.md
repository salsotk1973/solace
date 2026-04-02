# Solace Architecture Map

## Purpose

This document defines the **canonical structure of Solace**.

All development (human or AI) must follow this map.

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

* `components/solace/*`
* `/api/reflect`
* `lib/modules/*`
* `lib/tools.ts`

👉 These may be removed later but require confirmation.

---

## 4. Unclear / Needs Verification

* `lib/engine/*`
* `components/ui/*`
* `components/background/*`
* `components/anchors/*`
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
* Prefer reuse over duplication
* Keep layout consistency across pages
* Maintain a single source of truth per system

---

## 7. Future Direction

* All tools should converge into the canonical `/tools/*` system
* Legacy systems will be removed progressively
* Architecture must remain simple, consistent, and scalable

---

## Final Rule

If unsure:

👉 Follow the **Active Architecture**

Never guess.
