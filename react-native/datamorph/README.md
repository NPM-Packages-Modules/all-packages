# datamorphx

**Topics:** `api` · `datamorphx` · `mapping` · `mern-packages` · `merndev` · `mobile` · `nodejs` · `npm-pm` · `observability` · `react` · `react-native` · `sanitization` · `transform` · `typescript`

**React Native** library.

Transform API/database data automatically through pipelines.

## Features

- response shaping
- field mapping
- nested transforms
- sanitization
- serialization

## Example

```ts
import { datamorphx } from "datamorphx";

const out = datamorphx()
  .hide("password")
  .rename("full_name", "name")
  .apply(user);
```

## Why it matters

Developers constantly write repetitive transformation logic.

## License

MIT
