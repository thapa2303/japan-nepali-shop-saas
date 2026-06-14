---
name: ShopSaaS service ports
description: Which port each service runs on and why
---

- API Server: PORT=8080 (configured in workflow command)
- ShopSaaS Web (Next.js): PORT=3001 (3000 was already occupied)

Workflow names: "API Server" and "ShopSaaS Web"
Dev domain: check REPLIT_DEV_DOMAIN env var at runtime.

**Why:** Port 3000 conflicted with another process; switched to 3001 in configureWorkflow.
**How to apply:** If adding another service, use 3002 or another unused port from the supported list.
