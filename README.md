# NPM packages monorepo

Public packages under **`@mr-aftab-ahmad-khan/*`** (npm) and Dart **`pub`** packages. Each subfolder is a **standalone repo** (GitHub: [`NPM-Packages-Modules`](https://github.com/NPM-Packages-Modules)).

## Three ecosystem folders

| Folder | Stack | Workspace | Packages |
| --- | --- | --- | --- |
| [`mern/`](./mern/) | Node, Express, MongoDB, React (web) | `mern/*` (npm) | All MERN/backend npm repos |
| [`react-native/`](./react-native/) | React Native (iOS/Android) | `react-native/*` (npm) | Mobile RN repos |
| [`flutter/`](./flutter/) | Dart / Flutter | — (`pub`, not npm) | Flutter libraries & CLI tools |

Put every new repo in the matching folder — same layout as existing MERN packages (`package.json`, `src/`, README, LICENSE, publish workflow).

## Development

```bash
npm install
npm run build
npm test

# One MERN package
npm run build --workspace=mern/monguard
npm test --workspace=mern/logmesh

# Flutter (from package dir)
cd flutter/smart_form_x && flutter pub get && flutter test
```

## Sync to GitHub

```bash
node .scripts/sync-workspace-repos.mjs
node .scripts/sync-workspace-repos.mjs mern/monguard   # single package
```

## License

MIT unless noted in each package folder.
