/**
 * Set GitHub repository topics from package.json keywords + org standards.
 *
 * Usage:
 *   node .scripts/set-repo-topics.mjs
 *   node .scripts/set-repo-topics.mjs 'react-native/*'
 *   node .scripts/set-repo-topics.mjs mern/monguard
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ORG = "NPM-Packages-Modules";

const STANDARD = ["merndev", "nodejs", "typescript", "observability", "mern-packages", "npm-pm"];
const RN_EXTRA = ["react-native", "react", "mobile"];

function expandWorkspaces(patterns) {
  const out = [];
  for (const w of patterns) {
    if (w.endsWith("/*")) {
      const dir = w.slice(0, -2);
      const base = join(ROOT, dir);
      if (!existsSync(base)) continue;
      for (const name of readdirSync(base)) {
        if (existsSync(join(base, name, "package.json"))) out.push(`${dir}/${name}`);
      }
    } else if (existsSync(join(ROOT, w, "package.json"))) {
      out.push(w);
    }
  }
  return out.sort();
}

function repoSlug(pkg) {
  const url = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  if (!url) return null;
  const m = String(url).match(/github\.com[/:]([^/]+)\/([^/.]+)/i);
  return m ? `${m[1]}/${m[2]}` : null;
}

function normalizeTopic(k) {
  return String(k)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function topicsForWorkspace(w, pkg) {
  const set = new Set(STANDARD);
  if (w.startsWith("react-native/")) for (const t of RN_EXTRA) set.add(t);
  for (const k of pkg.keywords || []) {
    const t = normalizeTopic(k);
    if (t.length >= 2 && t.length <= 50) set.add(t);
  }
  const name = w.split("/").pop();
  if (name) set.add(normalizeTopic(name));
  return [...set].slice(0, 20);
}

function setTopics(slug, names) {
  execFileSync(
    "gh",
    ["api", "--method", "PUT", `repos/${slug}/topics`, "-f", `names[]=${names.join(",")}`],
    { stdio: "pipe" }
  );
}

// gh -f names[]= doesn't work for array - use JSON input
function setTopicsJson(slug, names) {
  execFileSync("gh", ["api", "--method", "PUT", `repos/${slug}/topics`, "--input", "-"], {
    input: JSON.stringify({ names }),
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
}

let workspaces = expandWorkspaces(
  JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).workspaces
);

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (only.length) {
  workspaces = workspaces.filter(
    (w) =>
      only.includes(w) ||
      only.some((f) => f.endsWith("/*") && w.startsWith(f.slice(0, -1)))
  );
}

const failures = [];
for (const w of workspaces) {
  const pkg = JSON.parse(readFileSync(join(ROOT, w, "package.json"), "utf8"));
  const slug = repoSlug(pkg);
  if (!slug) {
    console.warn("skip", w, "(no repo)");
    continue;
  }
  const names = topicsForWorkspace(w, pkg);
  try {
    setTopicsJson(slug, names);
    console.log("OK", w, "->", names.join(", "));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("FAIL", w, msg);
    failures.push(w);
  }
}

if (failures.length) process.exit(1);
