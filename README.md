# NPM Packages Modules — dev workspace

Local umbrella for three **GitHub monorepos** ([NPM-Packages-Modules](https://github.com/orgs/NPM-Packages-Modules/repositories)):

| GitHub repo | Folder here | Packages |
| --- | --- | --- |
| [**mern**](https://github.com/NPM-Packages-Modules/mern) | [`mern/`](./mern/) | ~96 Node/MERN npm packages |
| [**react-native**](https://github.com/NPM-Packages-Modules/react-native) | [`react-native/`](./react-native/) | 20 React Native npm packages |
| [**flutter**](https://github.com/NPM-Packages-Modules/flutter) | [`flutter/`](./flutter/) | 30 Dart/Flutter packages |

Each package is a **subfolder** inside its ecosystem repo — not a separate org repo.

## Sync to GitHub

```bash
node .scripts/sync-ecosystem-repos.mjs           # all three
node .scripts/sync-ecosystem-repos.mjs mern      # one ecosystem
```

## Local development

```bash
npm install
npm run build --workspace=mern/monguard
npm run build --workspace=react-native/servbridge
cd flutter/smart_form_x && flutter pub get && flutter test
```

## Clean up GitHub org (remove 100+ duplicate repos)

Archived copies still appear on the [org page](https://github.com/orgs/NPM-Packages-Modules/repositories) as **“Public archive”**. To remove them completely, see [`.scripts/CLEANUP-ORG.md`](./.scripts/CLEANUP-ORG.md).

## Legacy

[`mern-packages`](https://github.com/NPM-Packages-Modules/mern-packages) — local dev umbrella; optional if you only use `mern`, `react-native`, and `flutter`.

## License

MIT per package.
