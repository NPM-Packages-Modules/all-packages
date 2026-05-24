/**
 * Publish up to N Flutter packages per run (pub.dev rate limits apply).
 *
 *   PUB_PUBLISH_DAILY_LIMIT=15 npm run publish:flutter:daily
 */

process.env.PUB_PUBLISH_STOP_ON_429 = "1";
process.env.PUB_PUBLISH_GAP_SEC = process.env.PUB_PUBLISH_GAP_SEC ?? "120";

const limit = Number(process.env.PUB_PUBLISH_DAILY_LIMIT ?? "15");
const { spawnSync } = await import("node:child_process");
const { fileURLToPath } = await import("node:url");
const { join } = await import("node:path");
import { listFlutterPackages } from "./list-flutter-packages.mjs";
import { assertDartAuth } from "./dart-publish-env.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

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

const pending = [];
for (const p of listFlutterPackages()) {
  const remote = await latestOnPub(p.name);
  if (remote !== p.version) pending.push(p.dir);
}

const batch = pending.slice(0, limit);
console.log(`Pending: ${pending.length} · This run: ${batch.length} (limit ${limit})\n`);

if (!batch.length) {
  console.log("Nothing to publish.");
  process.exit(0);
}

assertDartAuth();

const r = spawnSync(process.execPath, [join(root, ".scripts/publish-flutter-unpublished.mjs"), ...batch], {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

process.exit(r.status ?? 1);
