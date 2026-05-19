# MERN packages monorepo

Public npm workspace under **`@mr-aftab-ahmad-khan/*`**. Each top-level folder is one package and its own GitHub repo ([`NPM-Packages-Modules`](https://github.com/NPM-Packages-Modules)).

| Package | Standalone repo | Role |
| --- | --- | --- |
| `@mr-aftab-ahmad-khan/monguard` | [monguard](https://github.com/NPM-Packages-Modules/monguard) | Mongoose query profiler & index hints |
| `@mr-aftab-ahmad-khan/stacksense` | [stacksense](https://github.com/NPM-Packages-Modules/stacksense) | Express error middleware & fingerprints |
| `@mr-aftab-ahmad-khan/syncora` | [syncora](https://github.com/NPM-Packages-Modules/syncora) | Realtime sync (WS + React hooks) |
| `@mr-aftab-ahmad-khan/logmesh` | [logmesh](https://github.com/NPM-Packages-Modules/logmesh) | Structured logging |
| `@mr-aftab-ahmad-khan/authmesh` | [authmesh](https://github.com/NPM-Packages-Modules/authmesh) | JWT auth & middleware |
| `@mr-aftab-ahmad-khan/routeforge` | [routeforge](https://github.com/NPM-Packages-Modules/routeforge) | Express scaffolding |

Flutter/Dart packages (e.g. `smart_form_x/`) sit at the root as `pub` projects — not npm workspaces.

## Development

```bash
npm install
npm run build
npm test
npm run build --workspace=monguard
```

## License

MIT unless noted per package.
