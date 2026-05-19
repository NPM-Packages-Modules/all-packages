# NPM packages monorepo

Local dev mirror for [@mr-aftab-ahmad-khan](https://www.npmjs.com/~mr-aftab-ahmad-khan) packages. **Each package has its own repo** on [NPM-Packages-Modules](https://github.com/orgs/NPM-Packages-Modules/repositories).

## Folders

| Folder | Stack | npm workspace |
| --- | --- | --- |
| [`mern/`](./mern/) | Node, Express, MongoDB, React (web) | `mern/*` |
| [`react-native/`](./react-native/) | React Native (iOS/Android) | `react-native/*` |
| [`flutter/`](./flutter/) | Dart / Flutter | — (`pub` per package) |

## Development

```bash
npm install
npm run build --workspace=mern/monguard
cd flutter/smart_form_x && flutter pub get && flutter test
```

## Sync package → GitHub

```bash
node .scripts/sync-workspace-repos.mjs mern/monguard
```

Monorepo: [mern-packages](https://github.com/NPM-Packages-Modules/mern-packages).

## License

MIT per package unless noted.
