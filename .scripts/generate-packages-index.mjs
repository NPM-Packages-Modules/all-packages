/**
 * Build PACKAGES.md and embed the package directory in each monorepo README
 * so GitHub repo home shows all inner packages (subfolders).
 *
 * Run: node .scripts/generate-packages-index.mjs [mern|react-native|flutter]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const INDEX_START = "<!-- packages-index:start -->";
const INDEX_END = "<!-- packages-index:end -->";

const ECOS = [
  {
    id: "mern",
    title: "MERN / Node npm packages",
    orgTopics: "`merndev` · `nodejs` · `typescript` · `mongodb` · `express` · `mern-packages` · `npm-pm`",
    install: "npm install\nnpm run build --workspace=monguard",
  },
  {
    id: "react-native",
    title: "React Native npm packages",
    orgTopics: "`react-native` · `react` · `mobile` · `typescript` · `merndev` · `mern-packages` · `npm-pm`",
    install: "npm install\nnpm run build --workspace=servbridge",
  },
  {
    id: "flutter",
    title: "Flutter / Dart packages",
    orgTopics: "`flutter` · `dart` · `mobile` · `pub`",
    install: "cd <package>\nflutter pub get && flutter test",
  },
];

function readTopics(dir, ecosystem) {
  const topicsPath = join(dir, "package-topics.json");
  if (existsSync(topicsPath)) {
    return JSON.parse(readFileSync(topicsPath, "utf8")).topics || [];
  }
  if (ecosystem === "flutter") {
    const pub = readFileSync(join(dir, "pubspec.yaml"), "utf8");
    const m = pub.match(/^topics:\n((?:  - .+\n)+)/m);
    if (m) return [...m[1].matchAll(/  - (.+)/g)].map((x) => x[1]);
  } else {
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    return pkg.keywords || [];
  }
  return [];
}

function readMeta(dir, ecosystem) {
  if (ecosystem === "flutter") {
    const pub = readFileSync(join(dir, "pubspec.yaml"), "utf8");
    return {
      name: pub.match(/^name: (.+)/m)?.[1] || "",
      description: pub.match(/^description: (.+)/m)?.[1] || "",
    };
  }
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  return {
    name: pkg.name?.split("/").pop() || "",
    description: pkg.description || "",
  };
}

function fmtTopics(topics, max = 8) {
  const show = topics.slice(0, max);
  const rest = topics.length - show.length;
  const base = show.map((t) => `\`${t}\``).join(" · ");
  return rest > 0 ? `${base} · _+${rest}_` : base;
}

function packagesFor(ecoId) {
  const base = join(ROOT, ecoId);
  return readdirSync(base)
    .filter((n) => {
      if (n === "node_modules") return false;
      if (ecoId === "flutter") return existsSync(join(base, n, "pubspec.yaml"));
      return existsSync(join(base, n, "package.json"));
    })
    .sort();
}

function buildTable(eco, names) {
  const codeDir = eco.id === "flutter" ? "lib" : "src";
  const rows = names.map((folder) => {
    const dir = join(ROOT, eco.id, folder);
    const { name, description } = readMeta(dir, eco.id);
    const topics = readTopics(dir, eco.id);
    const desc = description.replace(/\|/g, "\\|").slice(0, 100);
    return `| [${name}](./${folder}/) | [README](./${folder}/README.md) · [${codeDir}](./${folder}/${codeDir}/) | ${fmtTopics(topics)} | ${desc} |`;
  });
  return `| Package | Open | Topics | Description |
| --- | --- | --- | --- |
${rows.join("\n")}`;
}

function buildPackagesMd(eco, names, table) {
  return `# Packages index

${eco.title}. Each row is one **subfolder** in this monorepo (not a separate GitHub repo).

**Org topics:** ${eco.orgTopics}

${table}

_${names.length} packages. Also shown on the [repo home README](./README.md#packages-in-this-repo-${names.length})._
`;
}

function buildReadmeIndexBlock(eco, count, table) {
  const tree = packagesFor(eco.id)
    .map((f) => `├── [${f}/](./${f}/)`)
    .join("\n");
  return `${INDEX_START}
## Packages in this repo (${count})

Each line below is an **inner package** (subfolder). Click a name to browse its code on GitHub.

\`\`\`text
${tree}
\`\`\`

| Package | Open | Topics | Description |
| --- | --- | --- | --- |
${table.split("\n").slice(2).join("\n")}

<details>
<summary>Full index file</summary>

Same table in [PACKAGES.md](./PACKAGES.md) (for deep links and exports).

</details>
${INDEX_END}`;
}

function patchReadme(eco, count, table) {
  const readmePath = join(ROOT, eco.id, "README.md");
  let md = existsSync(readmePath)
    ? readFileSync(readmePath, "utf8")
    : `# ${eco.title}\n\n`;

  const block = buildReadmeIndexBlock(eco, count, table);

  if (md.includes(INDEX_START)) {
    md = md.replace(new RegExp(`${INDEX_START}[\\s\\S]*?${INDEX_END}`), block);
  } else if (/^# /m.test(md)) {
    md = md.replace(/^(# [^\n]+\n\n)/m, `$1${block}\n\n`);
  } else {
    md = block + "\n\n" + md;
  }

  md = md.replace(/\n## All packages & topics[\s\S]*?(?=\n## |\n<!-- |\n*$)/, "\n");

  writeFileSync(readmePath, md);
}

const filter = new Set(process.argv.slice(2));
const run = filter.size ? ECOS.filter((e) => filter.has(e.id)) : ECOS;

for (const eco of run) {
  const names = packagesFor(eco.id);
  const table = buildTable(eco, names);
  writeFileSync(join(ROOT, eco.id, "PACKAGES.md"), buildPackagesMd(eco, names, table));
  patchReadme(eco, names.length, table);
  console.log(`${eco.id}: README + PACKAGES.md (${names.length} inner packages)`);
}
