# envsyncerx

**Topics:** `config` · `env` · `envsyncerx` · `mern-packages` · `merndev` · `mobile` · `nodejs` · `npm-pm` · `observability` · `react` · `react-native` · `typescript` · `validation`

**React Native** library.

Synchronize and validate environment variables across services.

## Features

- schema validation
- missing variable detection
- environment diffing
- config versioning
- secret masking
- deployment validation

## Example

```ts
import { envsyncerx } from "envsyncerx";

envsyncerx.validate();
```

## Why it matters

Environment mismatches are a major production failure source.

## License

MIT
