# NPM Packages Modules — dev workspace

Local umbrella for three **GitHub monorepos** ([NPM-Packages-Modules](https://github.com/orgs/NPM-Packages-Modules/repositories)):

| GitHub repo                                                              | Folder here                        | Packages                     |
| ------------------------------------------------------------------------ | ---------------------------------- | ---------------------------- |
| [**mern**](https://github.com/NPM-Packages-Modules/mern)                 | [`mern/`](./mern/)                 | ~96 Node/MERN npm packages   |
| [**react-native**](https://github.com/NPM-Packages-Modules/react-native) | [`react-native/`](./react-native/) | 20 React Native npm packages |
| [**flutter**](https://github.com/NPM-Packages-Modules/flutter)           | [`flutter/`](./flutter/)           | 30 Dart/Flutter packages     |

Each package is a **subfolder** inside its ecosystem repo — not a separate org repo.

**Inner packages** (subfolders) are listed on each monorepo **home README** and in `PACKAGES.md` — GitHub’s org page only shows the 4 top-level repos; open `mern` / `react-native` / `flutter` to browse all sub-packages.

| Browse on GitHub                                                                                     | Local                                                                        |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [mern README](https://github.com/NPM-Packages-Modules/mern#packages-in-this-repo-95)                 | [mern/](./mern/) · [PACKAGES.md](./mern/PACKAGES.md)                         |
| [react-native README](https://github.com/NPM-Packages-Modules/react-native#packages-in-this-repo-20) | [react-native/](./react-native/) · [PACKAGES.md](./react-native/PACKAGES.md) |
| [flutter README](https://github.com/NPM-Packages-Modules/flutter#packages-in-this-repo-30)           | [flutter/](./flutter/) · [PACKAGES.md](./flutter/PACKAGES.md)                |

## Sync to GitHub

```bash
node .scripts/sync-ecosystem-repos.mjs           # all three
node .scripts/sync-ecosystem-repos.mjs mern      # one ecosystem
```

## Publish to npm

Build succeeding but publish failing? See **[`.scripts/PUBLISH-NPM.md`](./.scripts/PUBLISH-NPM.md)** (usually **E429 rate limit**, not a build error).

```bash
npm run publish:status
npm run publish:unpublished   # use NPM_PUBLISH_GAP_SEC=600 if rate limited
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
