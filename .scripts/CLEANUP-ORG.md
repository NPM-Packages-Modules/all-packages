# Clean up NPM-Packages-Modules org (118 → 4 repos)

**Archive** keeps repos on the org page as “Public archive” (what you see now).

**Delete** removes them from the list entirely. Only these stay:

- `mern`
- `react-native`
- `flutter`
- `mern-packages` (optional — delete if you only want 3)
- ~~`duoapi-test-delete`~~ (test junk — delete)

## One-time: grant delete permission

In your terminal (not Cursor sandbox):

```bash
gh auth refresh -h github.com -s delete_repo
```

Complete the browser login when prompted.

## Delete all duplicate package repos

```bash
cd /path/to/NPM
node .scripts/delete-legacy-repos.mjs --dry-run   # preview
node .scripts/delete-legacy-repos.mjs --yes       # deletes ~113 repos
```

## Verify

```bash
gh repo list NPM-Packages-Modules --json name,isArchived
```

You should see **4–5** repos, not 106.
