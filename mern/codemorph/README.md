# codemorph

**Topics:** `cli` · `codemorph` · `dedupe` · `mern-packages` · `merndev` · `nodejs` · `npm-pm` · `observability` · `refactor` · `static-analysis` · `typescript`

**AI-adjacent refactor assistant CLI** — first-line defense against copy-paste rot: **`analyze`** walks your tree, normalizes whitespace, and reports files with identical text hashes so you can merge or extract shared modules deliberately.

## Install

```bash
npm install -g codemorph
# or
npx codemorph analyze ./src
```

## Library

```typescript
import { findDuplicateSources } from "codemorph";

const groups = await findDuplicateSources(process.cwd());
```

## License

MIT
