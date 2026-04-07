# Current Solace State

Read this file before making changes.

## Active Project

- Active repo: `solace-clean`
- Archive repo: `solace-engine-archive`
- `solace-engine-archive` is read-only unless explicitly requested.
- Do not touch old archive or recovered folders during normal work.

## Local Development

- Local dev command: `npm run dev`
- `npm run dev` must resolve to `next dev -p 3001 --webpack`
- `.env.local` is required locally and must not be committed.

## Homepage

- The homepage background is currently accepted.
- Do not rework the homepage background unless explicitly requested.
- No page transition system is active.
- The homepage remains server-first.
- Keep the homepage lab teaser on static featured article metadata; do not reintroduce homepage render-time lab content aggregation.

## Auth And Shell

- Do not add a global `ClerkProvider` to `app/layout.tsx`.
- Do not add Clerk hooks or Clerk client imports to `SiteHeader.tsx`.
- Local-development auth fallback lives in `lib/auth.ts`.
- Keep Clerk scoped locally only where needed.

## Workflow Rules

- Use full file replacements only.
- Work one step at a time.
- Do not touch unrelated files or routes.
- Preserve current route stability and visual state unless the user explicitly asks to change it.
