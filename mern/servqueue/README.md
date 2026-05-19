# servqueue

Lightweight queue orchestration for MERN microservices.

## Features

- delayed jobs
- retries
- queue priorities
- workers
- distributed processing

## Example

```ts
import { servqueue } from "@mr-aftab-ahmad-khan/servqueue";

servqueue.add("email", payload);
```

## Why

Queue systems are usually over-engineered or fragmented.

## License

MIT
