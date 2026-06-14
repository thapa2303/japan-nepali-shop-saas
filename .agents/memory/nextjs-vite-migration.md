---
name: Next.js to Vite migration patterns
description: Pitfalls and fixes when porting a Next.js app to a react-vite artifact in this pnpm monorepo
---

# Next.js → Vite Migration Pitfalls

## Metadata export removal
Next.js pages have `export const metadata = { title: "...", description: "..." }`. When removing this via sed/bulk replace, the sed removes the `export const metadata =` line but leaves the object body (`  title: "..."`, `  description: "..."`, `}`). 

**Fix**: Must also remove property lines AND the orphan closing `}`. Use sed `1,15{/^  title: /d; /^  description: /d}` then `1,15{/^}$/d}` — but be careful not to remove legitimate closing braces from the function body.

**Why this is tricky**: The closing `}` at the end of a function looks identical to the orphan metadata `}`. Removing `}` in lines 1–15 works for most files but can remove the real function close if the page is short (< 15 lines).

## `<Image priority>` → `<img>`
Next.js `<Image priority />` becomes `<img priority={true} />` after bulk replace — `priority` is not a valid HTML attribute. Remove it entirely; `<img>` loads eagerly by default anyway. Also add `w-full h-full` to fill-mode images that previously used Next.js Image's `fill` prop.

**How to apply**: After any Next.js Image → img bulk replace, grep for `priority` on `<img>` tags and remove the prop.

## Interface declarations missing closing brace
If a Next.js page had a type like:
```ts
interface PageProps {
  params: Promise<{ slug: string }>
}
```
And you transform `params: Promise<...>` to `params: { slug: string }`, then later bulk-remove `export const metadata`, the regex can accidentally delete the interface closing `}` too.

**Fix**: Scan all `.tsx` files for interfaces where the line after the property is `export default` (missing `}`). Add the closing brace back.

## Short pages lose their final `}`
Pages like `export default function Foo() { return <Bar /> }` are 5 lines. A sed pass targeting "orphan `}` in first 15 lines" will remove their real closing brace.

**Fix**: After all sed passes, run: `find src/pages -name "*.tsx" | while read f; do last=$(tail -1 "$f"); [ "$last" != "}" ] && echo "MISSING: $f"; done`
