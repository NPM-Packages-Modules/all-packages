# auditmesh

**Topics:** audit · compliance · mongodb · changelog · mern-packages · merndev · nodejs · npm-pm · typescript

Track **every database change** automatically — snapshots, user attribution, rollback, and compliance timelines.

## Install

```bash
npm install auditmesh
```

## Example

```bash
npx auditmesh watch User
```

## API

```typescript
import { auditmesh } from "auditmesh";

auditmesh.watch("User");
```

## License

MIT
