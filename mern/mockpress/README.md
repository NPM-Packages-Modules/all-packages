# mockpressx

**Topics:** `api` · `express` · `mern-packages` · `merndev` · `mock` · `mockpressx` · `nodejs` · `npm-pm` · `observability` · `testing` · `typescript`

**mockpressx** builds a **parallel Express app** from an existing app’s top-level route table (via `routecheckx`) and serves **mock JSON** with optional **latency** and **random fault** injection.

## Usage

```ts
import express from "express";
import { mockpressx } from "mockpressx";

const app = express();
app.get("/api/users", (_req, res) => res.json([]));

const mock = mockpressx(app, { latencyMs: 50, errorRate: 0.01 });
mock.listen(4000);
```

MIT © Aftab Ahmad Khan
