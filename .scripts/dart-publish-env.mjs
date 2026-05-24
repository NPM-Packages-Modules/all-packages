import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

const DEFAULT_FLUTTER_ROOT = join(homedir(), ".flutter-sdk");

function resolveBin(name) {
  const flutterRoot = process.env.FLUTTER_ROOT || DEFAULT_FLUTTER_ROOT;
  const inFlutter = join(flutterRoot, "bin", name);
  if (existsSync(inFlutter)) return inFlutter;

  const r = spawnSync("command", ["-v", name], {
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "ignore"],
  });
  const fromPath = r.stdout?.trim().split("\n")[0];
  return fromPath || name;
}

export function dartEnv(extra = {}) {
  const flutterRoot = process.env.FLUTTER_ROOT || DEFAULT_FLUTTER_ROOT;
  const bin = join(flutterRoot, "bin");
  const path = existsSync(bin) ? `${bin}:${process.env.PATH || ""}` : process.env.PATH || "";
  return {
    ...process.env,
    ...extra,
    FLUTTER_ROOT: flutterRoot,
    PATH: path,
    CI: "true",
    PUB_HOSTED_URL: process.env.PUB_HOSTED_URL || "https://pub.dev",
  };
}

export function dartBin() {
  return resolveBin("dart");
}

export function flutterBin() {
  return resolveBin("flutter");
}

export function assertDartSdk() {
  const flutter = flutterBin();
  const r = spawnSync(flutter, ["--version"], {
    encoding: "utf8",
    env: dartEnv(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (r.status !== 0) {
    console.error(
      "Flutter/Dart SDK not found.\n\n" +
        "Install without Xcode (pub publish only):\n" +
        "  bash .scripts/install-flutter-sdk.sh\n\n" +
        "Then add to ~/.zshrc:\n" +
        "  export FLUTTER_ROOT=$HOME/.flutter-sdk\n" +
        "  export PATH=\"$FLUTTER_ROOT/bin:$PATH\"\n"
    );
    process.exit(1);
  }
  const line = (r.stdout || r.stderr || "").split("\n").find((l) => /Flutter|Dart/.test(l))?.trim();
  console.log(`dart sdk OK${line ? ` (${line})` : ""}`);
}

function hasPubToken() {
  const credPath = join(homedir(), ".config", "dart", "pub-credentials.json");
  if (!existsSync(credPath)) return false;
  try {
    const raw = readFileSync(credPath, "utf8");
    return /pub\.dev|pub-dev/i.test(raw);
  } catch {
    return false;
  }
}

export function assertDartAuth() {
  assertDartSdk();

  if (!hasPubToken()) {
    console.error(
      "No pub.dev upload token found (~/.config/dart/pub-credentials.json).\n\n" +
        "Create one: https://pub.dev → Account → Uploaders → Create token\n\n" +
        "Then run once:\n" +
        "  dart pub token add https://pub.dev\n" +
        "  (paste token when prompted)\n\n" +
        "Or non-interactive:\n" +
        "  printf '%s' \"$PUB_DEV_PUBLISH_TOKEN\" | dart pub token add https://pub.dev\n"
    );
    process.exit(1);
  }

  const r = spawnSync(dartBin(), ["pub", "token", "list"], {
    encoding: "utf8",
    env: dartEnv(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  const out = `${r.stdout || ""}${r.stderr || ""}`;
  if (!/pub\.dev/i.test(out) && r.status !== 0) {
    console.error("pub.dev token missing or invalid. Run: dart pub token add https://pub.dev\n");
    process.exit(1);
  }
  console.log("pub.dev auth OK");
}

export function isPubAuthError(out) {
  return /403|401|unauthorized|not authorized|uploader|permission denied/i.test(out);
}

export function isPubRateLimit(out) {
  return /429|too many requests|rate limit/i.test(out);
}

export function isAlreadyPublished(out) {
  return /version already exists|already.*published|duplicate/i.test(out);
}
