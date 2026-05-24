import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("..", import.meta.url)), "flutter");

export function listFlutterPackages() {
  return readdirSync(ROOT)
    .filter((d) => existsSync(join(ROOT, d, "pubspec.yaml")))
    .map((dir) => {
      const pubspec = readFileSync(join(ROOT, dir, "pubspec.yaml"), "utf8");
      const name = pubspec.match(/^name:\s*(\S+)/m)?.[1];
      const version = pubspec.match(/^version:\s*(\S+)/m)?.[1];
      if (!name || !version) throw new Error(`Missing name/version in ${dir}/pubspec.yaml`);
      return { dir, name, version, path: join(ROOT, dir) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
