# cachepilot

Automatically cache API/database responses intelligently.

## Features

- Redis memory sync
- stale refresh
- route-level caching
- auto invalidation
- query fingerprinting

## Example

```ts
import { cachepilot } from "@mr-aftab-ahmad-khan/cachepilot";

cachepilot.wrap(getProducts);
```

## Why

Developers repeatedly rebuild caching layers manually.

## License

MIT
