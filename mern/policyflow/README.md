# policyflowx

**Topics:** `authorization` · `express` · `mern-packages` · `merndev` · `nodejs` · `npm-pm` · `observability` · `permissions` · `policyflowx` · `rbac` · `roles` · `typescript`

**Auto permission generator** — lightweight RBAC-style policies with **role inheritance**, **`allow` lists**, and Express **route guards** so `403` handling stays consistent.

## Install

```bash
npm install policyflowx express
```

## Example

```typescript
import express from "express";
import { policyflowx } from "policyflowx";

const policies = policyflowx()
  .inherits("org-admin", "member")
  .inherits("member", "guest")
  .allowAction("guest", "billing.read")
  .allowAction("member", "billing.write")
  .allowAction("org-admin", "*");

const app = express();
const role = (req: express.Request) => (req as { user?: { role?: string } }).user?.role;

app.get("/billing", policies.require(role, "billing.read"), (_req, res) => res.send("ok"));
```

## License

MIT
