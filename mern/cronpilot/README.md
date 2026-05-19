# cronpilot

Manage distributed cron jobs safely.

## Features

- duplicate prevention
- retry scheduling
- cron dashboards
- worker balancing
- execution history

## Example

```ts
import { cronpilot } from "@mr-aftab-ahmad-khan/cronpilot";

cronpilot.schedule("0 * * * *", task);
```

## Why

Cron jobs become unreliable in scaled systems.

## License

MIT
