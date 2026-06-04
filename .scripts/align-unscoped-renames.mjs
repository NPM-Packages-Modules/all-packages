/**
 * Align package.json "name" with unscoped renames (no @username scope).
 * - If `${folder}x@version` is already on npm → use that name.
 * - If folder is npm-blocked (E403 squatting) → use `${folder}x` (or SPECIAL map).
 * Does NOT touch packages that already use a custom name (name !== folder).
 *
 *   node .scripts/align-unscoped-renames.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadWorkspacePaths } from "./expand-workspaces.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

/** npm E403 "too similar" — publish as folder+x instead */
const BLOCKED_FOLDERS = new Set([
  "backendforge",
  "cacheflow",
  "cachemesh",
  "dbflow",
  "envguard",
]);

const SPECIAL_X = {
  responsa: "responsax",
  schemaui: "schemauix",
};

function xName(folder) {
  return SPECIAL_X[folder] ?? `${folder}x`;
}

function onRegistry(name, ver) {
  const r = spawnSync("npm", ["view", `${name}@${ver}`, "version"], {
    encoding: "utf8",
    cwd: root,
  });
  return r.status === 0 && r.stdout.trim() === ver;
}

let changed = 0;
for (const w of loadWorkspacePaths(root)) {
  const folder = w.split("/").pop();
  const pj = join(root, w, "package.json");
  if (!existsSync(pj)) continue;
  const pkg = JSON.parse(readFileSync(pj, "utf8"));
  if (!pkg.name || pkg.name.startsWith("@") || pkg.name !== folder) continue;

  const candidate = xName(folder);
  const useX =
    onRegistry(candidate, pkg.version) || BLOCKED_FOLDERS.has(folder);
  if (!useX) continue;

  pkg.name = candidate;
  writeFileSync(pj, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`  ${w}: ${folder} → ${candidate}`);
  changed++;
}

console.log(`\n${changed} package.json name(s) aligned (unscoped, no username).`);
