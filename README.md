# MERN packages monorepo

Public npm workspace under **`@mr-aftab-ahmad-khan/*`**. Local development mirror; **each package has its own GitHub repo** on [NPM-Packages-Modules](https://github.com/orgs/NPM-Packages-Modules/repositories) (canonical for issues and publishing).

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

Monorepo: [mern-packages](https://github.com/NPM-Packages-Modules/mern-packages).

**Flutter / React Native packages are not stored here** — they get their own repos under the same org when you create them.

## Development

```bash
npm install
npm run build
npm test
```

## Sync one package → its GitHub repo

```bash
node .scripts/sync-workspace-repos.mjs monguard
```

## License

MIT unless noted per package.
