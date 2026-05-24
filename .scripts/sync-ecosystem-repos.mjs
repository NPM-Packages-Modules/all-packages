/**
 * Push mern/, flutter/, and react-native/ each to one GitHub org repo.
 *
 *   NPM-Packages-Modules/mern
 *   NPM-Packages-Modules/flutter
 *   NPM-Packages-Modules/react-native
 *
 * Usage: node .scripts/sync-ecosystem-repos.mjs [mern|flutter|react-native]
 */

import { execFileSync, execSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
  mkdirSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ORG = "NPM-Packages-Modules";

const ECOSYSTEMS = [
  {
    id: "mern",
    dir: "mern",
    description:
      "MERN npm monorepo — Express, MongoDB, and Node.js packages (@mr-aftab-ahmad-khan/*).",
    topics: ["mern", "merndev", "nodejs", "typescript", "mongodb", "express", "npm-pm", "mern-packages"],
    npmRoot: true,
  },
  {
    id: "react-native",
    dir: "react-native",
    description:
      "React Native npm monorepo — mobile packages (@mr-aftab-ahmad-khan/*).",
    topics: ["react-native", "react", "mobile", "typescript", "merndev", "npm-pm", "mern-packages"],
    npmRoot: true,
  },
  {
    id: "flutter",
    dir: "flutter",
    description: "Flutter / Dart package monorepo — libraries and CLI tools.",
    topics: ["flutter", "dart", "mobile", "pub"],
    npmRoot: false,
  },
];

const filter = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const runList = filter.length
  ? ECOSYSTEMS.filter((e) => filter.includes(e.id))
  : ECOSYSTEMS;

function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: "utf8",
    shell: "/bin/bash",
    stdio: opts.silent ? "pipe" : "inherit",
    cwd: opts.cwd,
  });
}

function ghRepoExists(slug) {
  try {
    execFileSync("gh", ["repo", "view", slug], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function ensureNpmRoot(eco) {
  const base = join(ROOT, eco.dir);
  const pjPath = join(base, "package.json");
  const workspaces = readdirSync(base).filter(
    (n) => n !== "node_modules" && existsSync(join(base, n, "package.json"))
  );
  const rootPkg = {
    name: `@mr-aftab-ahmad-khan/${eco.id}-monorepo`,
    private: true,
    description: eco.description,
    license: "MIT",
    engines: { node: ">=18" },
    workspaces,
    scripts: {
      build: "npm run build --workspaces --if-present",
      test: "npm run test --workspaces --if-present",
      typecheck: "npm run typecheck --workspaces --if-present",
    },
    repository: {
      type: "git",
      url: `git+https://github.com/${ORG}/${eco.id}.git`,
    },
    bugs: { url: `https://github.com/${ORG}/${eco.id}/issues` },
    homepage: `https://github.com/${ORG}/${eco.id}#readme`,
  };
  writeFileSync(pjPath, JSON.stringify(rootPkg, null, 2) + "\n");

  for (const w of workspaces) {
    const pkgPath = join(base, w, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    pkg.repository = {
      type: "git",
      url: `git+https://github.com/${ORG}/${eco.id}.git`,
      directory: w,
    };
    pkg.bugs = { url: `https://github.com/${ORG}/${eco.id}/issues` };
    pkg.homepage = `https://github.com/${ORG}/${eco.id}/tree/main/${w}`;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
}

function setTopics(slug, names) {
  execFileSync("gh", ["api", "--method", "PUT", `repos/${slug}/topics`, "--input", "-"], {
    input: JSON.stringify({ names: names.slice(0, 20) }),
    encoding: "utf8",
    stdio: ["pipe", "inherit", "inherit"],
  });
}

const failures = [];

for (const eco of runList) {
  const src = join(ROOT, eco.dir);
  if (!existsSync(src)) {
    console.error("missing dir", eco.dir);
    failures.push(eco.id);
    continue;
  }

  if (eco.npmRoot) ensureNpmRoot(eco);

  const slug = `${ORG}/${eco.id}`;
  const httpsUrl = `https://github.com/${slug}.git`;
  const tmp = mkdtempSync(join(tmpdir(), `eco-${eco.id}-`));
  const r = join(tmp, "r");

  try {
    if (!ghRepoExists(slug)) {
      console.log("create", slug);
      execFileSync(
        "gh",
        ["repo", "create", slug, "--public", "--description", eco.description],
        { stdio: "inherit" }
      );
    }

    try {
      run(`git clone --depth 1 "${httpsUrl}" "${r}"`, { silent: true });
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
      run(`git commit -m "chore: sync ${eco.id} monorepo from local workspace"`, {
        cwd: r,
        silent: true,
      });
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

    setTopics(slug, eco.topics);
    console.log(`OK https://github.com/${slug}`);
  } catch (err) {
    console.error(`FAIL ${eco.id}:`, err instanceof Error ? err.message : err);
    failures.push(eco.id);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (failures.length) process.exit(1);

try {
  execFileSync("node", [join(ROOT, ".scripts/update-org-repo-descriptions.mjs")], {
    stdio: "inherit",
    cwd: ROOT,
  });
} catch {
  console.warn("WARN: update-org-repo-descriptions failed — run manually");
}
