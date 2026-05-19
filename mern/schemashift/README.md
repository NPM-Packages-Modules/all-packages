# schemashift

**schemashift** compares representative Mongo-style JSON documents, highlights **breaking** path removals and type changes, assigns a **migration health score**, and prints **CLI plans** for dry-runs.

## CLI

```bash
npx schemashift generate ./samples/users-v1.json ./samples/users-v2.json
npx schemashift score ./before.json ./after.json
```

## API

```ts
import { diffSampleDocuments, migrationHealthScore, formatMigrationPlan } from "@mr-aftab-ahmad-khan/schemashift";

const diff = diffSampleDocuments(oldDoc, newDoc);
const score = migrationHealthScore(diff); // 0–100
```

MIT © Aftab Ahmad Khan
