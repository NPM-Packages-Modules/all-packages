# Publishing to npm (*)

## The output you see is usually not a build failure

If you see **tsup build success**, **tarball contents**, then an error — the package built fine. The failure is almost always at **upload**:

```
npm error code E429
npm error 429 Too Many Requests - rate limited exceeded
```

npm limits how many publishes you can do per hour/day. Retrying the batch many times makes it worse.

## npm’s ~25 publishes / day limit

Many accounts hit **E429 after ~20–25 new publishes in 24 hours**, even with hours between attempts. Waiting 8 hours is often **not enough** — you need a **full calendar day** with almost no publish traffic, then publish in **small daily batches**.

**You have ~36 published, ~79 still waiting** — plan **~4 days** at 20 packages/day.

## E404 after successful build (your log)

If you see **Build success** + tarball + then:

```text
npm error code E404
npm error 404 ... adminforge ... could not be found or you do not have permission
```

That is almost always **npm not logged in** or an **expired token** — not a missing package. npm often returns 404 instead of 401.

Logs under `cursor-sandbox-cache` mean the wrong npm config was used.

**Fix — run in macOS Terminal.app:**

```bash
cd ~/Github/Personal/NPM
npm logout
npm login
npm run publish:check-auth    # must print: npm auth OK (mr-aftab-ahmad-khan)

bash .scripts/publish-daily.sh
# or: npm run publish:daily:local
```

## Fix: daily batches + fresh login

1. **Stop** any running publish scripts.
2. **Rotate login** (fixes misleading `user undefined` on E429):
   ```bash
   npm logout
   npm login
   npm whoami   # must show: mr-aftab-ahmad-khan
   ```
   Or create a **Granular Access Token** at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) with **Publish** permission and run `npm login` again.
3. After **24h** with no publishes, test **one** package:

```bash
cd mern/versionpress
npm publish --access public
```

4. If that works, publish **at most 20 per day**:

```bash
npm run publish:daily
# or:
NPM_PUBLISH_DAILY_LIMIT=20 NPM_PUBLISH_GAP_SEC=300 npm run publish:daily
```

Repeat **once per day** until `npm run publish:status` shows 0 need publish.

5. Still E429 after 24h? Open [npmjs.com/support](https://www.npmjs.com/support) — mention scoped publishes to `*` and E429 with `user undefined`.

## Monorepo paths

Workspaces live under `mern/<name>` and `react-native/<name>`, not the repo root.

```bash
# Correct
node .scripts/publish-unpublished.mjs mern/versionpress

# Also works (short name)
node .scripts/publish-unpublished.mjs versionpress
```

## E403 — 2FA required to publish

If you see:

```text
403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required
```

`npm login` in the browser is **read-only** for many accounts; **publish** needs:

**Option A (recommended for 20/day batch):** Granular Access Token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens):

- Permissions: **Publish**
- Enable **Bypass 2FA** (automation)
- Then: `npm logout` → `npm login` → paste token when asked for password

**Option B (single package):** Authenticator OTP:

```bash
cd mern/adminforge
npm publish --access public --otp=123456
```

OTP expires quickly — not ideal for 20-package batch without Option A.

## Check status

```bash
npm run publish:status
npm view versionpress version   # 404 = not published yet
```

## `devdir` warning

`npm warn Unknown env config "devdir"` comes from the environment (Cursor), not your package. Safe to ignore, or unset `npm_config_devdir` in your shell.
