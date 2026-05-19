# MERN packages

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

All **MERN / Node.js** npm packages live here. Each subdirectory is its own repo under [`NPM-Packages-Modules`](https://github.com/NPM-Packages-Modules).

## Layout (every repo)

```
mern/<package>/
  package.json      @mr-aftab-ahmad-khan/<package>
  src/
  README.md
  LICENSE
  CHANGELOG.md
  .github/workflows/publish.yml
```

## New packages (scaffold)

```bash
node .scripts/scaffold-ecosystem-repos.mjs   # MERN + Flutter only; skips existing
```

## Development

```bash
# from monorepo root
npm run build --workspace=mern/<package>
npm test --workspace=mern/<package>
```

## Highlights

| Package | Role |
| --- | --- |
| [monguard](./monguard) | Mongoose query profiler & index hints |
| [stacksense](./stacksense) | Express error middleware & fingerprints |
| [syncora](./syncora) | Realtime sync (WS + React hooks) |
| [logmesh](./logmesh) | Structured logging |
| [authmesh](./authmesh) | JWT auth & middleware |
| [routeforge](./routeforge) | Express route/controller scaffolding |
| [schemashift](./schemashift) | MongoDB schema migrations |

See sibling folders: [`../react-native`](../react-native) (mobile), [`../flutter`](../flutter) (Dart).
