/**
 * One-shot: mirror each npm workspace folder into its standalone GitHub repo
 * (repository URL from that package's package.json). Creates repos via `gh` if missing.
 * Does not modify global git config.
 */

import { execFileSync, execSync } from "node:child_process";
import { readFileSync, existsSync, mkdtempSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

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

let workspaces = expandWorkspaces(
  JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).workspaces
);

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (only.length) {
  const set = new Set(only);
  workspaces = workspaces.filter(
    (w) => set.has(w) || [...set].some((f) => f.endsWith("/*") && w.startsWith(f.slice(0, -1)))
  );
  if (!workspaces.length) {
    console.error("No matching workspace names in filter:", only.join(", "));
    process.exit(1);
  }
}

function ghView(slug) {
  execFileSync("gh", ["repo", "view", slug], { encoding: "utf8", stdio: "pipe" });
}

function ghCreate(slug, description) {
  execFileSync("gh", ["repo", "create", slug, "--public", "--description", description], {
    stdio: "inherit",
  });
}

function run(cmd, opts = {}) {
  const { cwd, silent } = opts;
  return execSync(cmd, {
    cwd,
    encoding: "utf8",
    stdio: silent ? "pipe" : "inherit",
    shell: "/bin/bash",
  });
}

function repoSlug(url) {
  const s = String(url)
    .replace(/^git\+/, "")
    .replace(/\.git$/i, "");
  const m = s.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  return m ? `${m[1]}/${m[2]}` : null;
}

const failures = [];

async function main() {
  for (let i = 0; i < workspaces.length; i++) {
    const w = workspaces[i];
    const src = join(ROOT, w);
    const pjPath = join(src, "package.json");
    if (!existsSync(pjPath)) continue;
    const pkg = JSON.parse(readFileSync(pjPath, "utf8"));
    const repoUrl = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
    if (!repoUrl) {
      console.warn("skip", w, "(no repository)");
      continue;
    }
    const slug = repoSlug(repoUrl);
    if (!slug) {
      console.warn("skip", w, "(non-GitHub repo)", repoUrl);
      continue;
    }
    const desc = String(pkg.description || w).slice(0, 350);
    const httpsUrl = `https://github.com/${slug}.git`;
    const tmp = mkdtempSync(join(tmpdir(), `npm-split-${w.replace(/\//g, "-")}-`));
    const r = join(tmp, "r");

    try {
      try {
        ghView(slug);
      } catch {
        console.log("create", slug);
        ghCreate(slug, desc);
      }

      try {
        run(`git clone --depth 40 "${httpsUrl}" "${r}"`, { silent: true });
      } catch {
        mkdirSync(r, { recursive: true });
        run(`git init`, { cwd: r, silent: true });
        run(`git remote add origin "${httpsUrl}"`, { cwd: r, silent: true });
      }

      run(`find "${r}" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +`);
      run(
        `rsync -a --exclude node_modules --exclude dist --exclude coverage --exclude .DS_Store "${src}/" "${r}/"`
      );

      run(`git add -A`, { cwd: r, silent: true });
      const st = run(`git status --porcelain`, { cwd: r, silent: true });
      if (st.trim()) {
        run(`git commit -m "chore: sync from mern-packages monorepo"`, { cwd: r, silent: true });
      }

      try {
        run(`git branch -M main`, { cwd: r, silent: true });
      } catch {
        /* empty */
      }

      try {
        run(`git push -u origin main`, { cwd: r });
      } catch {
        run(`git pull --rebase origin main`, { cwd: r });
        run(`git push -u origin main`, { cwd: r });
      }

      console.log(`OK [${i + 1}/${workspaces.length}] ${w} -> ${slug}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`FAIL ${w}:`, msg);
      failures.push([w, msg]);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }

    await sleep(120);
  }
}

await main();

if (failures.length) {
  console.error("\nFailed:", failures.length);
  for (const [w, m] of failures) console.error(" ", w, m);
  process.exit(1);
}
