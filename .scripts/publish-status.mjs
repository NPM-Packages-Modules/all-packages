/**
 * Quick registry audit for all workspaces.
 *   node .scripts/publish-status.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadWorkspacePaths } from "./expand-workspaces.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const workspaces = loadWorkspacePaths(root);

function latest(name) {
  const r = spawnSync("npm", ["view", name, "version"], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

function exact(name, ver) {
  const r = spawnSync("npm", ["view", `${name}@${ver}`, "version"], { encoding: "utf8" });
  return r.status === 0 && r.stdout.trim() === ver;
}

const synced = [];
const needPublish = [];
const drift = [];

for (const w of workspaces) {
  const pj = join(root, w, "package.json");
  if (!existsSync(pj)) continue;
  const p = JSON.parse(readFileSync(pj, "utf8"));
  const { name, version: ver } = p;
  if (!name) continue;
  const remote = latest(name);
  if (remote == null) needPublish.push(`${w} → ${name}@${ver} (never published)`);
  else if (exact(name, ver)) synced.push(`${w} → ${name}@${ver}`);
  else if (remote !== ver)
    drift.push(`${w} → local ${ver}, npm latest ${remote} (bump or publish ${ver})`);
  else needPublish.push(`${w} → ${name}@${ver}`);
}

console.log("Registry audit\n");
console.log(`✓ Published at current version: ${synced.length}`);
console.log(`○ Need publish: ${needPublish.length}`);
console.log(`△ Version drift: ${drift.length}\n`);

if (needPublish.length) {
  console.log("Need publish:");
  for (const line of needPublish) console.log(" ", line);
}
if (drift.length) {
  console.log("\nVersion drift:");
  for (const line of drift) console.log(" ", line);
}
