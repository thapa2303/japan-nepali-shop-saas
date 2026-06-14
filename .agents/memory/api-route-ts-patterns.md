---
name: API route TypeScript patterns
description: Common TypeScript gotchas in Express routes using Drizzle ORM.
---

# API Route TypeScript Patterns

## Express req.params typing
Express types `req.params` values as `string | string[]`, which breaks Drizzle `eq()` calls.
**Fix:** Always cast: `const id = String(req.params.id);`

## Implicit any[] for accumulated arrays
```ts
// BAD — TS infers any[]
const results = [];

// GOOD — explicitly type the accumulator
const results: Array<{ id: string; name: string; ... }> = [];
```

## sql<T> template tag requires import
If using `sql<number>\`count(*)\`` in a query, ensure `sql` is imported from `@workspace/db`.

## Next.js app package
The root Next.js app has no pnpm filter name — run `tsc --noEmit` from workspace root directly:
`pnpm exec tsc --noEmit`
(The `esbuild.config.ts` top-level-await error in api-server is pre-existing and benign — api-server runs via `tsx`, not esbuild.)

**Why:** These patterns recur across all route files; fixing them here documents the canonical approach.
