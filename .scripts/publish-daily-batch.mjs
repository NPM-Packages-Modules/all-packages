/**
 * Publish up to N packages per run (npm registry often limits ~20–25 new publishes / day).
 *
 *   NPM_PUBLISH_DAILY_LIMIT=20 NPM_PUBLISH_GAP_SEC=300 npm run publish:daily
 *
 * Run once per day until `npm run publish:status` shows 0 need publish.
 */

process.env.NPM_PUBLISH_STOP_ON_429 = "1";
process.env.NPM_PUBLISH_SKIP_COOLDOWN = "1";
process.env.NPM_PUBLISH_GAP_SEC = process.env.NPM_PUBLISH_GAP_SEC ?? "300";

const limit = Number(process.env.NPM_PUBLISH_DAILY_LIMIT ?? "20");
const { spawnSync } = await import("node:child_process");
const { fileURLToPath } = await import("node:url");
const { join } = await import("node:path");

const root = fileURLToPath(new URL("..", import.meta.url));
const { loadWorkspacePaths } = await import("./expand-workspaces.mjs");
const { readFileSync, existsSync } = await import("node:fs");

function onRegistry(name, ver) {
  const r = spawnSync("npm", ["view", `${name}@${ver}`, "version"], {
    encoding: "utf8",
    cwd: root,
  });
  return r.status === 0 && r.stdout.trim() === ver;
}

const pending = [];
for (const w of loadWorkspacePaths(root)) {
  const pj = join(root, w, "package.json");
  if (!existsSync(pj)) continue;
  const { name, version: ver } = JSON.parse(readFileSync(pj, "utf8"));
  if (!name || onRegistry(name, ver)) continue;
  pending.push(w);
}

const batch = pending.slice(0, limit);
console.log(`Pending: ${pending.length} · This run: ${batch.length} (limit ${limit})\n`);

if (!batch.length) {
  console.log("Nothing to publish.");
  process.exit(0);
}

import { npmEnv, assertNpmAuth } from "./npm-publish-env.mjs";

assertNpmAuth();

const r = spawnSync(
  process.execPath,
  [join(root, ".scripts/publish-unpublished.mjs"), ...batch],
  { stdio: "inherit", cwd: root, env: npmEnv(process.env) }
);

process.exit(r.status ?? 1);
