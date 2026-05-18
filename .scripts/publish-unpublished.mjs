/**
 * npm publish every workspace whose current version is not yet on the registry.
 * Uses delays + retries on 429 (npm rate limits bursty publishes).
 *
 * Usage: node .scripts/publish-unpublished.mjs [workspace-name ...]
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const workspaces = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).workspaces;
const filter = new Set(process.argv.slice(2).filter((a) => !a.startsWith("-")));

function isPublished(name, ver) {
  const r = spawnSync("npm", ["view", `${name}@${ver}`, "version"], {
    encoding: "utf8",
    cwd: root,
  });
  return r.status === 0 && r.stdout.trim() === ver;
}

function publishOnce(w) {
  return spawnSync("npm", ["publish", "-w", w, "--access", "public"], {
    stdio: "inherit",
    cwd: root,
  }).status;
}

const todo = [];
for (const w of workspaces) {
  if (filter.size && !filter.has(w)) continue;
  const pj = join(root, w, "package.json");
  if (!existsSync(pj)) continue;
  const pkg = JSON.parse(readFileSync(pj, "utf8"));
  const { name, version: ver } = pkg;
  if (!name?.startsWith("@")) continue;
  if (isPublished(name, ver)) continue;
  todo.push(w);
}

console.error(`${todo.length} workspace(s) to publish.`);

if (process.env.NPM_PUBLISH_SKIP_COOLDOWN !== "1") {
  console.error("Cool-down 90s before first publish (avoid npm E429 after registry lookups)…");
  await sleep(90_000);
}

const failed = [];

for (let i = 0; i < todo.length; i++) {
  const w = todo[i];
  console.error(`\n[${i + 1}/${todo.length}] ${w}`);

  let attempt = 0;
  let status = 1;
  while (attempt < 8 && status !== 0) {
    attempt++;
    status = publishOnce(w);
    if (status === 0) break;
    if (attempt < 8) {
      const waitSec = Math.min(600, 60 * attempt);
      console.error(`  publish failed (attempt ${attempt}), waiting ${waitSec}s before retry…`);
      await sleep(waitSec * 1000);
    }
  }

  if (status !== 0) failed.push(w);

  const gap = Number(process.env.NPM_PUBLISH_GAP_SEC ?? "75");
  if (i < todo.length - 1) {
    console.error(`  waiting ${gap}s before next package…`);
    await sleep(gap * 1000);
  }
}

if (failed.length) {
  console.error("\nFailed after retries:", failed.join(", "));
  process.exit(1);
}
console.error("\nDone.");
