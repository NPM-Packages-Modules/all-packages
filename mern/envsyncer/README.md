# envsyncer

Synchronize and validate environment variables across services.

## Features

- schema validation
- missing key detection
- environment diffing
- secret masking
- config versioning

## Example

```ts
import { envsyncer } from "@mr-aftab-ahmad-khan/envsyncer";

envsyncer.validate();
```

## Why

Environment mismatches cause massive deployment failures.

## License

MIT
