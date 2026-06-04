# schemashiftkit

**Topics:** `cli` · `mern-packages` · `merndev` · `migration` · `mobile` · `mongodb` · `nodejs` · `npm-pm` · `observability` · `react` · `react-native` · `schema` · `schemashiftkit` · `typescript`

**React Native** library.

Automatically generate MongoDB schema migrations.

## Features

- migration generation
- rollback support
- schema diffing
- validation repair
- version history
- migration tracking

## Example

```ts
import { schemashiftkit } from "schemashiftkit";

await schemashiftkit.generate();
```

## Why it matters

Mongo migrations are still mostly unmanaged manually.

## License

MIT
