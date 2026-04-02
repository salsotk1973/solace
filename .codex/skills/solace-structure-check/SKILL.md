---
name: solace-structure-check
description: Analyse Solace repository structure, detect duplication, drift, and inconsistencies without modifying any files.
---

# Solace Structure Check

## Primary goal

Understand how the Solace project is currently structured and detect:

- duplication
- architectural drift
- inconsistencies
- legacy patterns

This is a **read-only diagnostic skill**.

## IMPORTANT RULE

- DO NOT modify any file
- DO NOT create any file
- DO NOT refactor anything
- ONLY inspect and report

---

## When to use

Use this skill when:

- returning to the project after changes
- before making structural decisions
- when the architecture feels unclear
- before creating new tools or pages
- when the repo has grown significantly

---

## What to analyse

### 1. Layout / Shell system

- Identify all header implementations
- Identify all footer implementations
- Identify shared layout wrappers (e.g. ToolShell, Container, etc.)
- Detect duplicates or competing patterns

---

### 2. Tool architecture

Compare:

- `/app/tools/*`
- standalone tool-like pages (e.g. `/app/mood`, `/app/focus`, etc.)

Check:

- Are they using the same layout system?
- Are they using the same component structure?
- Are they consistent in UX pattern?

---

### 3. API structure

- List all API routes
- Group by purpose
- Check naming consistency
- Detect overlap or fragmentation

---

### 4. Component organisation

- Identify shared vs feature-specific components
- Detect duplicated components with similar purpose
- Detect unclear boundaries between folders

---

### 5. Lib / core logic

- Identify safety system usage
- Identify routing logic
- Identify duplicated logic patterns
- Check whether modules follow a consistent structure

---

### 6. Visual / asset system

- Check realms (amber, azure, emerald)
- Check hero / background systems
- Detect unused or duplicated assets if obvious

---

### 7. Naming consistency

- Compare naming patterns across:
  - pages
  - components
  - API routes
  - lib files

---

## Output format

## Solace Structure Report

### 1. Overall structure assessment
- short summary of current architecture maturity

---

### 2. Layout / shell findings
- what exists
- duplicates
- risks

---

### 3. Tool system findings
- consistency between tools
- differences between `/tools/*` and standalone pages

---

### 4. API structure findings
- grouping
- inconsistencies

---

### 5. Component structure findings
- duplication
- unclear ownership

---

### 6. Lib / core system findings
- safety system usage
- logic consistency

---

### 7. Visual system findings
- asset structure
- realm consistency

---

### 8. Key risks
- list top 3–5 structural risks only

---

### 9. Recommended next step
- ONLY ONE clear action
- must be high impact and low risk

---

## Reporting rules

- Be factual
- Do not guess
- Do not exaggerate problems
- Focus only on meaningful structural insights
- Keep it concise but sharp

---

## Reminder

This is a diagnostic tool.

It does not fix anything.
It helps the user decide what to fix.