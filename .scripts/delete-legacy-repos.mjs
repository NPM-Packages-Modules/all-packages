/**
 * Delete individual package repos superseded by ecosystem monorepos.
 *
 * Keeps: mern, react-native, flutter, mern-packages
 * Deletes: any other public repo whose name matches a package folder in mern/ or react-native/
 *
 * Usage:
 *   node .scripts/delete-legacy-repos.mjs --dry-run
 *   node .scripts/delete-legacy-repos.mjs --yes
 */

import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ORG = "NPM-Packages-Modules";
const KEEP = new Set(["mern", "react-native", "flutter", "mern-packages"]);

const dryRun = process.argv.includes("--dry-run");
const yes = process.argv.includes("--yes");

if (!dryRun && !yes) {
  console.error("Pass --dry-run or --yes to delete repos.");
  process.exit(1);
}

function ensureDeleteScope() {
  const scopes = JSON.parse(
    execFileSync("gh", ["auth", "status", "--json", "scopes"], { encoding: "utf8" })
  ).scopes;
  if (!scopes.includes("delete_repo")) {
    console.error(
      "GitHub CLI needs delete_repo scope. Run:\n\n  gh auth refresh -h github.com -s delete_repo\n"
    );
    process.exit(1);
  }
}

function packageNames(dir) {
  const base = join(ROOT, dir);
  if (!existsSync(base)) return [];
  return readdirSync(base).filter(
    (n) => n !== "node_modules" && existsSync(join(base, n, "package.json"))
  );
}

const inMonorepo = new Set([
  ...packageNames("mern"),
  ...packageNames("react-native"),
]);

const repos = JSON.parse(
  execFileSync(
    "gh",
    ["repo", "list", ORG, "--limit", "500", "--json", "name"],
    { encoding: "utf8" }
  )
);

const toDelete = repos
  .map((r) => r.name)
  .filter((name) => !KEEP.has(name) && inMonorepo.has(name))
  .sort();

console.log(`Keep: ${[...KEEP].join(", ")}`);
console.log(`Packages in monorepos: ${inMonorepo.size}`);
console.log(`Legacy repos to delete: ${toDelete.length}\n`);

if (dryRun) {
  for (const name of toDelete) console.log("  would delete", `${ORG}/${name}`);
  process.exit(0);
}

ensureDeleteScope();

const failed = [];
for (let i = 0; i < toDelete.length; i++) {
  const name = toDelete[i];
  const slug = `${ORG}/${name}`;
  try {
    execFileSync("gh", ["repo", "delete", slug, "--yes"], { stdio: "inherit" });
    console.log(`[${i + 1}/${toDelete.length}] deleted ${slug}`);
  } catch (err) {
    console.error(`FAIL ${slug}`);
    failed.push(name);
  }
}

if (failed.length) {
  console.error("\nFailed:", failed.join(", "));
  process.exit(1);
}

console.log("\nDone. Org should show ~4 repos (+ any non-duplicate leftovers).");
