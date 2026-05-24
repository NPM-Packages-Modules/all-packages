/**
 * Publish flutter/* packages whose version is not yet on pub.dev.
 *
 * Usage:
 *   node .scripts/publish-flutter-unpublished.mjs [package-dir ...]
 *
 * Env:
 *   PUB_PUBLISH_GAP_SEC=120
 *   PUB_PUBLISH_STOP_ON_429=1
 *   FLUTTER_ROOT=$HOME/.flutter-sdk
 */

import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { listFlutterPackages } from "./list-flutter-packages.mjs";
import {
  dartEnv,
  dartBin,
  flutterBin,
  assertDartAuth,
  isPubAuthError,
  isPubRateLimit,
  isAlreadyPublished,
} from "./dart-publish-env.mjs";

assertDartAuth();
const env = dartEnv();

const root = fileURLToPath(new URL("..", import.meta.url));
const logPath = join(root, ".scripts", "publish-flutter-unpublished.log");
const filterArg = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const filter = new Set(filterArg);

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  if (process.stderr.isTTY) process.stderr.write(`${line}\n`);
  try {
    appendFileSync(logPath, `${line}\n`);
  } catch {
    /* ignore */
  }
}

async function latestOnPub(name) {
  try {
    const r = await fetch(`https://pub.dev/api/packages/${name}`);
    if (!r.ok) return null;
    const j = await r.json();
    return j.latest?.version ?? null;
  } catch {
    return null;
  }
}

function pubGet(dir) {
  return spawnSync(flutterBin(), ["pub", "get"], {
    stdio: "inherit",
    cwd: dir,
    env,
  }).status;
}

function publishOnce(dir) {
  const r = spawnSync(dartBin(), ["pub", "publish", "--force"], {
    stdio: "pipe",
    cwd: dir,
    encoding: "utf8",
    env,
  });
  if (r.status !== 0) {
    process.stderr.write(r.stdout ?? "");
    process.stderr.write(r.stderr ?? "");
  }
  return { status: r.status ?? 1, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

const all = listFlutterPackages();
const packages = filter.size
  ? all.filter((p) => filter.has(p.dir) || filter.has(`flutter/${p.dir}`) || filter.has(p.name))
  : all;

const todo = [];
for (const p of packages) {
  const remote = await latestOnPub(p.name);
  if (remote === p.version) {
    log(`skip ${p.name}@${p.version} (already on pub.dev)`);
    continue;
  }
  todo.push(p);
}

log(`${todo.length} package version(s) to publish.`);

if (!todo.length) {
  log("Nothing to do — all versions are on pub.dev.");
  process.exit(0);
}

log("Running flutter pub get…");
for (const p of todo) {
  log(`  pub get ${p.dir}`);
  const st = pubGet(p.path);
  if (st !== 0) log(`  WARN: pub get failed for ${p.dir} (exit ${st})`);
}

const gapSec = Number(process.env.PUB_PUBLISH_GAP_SEC ?? "120");
const stopOn429 = process.env.PUB_PUBLISH_STOP_ON_429 !== "0";
const failed = [];
let stopBatch = false;

for (let i = 0; i < todo.length && !stopBatch; i++) {
  const p = todo[i];
  log(`[${i + 1}/${todo.length}] publish ${p.name}@${p.version} (${p.dir})`);

  const remote = await latestOnPub(p.name);
  if (remote === p.version) {
    log(`  ✓ ${p.name}@${p.version} already on pub.dev`);
    continue;
  }

  const { status, out } = publishOnce(p.path);
  if (status === 0 || isAlreadyPublished(out) || (await latestOnPub(p.name)) === p.version) {
    log(`  ✓ published ${p.name}@${p.version}`);
  } else if (isPubAuthError(out)) {
    log(`  ✗ pub.dev auth error. Run: dart pub token add https://pub.dev`);
    failed.push(p.dir, ...todo.slice(i + 1).map((t) => t.dir));
    stopBatch = true;
  } else if (isPubRateLimit(out) && stopOn429) {
    log(`  ✗ pub.dev rate limit. Stop batch — retry tomorrow.`);
    failed.push(p.dir, ...todo.slice(i + 1).map((t) => t.dir));
    stopBatch = true;
  } else {
    log(`  ✗ failed ${p.name}@${p.version}`);
    failed.push(p.dir);
  }

  if (i < todo.length - 1 && !stopBatch) {
    log(`  gap ${gapSec}s before next package…`);
    await sleep(gapSec * 1000);
  }
}

if (failed.length) {
  log(`FAILED (${failed.length}): ${failed.join(", ")}`);
  process.exit(1);
}
log("Done — all target versions published to pub.dev.");
