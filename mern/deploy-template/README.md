# deploy-template

**Topics:** docker · deploy · nginx · ci · mern-packages · merndev · nodejs · npm-pm · typescript

Generate **deployment configs** — Dockerfile, compose, Nginx, GitHub Actions, env templates.

## Install

```bash
npm install deploy-template
```

## Example

```bash
npx deploy-template generate
```

## API

```typescript
import { deployTemplate } from "deploy-template";

const files = deployTemplate.generate();
```

## License

MIT
