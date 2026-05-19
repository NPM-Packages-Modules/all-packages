# retryflow

Smart retry orchestration for failed operations.

## Features

- exponential retries
- dead letter queues
- timeout handling
- retry analytics
- circuit breaking

## Example

```ts
import { retryflow } from "@mr-aftab-ahmad-khan/retryflow";

retryflow.wrap(sendEmail);
```

## Why

Retry logic is duplicated everywhere and often broken.

## License

MIT
