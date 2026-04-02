# AGENTS.md — Solace Operating Rules

## Source of Truth

The canonical architecture is defined in:

* `docs/solace-architecture-map.md`

All agents MUST follow it.

If there is any conflict between instructions and actual code:
→ trust the architecture map and current usage.

---

## Purpose

This file defines how AI agents (Codex, ChatGPT, Claude) must work inside the Solace repository.

These rules are mandatory.

---

## 1. Session Start Rule

Before making changes:

* Understand current repo state
* Confirm work is on active architecture
* Avoid assumptions from previous chats

---

## 2. Architecture Rule

* Follow `docs/solace-architecture-map.md`
* Build ONLY on active systems
* NEVER extend legacy systems
* NEVER revive unused components
* NEVER create new patterns when an existing one exists

---

## 3. Editing Rules

* One focused change at a time
* Full file replacement when editing
* Do not refactor unrelated files
* Do not move or rename files unless explicitly requested

---

## 4. Layout Consistency

* Preserve layout structure across pages
* Avoid UI “jumping” between tools
* Keep header, footer, and interaction areas consistent

---

## 5. Safety System

* Do not remove or bypass safety logic
* Reuse existing safety modules:

  * `lib/solace/safety/*`

---

## 6. API Rules

* Use `/api/solace/*` for new AI endpoints
* Avoid creating parallel API structures
* Reuse existing client patterns where possible

---

## 7. Verification Rule

After changes:

* Check for errors
* Confirm file integrity
* Avoid introducing unrelated issues

---

## 8. No Assumptions Rule

* Do not assume unused files are safe to delete
* Do not assume architecture intent
* Always follow defined structure
* If unsure, inspect usage first
* Do not guess

---

## 9. Collaboration Rule (CRITICAL)

Solace may be worked on by multiple AI systems.

Therefore:

* Do not introduce new patterns without justification
* Do not duplicate systems
* Respect existing architecture decisions
* Prioritize consistency over novelty

---

## 10. Animation Rule (GSAP / Motion)

When adding animations (including GSAP):

* Animations must NOT break layout structure
* Animations must remain subtle, calm, and premium
* No excessive motion, jitter, or competing focal points
* Avoid animation-driven layout shifts
* Performance must remain smooth (no frame drops)
* Prefer enhancing existing UI, not replacing structure

If unsure:
→ reduce motion, not increase it

---

## 11. Golden Rule

If unsure:

👉 Do less, not more
👉 Stay inside the system
👉 Keep Solace clean
