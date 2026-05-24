/**
 * Fill GitHub repo **About** (description + website + topics) with inner package info.
 *
 *   node .scripts/update-org-repo-descriptions.mjs
 *
 * About limits: description ≤350 chars, website = 1 URL, topics ≤20.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ORG = "NPM-Packages-Modules";
const DESC_MAX = 350;

const ECOS = [
  {
    id: "mern",
    baseTopics: [
      "mern",
      "merndev",
      "nodejs",
      "typescript",
      "mongodb",
      "express",
      "npm-pm",
      "mern-packages",
      "monorepo",
    ],
    sampleTopics: [
      "monguard",
      "stacksense",
      "syncora",
      "archsense",
      "envguard",
      "promptmesh",
      "perfstack",
      "responsa",
    ],
    label: "MERN/Node npm",
    scope: "@mr-aftab-ahmad-khan",
    listPackages(dir) {
      return readdirSync(dir)
        .filter((n) => existsSync(join(dir, n, "package.json")))
        .sort();
    },
    homepage: (n) =>
      `https://github.com/${ORG}/mern#packages-in-this-repo-${n}`,
  },
  {
    id: "react-native",
    baseTopics: [
      "react-native",
      "react",
      "mobile",
      "typescript",
      "merndev",
      "npm-pm",
      "mern-packages",
      "monorepo",
    ],
    sampleTopics: [
      "servbridge",
      "datamorph",
      "routeforge",
      "authmesh",
      "logmesh",
      "socketmesh",
      "mongoforge",
      "cachepilot",
    ],
    label: "React Native npm",
    scope: "@mr-aftab-ahmad-khan",
    listPackages(dir) {
      return readdirSync(dir)
        .filter((n) => existsSync(join(dir, n, "package.json")))
        .sort();
    },
    homepage: (n) =>
      `https://github.com/${ORG}/react-native#packages-in-this-repo-${n}`,
  },
  {
    id: "flutter",
    baseTopics: ["flutter", "dart", "mobile", "pub", "monorepo"],
    sampleTopics: [
      "smart-form-x",
      "flutter-env-forge",
      "flutter-api-weaver",
      "auto-state-sync",
      "responsive-magic-ui",
      "motion-builder",
      "widget-studio",
      "flutter-route-genius",
    ],
    label: "Flutter/Dart",
    scope: "pub.dev",
    listPackages(dir) {
      return readdirSync(dir)
        .filter((n) => existsSync(join(dir, n, "pubspec.yaml")))
        .sort();
    },
    homepage: (n) =>
      `https://github.com/${ORG}/flutter#packages-in-this-repo-${n}`,
  },
];

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function buildDescription(eco, names) {
  const n = names.length;
  const show = names.slice(0, 12);
  const rest = n - show.length;
  const list =
    rest > 0
      ? `${show.join(", ")} +${rest} more`
      : show.join(", ");
  return truncate(
    `${n} ${eco.label} packages in subfolders (${eco.scope}): ${list}. Website → full directory.`,
    DESC_MAX
  );
}

function setTopics(slug, names) {
  execFileSync("gh", ["api", "--method", "PUT", `repos/${slug}/topics`, "--input", "-"], {
    input: JSON.stringify({ names: names.slice(0, 20) }),
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
}

function editRepo(name, description, homepage) {
  execFileSync(
    "gh",
    ["repo", "edit", `${ORG}/${name}`, "--description", description, "--homepage", homepage],
    { stdio: "inherit" }
  );
}

const counts = {};

for (const eco of ECOS) {
  const dir = join(ROOT, eco.id);
  const names = eco.listPackages(dir);
  counts[eco.id] = names.length;
  const slug = `${ORG}/${eco.id}`;
  const description = buildDescription(eco, names);
  const homepage = eco.homepage(names.length);
  const topics = [...new Set([...eco.baseTopics, ...eco.sampleTopics])].slice(0, 20);

  editRepo(eco.id, description, homepage);
  setTopics(slug, topics);
  console.log(`OK ${eco.id} — About: ${names.length} pkgs, website → #packages-in-this-repo-${names.length}`);
}

const total = counts.mern + counts["react-native"] + counts.flutter;
const allDesc = truncate(
  `Dev monorepo umbrella: mern (${counts.mern}), react-native (${counts["react-native"]}), flutter (${counts.flutter}) = ${total} packages. Website → org repos.`,
  DESC_MAX
);
editRepo(
  "all-packages",
  allDesc,
  `https://github.com/${ORG}/mern#packages-in-this-repo-${counts.mern}`
);
setTopics(`${ORG}/all-packages`, [
  "monorepo",
  "mern",
  "react-native",
  "flutter",
  "nodejs",
  "typescript",
  "dart",
  "npm-pm",
  "mern-packages",
  "merndev",
  "observability",
  "mongodb",
]);

console.log("\nAbout updated on all 4 repos (description + website + topics).");
