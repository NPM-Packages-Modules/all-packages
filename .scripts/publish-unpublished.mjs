/**
 * Publish workspaces whose package.json version is not yet on npm.
 * Handles @mr-aftab-ahmad-khan/* and legacy unscoped names.
 *
 * Usage:
 *   node .scripts/publish-unpublished.mjs [workspace ...]
 *
 * Env:
 *   NPM_PUBLISH_GAP_SEC=120          pause between packages (default 120)
 *   NPM_PUBLISH_INITIAL_COOLDOWN_SEC=300  wait before first publish (default 300)
 *   NPM_PUBLISH_MAX_ATTEMPTS=6
 *   NPM_PUBLISH_E429_WAIT_SEC=1800   wait after E429 before retry (default 30m)
 *   NPM_PUBLISH_SKIP_COOLDOWN=1
 *   NPM_PUBLISH_SKIP_BUILD=1
 *   NPM_PUBLISH_IGNORE_SCRIPTS=1      pass --ignore-scripts to npm publish
 */

import { readFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const logPath = join(root, ".scripts", "publish-unpublished.log");
const workspaces = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).workspaces;
const filter = new Set(process.argv.slice(2).filter((a) => !a.startsWith("-")));

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  if (process.stderr.isTTY) process.stderr.write(`${line}\n`);
  try {
    appendFileSync(logPath, `${line}\n`);
  } catch {
    /* ignore */
  }
}

function readPkg(w) {
  return JSON.parse(readFileSync(join(root, w, "package.json"), "utf8"));
}

function isVersionOnRegistry(name, ver) {
  const r = spawnSync("npm", ["view", `${name}@${ver}`, "version"], {
    encoding: "utf8",
    cwd: root,
  });
  return r.status === 0 && r.stdout.trim() === ver;
}

function buildWorkspace(w) {
  return spawnSync("npm", ["run", "build", "-w", w], {
    stdio: "inherit",
    cwd: root,
  }).status;
}

function publishOnce(w) {
  const args = ["publish", "-w", w, "--access", "public"];
  if (process.env.NPM_PUBLISH_IGNORE_SCRIPTS === "1") args.push("--ignore-scripts");
  const r = spawnSync("npm", args, { stdio: "pipe", cwd: root, encoding: "utf8" });
  if (r.status !== 0) {
    process.stderr.write(r.stdout ?? "");
    process.stderr.write(r.stderr ?? "");
  }
  return { status: r.status ?? 1, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

const todo = [];
for (const w of workspaces) {
  if (filter.size && !filter.has(w)) continue;
  const pj = join(root, w, "package.json");
  if (!existsSync(pj)) continue;
  const pkg = readPkg(w);
  const { name, version: ver } = pkg;
  if (!name) continue;
  if (isVersionOnRegistry(name, ver)) continue;
  todo.push({ w, name, ver });
}

log(`${todo.length} package version(s) to publish.`);

if (!todo.length) {
  log("Nothing to do — all workspace versions are already on the registry.");
  process.exit(0);
}

const initialCooldownSec = Number(process.env.NPM_PUBLISH_INITIAL_COOLDOWN_SEC ?? "300");
if (process.env.NPM_PUBLISH_SKIP_COOLDOWN !== "1" && initialCooldownSec > 0) {
  log(`Initial cooldown ${initialCooldownSec}s (npm publish rate limit)…`);
  await sleep(initialCooldownSec * 1000);
}

if (process.env.NPM_PUBLISH_SKIP_BUILD !== "1") {
  log("Building unpublished workspaces…");
  for (const { w } of todo) {
    log(`  build ${w}`);
    const st = buildWorkspace(w);
    if (st !== 0) {
      log(`  WARN: build failed for ${w} (exit ${st}); publish may still be attempted.`);
    }
  }
}

const failed = [];
const maxAttempts = Number(process.env.NPM_PUBLISH_MAX_ATTEMPTS ?? "6");
const e429WaitSec = Number(process.env.NPM_PUBLISH_E429_WAIT_SEC ?? "1800");
const gapSec = Number(process.env.NPM_PUBLISH_GAP_SEC ?? "120");

for (let i = 0; i < todo.length; i++) {
  const { w, name, ver } = todo[i];
  log(`[${i + 1}/${todo.length}] publish ${name}@${ver} (${w})`);

  let attempt = 0;
  let ok = false;

  while (attempt < maxAttempts && !ok) {
    attempt++;
    if (isVersionOnRegistry(name, ver)) {
      log(`  ✓ ${name}@${ver} already on registry`);
      ok = true;
      break;
    }

    const { status, out } = publishOnce(w);
    if (status === 0 || isVersionOnRegistry(name, ver)) {
      log(`  ✓ published ${name}@${ver}`);
      ok = true;
      break;
    }

    const is429 = /E429|429 Too Many Requests|rate limit/i.test(out);
    if (attempt < maxAttempts) {
      const waitSec = is429 ? e429WaitSec : Math.min(900, 90 * attempt);
      log(`  ✗ attempt ${attempt} failed${is429 ? " (E429)" : ""}; waiting ${waitSec}s…`);
      await sleep(waitSec * 1000);
    }
  }

  if (!ok) failed.push(w);

  if (i < todo.length - 1) {
    log(`  gap ${gapSec}s before next package…`);
    await sleep(gapSec * 1000);
  }
}

if (failed.length) {
  log(`FAILED (${failed.length}): ${failed.join(", ")}`);
  process.exit(1);
}
log("Done — all target versions published.");
