# merge-safe

**Topics:** git · merge · ci · mern-packages · merndev · nodejs · npm-pm · typescript

**Predict merge conflicts** before PR merge — surface files and services likely to collide.

## Install

```bash
npm install merge-safe
```

## API

```typescript
import { mergeSafe } from "merge-safe";

mergeSafe.analyze(["src/InvoiceService.ts"]);
```

## License

MIT
