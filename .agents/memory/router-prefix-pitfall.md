---
name: Express router prefix pitfall
description: Sub-routers mounted at a prefix must not repeat that prefix inside their route definitions.
---

When mounting a sub-router with a prefix in Express:
```ts
router.use("/console", authenticate, authorize("PSA"), consoleRouter);
```

The routes INSIDE `consoleRouter` must use paths WITHOUT the `/console/` prefix:
```ts
// CORRECT — resolves to /api/console/analytics
router.get("/analytics", ...)

// WRONG — resolves to /api/console/console/analytics (404)
router.get("/console/analytics", ...)
```

**Why:** Express strips the mount prefix before passing the request to the sub-router.

**How to apply:** When writing or reviewing sub-router files (console.ts, dashboard.ts, tenant-admin.ts), always check that the internal route paths don't repeat the prefix used in index.ts's `router.use(...)` call.

**Known mounts in this project:**
- `/dashboard` → `dashboard.ts` (routes use `/shop`, `/products`, `/orders`, `/analytics`)
- `/console` → `console.ts` (routes use `/tenants`, `/analytics`, `/customers`)
- `/tenant-admin` → `tenant-admin.ts` (routes use `/customers`, `/overview`)
