# stack-syncx

**Topics:** contract · api · drift · express · mern-packages · merndev · nodejs · npm-pm · typescript

**Detect breaking changes** between frontend and backend when routes change.

## Install

```bash
npm install stack-syncx
```

## Example

```bash
npx stack-sync check
```

## API

```typescript
import { stackSync } from "stack-syncx";

const report = stackSync.check({ client: ["/users"], server: ["/posts"] });
```

## License

MIT
