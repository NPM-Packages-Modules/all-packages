# MERN packages monorepo

Public npm workspace under **`@mr-aftab-ahmad-khan/*`**. This repo aggregates sources for local development; **each package also has its own GitHub repo** (canonical for issues and publishing from a single-package checkout).

| Package | Standalone repo | Role |
| --- | --- | --- |
| `@mr-aftab-ahmad-khan/monguard` | [monguard](https://github.com/NPM-Packages-Modules/monguard) | Mongoose query profiler & index hints |
| `@mr-aftab-ahmad-khan/stacksense` | [stacksense](https://github.com/NPM-Packages-Modules/stacksense) | Express error middleware & fingerprints |
| `@mr-aftab-ahmad-khan/syncora` | [syncora](https://github.com/NPM-Packages-Modules/syncora) | Realtime sync (WS + React hooks) |
| `@mr-aftab-ahmad-khan/typepress` | [typepress](https://github.com/NPM-Packages-Modules/typepress) | Type-safe Express API helpers |
| `@mr-aftab-ahmad-khan/promptmesh` | [promptmesh](https://github.com/NPM-Packages-Modules/promptmesh) | Prompt versioning, cache, A/B |
| `@mr-aftab-ahmad-khan/perfstack` | [perfstack](https://github.com/NPM-Packages-Modules/perfstack) | Full-stack perf profiling |
| `@mr-aftab-ahmad-khan/envguard` | [envguard](https://github.com/NPM-Packages-Modules/envguard) | Env validation + CLI |
| `@mr-aftab-ahmad-khan/responsa` | [responsa](https://github.com/NPM-Packages-Modules/responsa) | Standard API responses |
| `@mr-aftab-ahmad-khan/archsense` | [archsense](https://github.com/NPM-Packages-Modules/archsense) | Architecture audit CLI |
| `@mr-aftab-ahmad-khan/logmesh` | [logmesh](https://github.com/NPM-Packages-Modules/logmesh) | Structured logging |

Monorepo mirror: [NPM-Packages-Modules/mern-packages](https://github.com/NPM-Packages-Modules/mern-packages).

Repositories use topics such as **`nodejs`**, **`typescript`**, **`merndev`**, **`middleware`**, and package-specific tags (e.g. **`llm`**, **`openai`**, **`rate-limiting`**, **`budget`** on promptmesh).

## Development

```bash
npm install
npm run build
npm test
```

## License

Packages are licensed under MIT unless noted in each folder.
