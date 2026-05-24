import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

/** Use real ~/.npmrc — not Cursor sandbox npm cache (causes E404/E401). */
export function npmEnv(extra = {}) {
  const userconfig = join(homedir(), ".npmrc");
  const env = { ...process.env, ...extra, NPM_CONFIG_USERCONFIG: userconfig };
  delete env.npm_config_devdir;
  delete env.NPM_CONFIG_DEVDIR;
  return env;
}

export function assertNpmAuth() {
  const userconfig = join(homedir(), ".npmrc");
  if (!existsSync(userconfig)) {
    console.error(
      "No ~/.npmrc found. Log in first:\n\n  npm login\n  npm whoami\n"
    );
    process.exit(1);
  }

  const r = spawnSync("npm", ["whoami"], {
    encoding: "utf8",
    env: npmEnv(),
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || "").trim();
    console.error(
      "npm is not logged in (token missing or expired).\n\n" +
        `  ${err}\n\n` +
        "Fix:\n" +
        "  npm logout\n" +
        "  npm login\n" +
        "  npm whoami          # must print: mr-aftab-ahmad-khan\n\n" +
        "Or create a Granular Access Token (Publish) at https://www.npmjs.com/settings/tokens\n" +
        "Then: npm login\n"
    );
    process.exit(1);
  }

  const user = r.stdout.trim();
  console.log(`npm auth OK (${user})`);
  return user;
}

export function isAuthError(out) {
  if (/cannot publish over the previously published|version already exists/i.test(out)) {
    return false;
  }
  return /E401|401 Unauthorized|you do not have permission to access/i.test(out);
}

export function is2faRequired(out) {
  return /two-factor|2fa|granular access token with bypass/i.test(out);
}
