---
name: Drizzle array inserts with readonly tuples
description: Drizzle pg array columns reject readonly tuple types — must spread to mutable array before inserting.
---

## Rule
When seeding or inserting rows that have pgEnum array columns (e.g. `features shopFeatureEnum("features").array()`), you must convert any `readonly` array or const-asserted tuple to a mutable array before passing it to `.values()`.

**Why:** TypeScript infers `as const` arrays as `readonly ["a","b"]` which is not assignable to `("a"|"b")[]` (mutable). Drizzle's generated insert type expects a mutable array.

**How to apply:** Spread the value:
```ts
features: [...s.features],   // ✅ mutable copy
features: s.features,         // ❌ TS error if inferred as readonly
```

This applies to any Drizzle array column, not just pgEnum arrays.
