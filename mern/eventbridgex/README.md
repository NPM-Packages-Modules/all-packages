# eventbridgex

Unified event communication layer for MERN services.

## Features

- pub/sub
- event retries
- event schemas
- consumer groups
- dead event handling

## Example

```ts
import { eventbridgex } from "@mr-aftab-ahmad-khan/eventbridgex";

eventbridgex.emit("order.created");
```

## Why

Event-driven systems become chaotic without structure.

## License

MIT
