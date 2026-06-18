# env-diff

**Topics:** env · config · devops · mern-packages · merndev · nodejs · npm-pm · typescript

**Compare environments** — see missing secrets and config drift between local, staging, and prod.

## Install

```bash
npm install env-diff
```

## API

```typescript
import { envDiff } from "env-diff";

envDiff.compare({ local: ["PORT"], staging: [] });
```

## License

MIT
