/**
 * Configure moved packages for React Native (peer deps, keywords, RN-friendly exports).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RN = join(fileURLToPath(new URL("..", import.meta.url)), "react-native");
const AUTHOR = "Aftab Ahmad Khan (https://github.com/aftab-ahmad-khan-dev)";

const dirs = readdirSync(RN).filter((d) => existsSync(join(RN, d, "package.json")));

for (const name of dirs) {
  const pjPath = join(RN, name, "package.json");
  const pj = JSON.parse(readFileSync(pjPath, "utf8"));
  pj.keywords = [
    "react-native",
    "react",
    "mobile",
    "typescript",
    name,
    ...(pj.keywords || []).filter((k) => !["merndev", "express", "mongodb", "nodejs"].includes(k)),
  ];
  delete pj.peerDependencies?.express;
  delete pj.peerDependenciesMeta?.express;
  pj.peerDependencies = {
    react: ">=18",
    "react-native": ">=0.72",
    ...pj.peerDependencies,
  };
  pj.peerDependenciesMeta = {
    react: { optional: true },
    "react-native": { optional: true },
    ...pj.peerDependenciesMeta,
  };
  const dev = { ...pj.devDependencies };
  delete dev.express;
  delete dev["@types/express"];
  delete dev.supertest;
  delete dev["@types/supertest"];
  pj.devDependencies = {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    react: "^18.2.0",
    "react-native": "^0.74.0",
    tsup: dev.tsup || "^8.0.0",
    typescript: dev.typescript || "^5.4.0",
    vitest: dev.vitest || "^1.4.0",
    "@types/node": dev["@types/node"] || "^20.11.0",
  };
  pj.repository = {
    type: "git",
    url: `git+https://github.com/NPM-Packages-Modules/${name}.git`,
  };
  pj.bugs = { url: `https://github.com/NPM-Packages-Modules/${name}/issues` };
  pj.homepage = `https://github.com/NPM-Packages-Modules/${name}#readme`;
  pj.author = AUTHOR;
  writeFileSync(pjPath, JSON.stringify(pj, null, 2) + "\n");

  const readmePath = join(RN, name, "README.md");
  if (existsSync(readmePath)) {
    let md = readFileSync(readmePath, "utf8");
    if (!md.includes("React Native")) {
      md = md.replace(`# ${name}\n`, `# ${name}\n\n**React Native** library.\n`);
    }
    writeFileSync(readmePath, md);
  }
  console.log("configured", name);
}
