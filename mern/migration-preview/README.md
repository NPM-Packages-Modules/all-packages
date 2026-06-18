# migration-preview

**Topics:** mongodb · migration · schema · mern-packages · merndev · nodejs · npm-pm · typescript

Show **how a schema change affects data** before you run the migration.

## Install

```bash
npm install migration-preview
```

## API

```typescript
import { migrationPreview } from "migration-preview";

migrationPreview.run({ collection: "users", affected: 50_000 });
```

## License

MIT
