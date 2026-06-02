# eventmeshx

**Topics:** `eventmeshx` · `events` · `mern-packages` · `merndev` · `microservices` · `nodejs` · `npm-pm` · `observability` · `pubsub` · `typescript`

**eventmeshx** wraps Node’s **`EventEmitter`** with **typed publish/subscribe** helpers for MERN services that are not ready for Redis yet.

```ts
import { eventmeshx } from "eventmeshx";

const bus = eventmeshx();
bus.subscribe("order.paid", (id: string) => {});
bus.publish("order.paid", "ord_123");
```

MIT © Aftab Ahmad Khan
