# modulifyx

**Topics:** `express` · `mern-packages` · `merndev` · `modules` · `modulifyx` · `nodejs` · `npm-pm` · `observability` · `router` · `structure` · `typescript`

**Automatic Express modularizer** — load feature routers from disk with a predictable naming convention so services, controllers, and routes stay grouped as the codebase grows.

## Install

```bash
npm install modulifyx express
```

## Convention

Drop compiled route files such as `users.router.js` (or `posts.router.cjs`) into a directory. Each file should export an Express `Router`:

```js
// dist/routes/users.router.js
import { Router } from "express";
const r = Router();
r.get("/", (_req, res) => res.json([]));
export default r;
```

## Usage

```typescript
import express from "express";
import { modulifyx } from "modulifyx";
import path from "node:path";

const app = express();
const routesDir = path.join(process.cwd(), "dist", "routes");
await modulifyx(app, routesDir);
app.listen(3000);
```

## License

MIT
