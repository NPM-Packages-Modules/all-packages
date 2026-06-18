# merge-safex

**Topics:** git · merge · ci · mern-packages · merndev · nodejs · npm-pm · typescript

**Predict merge conflicts** before PR merge — surface files and services likely to collide.

## Install

```bash
npm install merge-safex
```

## API

```typescript
import { mergeSafe } from "merge-safex";

mergeSafe.analyze(["src/InvoiceService.ts"]);
```

## License

MIT
