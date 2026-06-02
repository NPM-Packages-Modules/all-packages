# backendforge

**Topics:** `backend` · `backendforge` · `cli` · `express` · `generator` · `mern-packages` · `merndev` · `nodejs` · `npm-pm` · `observability` · `scaffold` · `typescript`

**Backend automation CLI** — generate opinionated **Express module** folders (`router` + `service` stubs) so new resources stay uniform.

## Install

```bash
npm install -g backendforge
# or
npx backendforge create module invoices
```

## Usage

```bash
backendforge create module users
# → src/modules/users/users.router.ts
# → src/modules/users/users.service.ts
```

Pair with **modulify** to mount `*.router.js` files after compilation.

## API

```typescript
import { scaffoldModule } from "backendforge";

await scaffoldModule("posts", process.cwd());
```

## License

MIT
