#!/usr/bin/env node
/**
 * Check if a proposed package name/folder is safe to scaffold.
 *
 *   node .scripts/check-package-duplicate.mjs feature-slice-forge
 *   node .scripts/check-package-duplicate.mjs query-recorder
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXISTING_COVERAGE } from "./package-coverage.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const name = process.argv[2];

if (!name) {
  console.error("Usage: node .scripts/check-package-duplicate.mjs <folder-name>");
  process.exit(1);
}

const ecosystems = ["mern", "react-native", "flutter"];
const existingFolders = [];

for (const eco of ecosystems) {
  const base = join(root, eco);
  if (!existsSync(base)) continue;
  for (const dir of readdirSync(base)) {
    if (existsSync(join(base, dir, "package.json")) || existsSync(join(base, dir, "pubspec.yaml"))) {
      existingFolders.push(`${eco}/${dir}`);
    }
  }
}

const folderHit = existingFolders.find((p) => p.endsWith(`/${name}`));
const coverageHit = EXISTING_COVERAGE[name];

const similar = existingFolders.filter((p) => {
  const base = p.split("/").pop() ?? "";
  return base.includes(name) || name.includes(base);
});

console.log(`Proposed: ${name}\n`);

if (folderHit) {
  console.log(`✗ Folder exists: ${folderHit}`);
  process.exit(1);
}

if (coverageHit) {
  console.log(`✗ Semantic duplicate — use: ${coverageHit}`);
  process.exit(1);
}

if (similar.length) {
  console.log("△ Similar folder names (review manually):");
  for (const s of similar.slice(0, 8)) console.log(`  - ${s}`);
}

console.log("✓ OK to scaffold (no exact folder or coverage hit)");
process.exit(0);
