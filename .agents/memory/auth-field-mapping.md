---
name: Auth field mapping
description: Frontend v0 auth shape vs backend API shape — bridge lives in auth-context.tsx
---

Frontend RegisterInput: { name, email, password, role, shop? }
Backend RegisterBody:   { email, password, displayName, tenantName, tenantSlug }

Mapping applied in auth-context.tsx register():
- name → displayName
- shop.name (or name) → tenantName
- slugify(shop.name or email prefix) + random suffix → tenantSlug

Backend response: { user: { id, email, displayName, tenantId, roles[] }, token }
Frontend AuthUser: { id, name, email, role (singular), avatar? }

toAuthUser() in auth-context.tsx does the conversion:
- displayName → name
- roles[] → single role: PLATFORM_SUPER_ADMIN → "admin", TENANT_ADMIN/MERCHANT → "merchant", else → "customer"

**Why:** v0 generated frontend with simplified types; backend uses multi-role JWT system.
**How to apply:** Any future auth-related changes must go through toAuthUser() and the register mapper. Do not change the backend schema to match the frontend — keep the bridge in auth-context.tsx.
