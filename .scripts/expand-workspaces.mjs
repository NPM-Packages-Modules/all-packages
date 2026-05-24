import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function expandWorkspaces(patterns, root = ROOT) {
  const out = [];
  for (const w of patterns) {
    if (w.endsWith("/*")) {
      const dir = w.slice(0, -2);
      const base = join(root, dir);
      if (!existsSync(base)) continue;
      for (const name of readdirSync(base)) {
        if (existsSync(join(base, name, "package.json"))) out.push(`${dir}/${name}`);
      }
    } else if (existsSync(join(root, w, "package.json"))) {
      out.push(w);
    }
  }
  return out.sort();
}

export function loadWorkspacePaths(root = ROOT) {
  const patterns = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).workspaces;
  return expandWorkspaces(patterns, root);
}
