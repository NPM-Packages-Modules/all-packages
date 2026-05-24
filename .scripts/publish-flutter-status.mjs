/**
 * pub.dev registry audit for flutter/* packages.
 *   node .scripts/publish-flutter-status.mjs
 */

import { listFlutterPackages } from "./list-flutter-packages.mjs";

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

const pkgs = listFlutterPackages();
const synced = [];
const needPublish = [];
const drift = [];

for (const p of pkgs) {
  const remote = await latestOnPub(p.name);
  if (remote == null) needPublish.push(`${p.dir} → ${p.name}@${p.version} (never published)`);
  else if (remote === p.version) synced.push(`${p.dir} → ${p.name}@${p.version}`);
  else drift.push(`${p.dir} → local ${p.version}, pub latest ${remote}`);
}

console.log("pub.dev audit (flutter/)\n");
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
