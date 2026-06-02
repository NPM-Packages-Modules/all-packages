/**
 * Publish workspaces whose package.json version is not yet on npm.
 * Handles * and legacy unscoped names.
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
 *   NPM_OTP=123456                   if npm account uses 2FA for publish
 *
 * Common failures:
 *   E429 — npm publish rate limit (wait hours; publish slowly, ~1 pkg / 5–10 min)
 *   Build OK + E429 — not a build bug; registry rejected the upload
 *   Build OK + E404 — usually expired/missing npm login (not a build bug)
 */

import { readFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { loadWorkspacePaths } from "./expand-workspaces.mjs";
import { npmEnv, assertNpmAuth, isAuthError, is2faRequired } from "./npm-publish-env.mjs";

assertNpmAuth();
const npmRunEnv = npmEnv();

const root = fileURLToPath(new URL("..", import.meta.url));
const logPath = join(root, ".scripts", "publish-unpublished.log");
const allWorkspaces = loadWorkspacePaths(root);
const filterArg = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const filter = new Set(filterArg);
const workspaces = filter.size
  ? allWorkspaces.filter(
      (w) =>
        filter.has(w) ||
        filter.has(w.split("/").pop()) ||
        filterArg.some((f) => f.endsWith("/*") && w.startsWith(f.slice(0, -1)))
    )
  : allWorkspaces;

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
    env: npmRunEnv,
  });
  return r.status === 0 && r.stdout.trim() === ver;
}

function buildWorkspace(w) {
  return spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    cwd: join(root, w),
    env: npmRunEnv,
  }).status;
}

function publishOnce(w) {
  const args = ["publish", "--access", "public"];
  if (process.env.NPM_PUBLISH_IGNORE_SCRIPTS === "1") args.push("--ignore-scripts");
  if (process.env.NPM_OTP) args.push("--otp", process.env.NPM_OTP);
  const r = spawnSync("npm", args, {
    stdio: "pipe",
    cwd: join(root, w),
    encoding: "utf8",
    env: npmRunEnv,
  });
  if (r.status !== 0) {
    process.stderr.write(r.stdout ?? "");
    process.stderr.write(r.stderr ?? "");
  }
  return { status: r.status ?? 1, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

const todo = [];
for (const w of workspaces) {
  const pj = join(root, w, "package.json");
  if (!existsSync(pj)) continue;
  const pkg = readPkg(w);
  const { name, version: ver } = pkg;
  if (!name) continue;
  if (isVersionOnRegistry(name, ver)) {
    log(`skip ${name}@${ver} (already on registry)`);
    continue;
  }
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
const gapSec = Number(process.env.NPM_PUBLISH_GAP_SEC ?? "300");
const stopOn429 = process.env.NPM_PUBLISH_STOP_ON_429 !== "0";

let stopBatch = false;

for (let i = 0; i < todo.length && !stopBatch; i++) {
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
    const alreadyThere =
      /cannot publish over the previously published|version already exists/i.test(out);
    if (status === 0 || alreadyThere || isVersionOnRegistry(name, ver)) {
      log(`  ✓ published ${name}@${ver}${alreadyThere ? " (already on registry)" : ""}`);
      ok = true;
      break;
    }

    if (is2faRequired(out)) {
      log(
        `  ✗ npm 2FA required (E403). Browser login is not enough for publish.\n` +
          `      Option A — Granular token (best for batch):\n` +
          `        https://www.npmjs.com/settings/tokens → Generate → Publish + Bypass 2FA\n` +
          `        npm logout && npm login   (paste token as password)\n` +
          `      Option B — one-time password per publish:\n` +
          `        NPM_OTP=123456 npm run publish:daily:local`
      );
      failed.push(w, ...todo.slice(i + 1).map((t) => t.w));
      stopBatch = true;
      break;
    }

    if (isAuthError(out)) {
      log(
        `  ✗ npm auth/permission error (E401/E404). Stop batch.\n` +
          `        npm logout && npm login && npm whoami\n` +
          `      Then: cd ${w} && npm publish --access public`
      );
      failed.push(w, ...todo.slice(i + 1).map((t) => t.w));
      stopBatch = true;
      break;
    }

    const is429 = /E429|429 Too Many Requests|rate limit/i.test(out);
    if (is429 && stopOn429) {
      log(
        `  ✗ npm rate limit (E429). Stop batch — wait several hours, then publish slowly:\n` +
          `      NPM_PUBLISH_GAP_SEC=600 NPM_PUBLISH_STOP_ON_429=0 npm run publish:unpublished\n` +
          `      Or one package: cd ${w} && npm publish --access public`
      );
      failed.push(w, ...todo.slice(i + 1).map((t) => t.w));
      stopBatch = true;
      break;
    }
    if (attempt < maxAttempts) {
      const waitSec = is429 ? e429WaitSec : Math.min(900, 90 * attempt);
      log(`  ✗ attempt ${attempt} failed${is429 ? " (E429)" : ""}; waiting ${waitSec}s…`);
      await sleep(waitSec * 1000);
    }
  }

  if (!ok && !failed.includes(w)) failed.push(w);

  if (i < todo.length - 1 && !stopBatch) {
    log(`  gap ${gapSec}s before next package…`);
    await sleep(gapSec * 1000);
  }
}

if (failed.length) {
  log(`FAILED (${failed.length}): ${failed.join(", ")}`);
  process.exit(1);
}
log("Done — all target versions published.");
