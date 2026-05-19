# React Native packages

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

All **React Native (mobile)** npm packages live here — same repo layout as [`../mern`](../mern).

## Layout (every repo)

```
react-native/<package>/
  package.json
  src/              # or lib/ for Expo modules
  README.md
  LICENSE
  CHANGELOG.md
  .github/workflows/publish.yml
```

## Development

```bash
npm run build --workspace=react-native/<package>
npm test --workspace=react-native/<package>
```

## Add a package

Create a folder with the same structure as `mern/routeforge` (TypeScript + tsup) or an Expo module template, then register via npm workspaces (`react-native/*` in root `package.json`).

Sibling folders: [`../mern`](../mern) (backend), [`../flutter`](../flutter) (Dart).
