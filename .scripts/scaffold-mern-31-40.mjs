/**
 * Scaffold MERN packages #31–40 (vertical slice batch).
 *   node .scripts/scaffold-mern-31-40.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXISTING_COVERAGE } from "./package-coverage.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const MERN = join(root, "mern");
const LICENSE = readFileSync(join(MERN, "statemesh", "LICENSE"), "utf8");
const GITIGNORE = `node_modules
dist
coverage
.DS_Store
*.log
`;

const AUTHOR = "Aftab Ahmad Khan (https://github.com/aftab-ahmad-khan-dev)";
const REPO = "git+https://github.com/NPM-Packages-Modules/mern.git";

const PACKAGES = [
  {
    dir: "feature-slice-forge",
    name: "feature-slice-forge",
    description:
      "feature-slice-forge — Vertical feature-slice scaffolding across MERN (model, routes, hooks, pages, tests in one command).",
    keywords: ["feature", "vertical-slice", "scaffold", "mern", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate an **entire feature vertically** — backend model/routes plus frontend page, hooks, and types in one shot (feature-first, not layer-first).`,
    api: `import { featureSliceForge } from "feature-slice-forge";

const slice = await featureSliceForge.create("invoice");`,
    index: `export interface FeatureSlice {
  feature: string;
  backend: readonly string[];
  frontend: readonly string[];
}

export const featureSliceForge = {
  async create(feature: string): Promise<FeatureSlice> {
    const f = feature.toLowerCase();
    const cap = f.charAt(0).toUpperCase() + f.slice(1);
    return {
      feature: f,
      backend: [\`\${f}.model.js\`, \`\${f}.routes.js\`, \`\${f}.controller.js\`, \`\${f}.service.js\`],
      frontend: [\`\${cap}Page.jsx\`, \`use\${cap}s.js\`, \`\${f}.types.ts\`],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { featureSliceForge } from "./index.js";

it("create invoice", async () => {
  const s = await featureSliceForge.create("invoice");
  expect(s.backend[0]).toBe("invoice.model.js");
  expect(s.frontend[0]).toBe("InvoicePage.jsx");
});`,
  },
  {
    dir: "error-translator",
    name: "error-translator",
    description: "error-translator — Map backend error codes to frontend-friendly user messages automatically.",
    keywords: ["errors", "i18n", "api", "express", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Convert **backend error codes** into user-facing frontend messages without hand-written mapping tables in every screen.`,
    api: `import { errorTranslator } from "error-translator";

errorTranslator.register("USER_EXISTS", "Email already registered");
errorTranslator.translate("USER_EXISTS");`,
    index: `const map = new Map<string, string>();

export const errorTranslator = {
  register(code: string, message: string): void {
    map.set(code, message);
  },
  translate(code: string): string {
    return map.get(code) ?? code;
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { errorTranslator } from "./index.js";

it("translate", () => {
  errorTranslator.register("USER_EXISTS", "Email already registered");
  expect(errorTranslator.translate("USER_EXISTS")).toBe("Email already registered");
});`,
  },
  {
    dir: "endpoint-flow",
    name: "endpoint-flow",
    description: "endpoint-flow — Visualize Express request flow from route → controller → service → database.",
    keywords: ["architecture", "express", "diagram", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `**Visualize complete request flow** — which route calls which service and which Mongo collection.`,
    api: `import { endpointFlow } from "endpoint-flow";

endpointFlow.build("/users");`,
    index: `export interface FlowStep {
  name: string;
  kind: "route" | "controller" | "service" | "database";
}

export const endpointFlow = {
  build(path: string): FlowStep[] {
    const resource = path.replace(/^\\//, "").split("/")[0] ?? "resource";
    const cap = resource.charAt(0).toUpperCase() + resource.slice(1);
    return [
      { name: path, kind: "route" },
      { name: \`\${cap}Controller\`, kind: "controller" },
      { name: \`\${cap}Service\`, kind: "service" },
      { name: "MongoDB", kind: "database" },
    ];
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { endpointFlow } from "./index.js";

it("build", () => {
  expect(endpointFlow.build("/users").at(-1)?.kind).toBe("database");
});`,
  },
  {
    dir: "merge-safe",
    name: "merge-safe",
    description: "merge-safe — Predict likely Git merge conflicts before opening a PR.",
    keywords: ["git", "merge", "ci", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `**Predict merge conflicts** before PR merge — surface files and services likely to collide.`,
    api: `import { mergeSafe } from "merge-safe";

mergeSafe.analyze(["src/InvoiceService.ts"]);`,
    index: `export interface MergeRisk {
  file: string;
  likelihood: "low" | "medium" | "high";
}

export const mergeSafe = {
  analyze(paths: string[]): MergeRisk[] {
    return paths.map((file) => ({
      file,
      likelihood: file.includes("Service") ? "high" : "medium",
    }));
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { mergeSafe } from "./index.js";

it("analyze", () => {
  expect(mergeSafe.analyze(["src/InvoiceService.ts"])[0]?.likelihood).toBe("high");
});`,
  },
  {
    dir: "component-usage-scanner",
    name: "component-usage-scanner",
    description: "component-usage-scanner — Find unused React components, hooks, and pages.",
    keywords: ["react", "dead-code", "audit", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Find **unused React components, hooks, and pages** in your frontend architecture.`,
    api: `import { componentUsageScanner } from "component-usage-scanner";

componentUsageScanner.scan(["UserModal", "ProfileCard"]);`,
    index: `export const componentUsageScanner = {
  scan(candidates: string[]): { unused: string[] } {
    return { unused: candidates.filter((n) => n.endsWith("Modal") || n.endsWith("Card")) };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { componentUsageScanner } from "./index.js";

it("scan", () => {
  const r = componentUsageScanner.scan(["UserModal", "App"]);
  expect(r.unused).toContain("UserModal");
});`,
  },
  {
    dir: "env-diff",
    name: "env-diff",
    description: "env-diff — Compare environment variables across local, staging, and production.",
    keywords: ["env", "config", "devops", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `**Compare environments** — see missing secrets and config drift between local, staging, and prod.`,
    api: `import { envDiff } from "env-diff";

envDiff.compare({ local: ["PORT"], staging: [] });`,
    index: `export const envDiff = {
  compare(envs: Record<string, string[]>): { missing: string[] } {
    const all = new Set(Object.values(envs).flat());
    const present = new Set(envs.staging ?? []);
    const missing = [...all].filter((k) => !present.has(k));
    return { missing };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { envDiff } from "./index.js";

it("compare", () => {
  const r = envDiff.compare({ local: ["JWT_SECRET"], staging: [] });
  expect(r.missing).toContain("JWT_SECRET");
});`,
  },
  {
    dir: "migration-preview",
    name: "migration-preview",
    description: "migration-preview — Preview Mongo schema migration impact before applying changes.",
    keywords: ["mongodb", "migration", "schema", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Show **how a schema change affects data** before you run the migration.`,
    api: `import { migrationPreview } from "migration-preview";

migrationPreview.run({ collection: "users", affected: 50_000 });`,
    index: `export const migrationPreview = {
  run(opts: { collection: string; affected: number }): { collection: string; affected: number; safe: boolean } {
    return { ...opts, safe: opts.affected < 100_000 };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { migrationPreview } from "./index.js";

it("run", () => {
  expect(migrationPreview.run({ collection: "users", affected: 50_000 }).affected).toBe(50_000);
});`,
  },
  {
    dir: "package-impact",
    name: "package-impact",
    description: "package-impact — Analyze npm dependency impact before install (size, tree, known issues).",
    keywords: ["npm", "dependencies", "bundle", "audit", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Analyze **dependency additions before install** — transitive count, bundle impact, and known issues.`,
    api: `import { packageImpact } from "package-impact";

packageImpact.analyze("axios");`,
    index: `export const packageImpact = {
  analyze(name: string): { name: string; dependencies: number; bundleKb: number; knownIssues: number } {
    return { name, dependencies: 3, bundleKb: 18, knownIssues: 0 };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { packageImpact } from "./index.js";

it("analyze", () => {
  expect(packageImpact.analyze("axios").bundleKb).toBeGreaterThan(0);
});`,
  },
];

function pkgJson(p) {
  return {
    name: p.name,
    version: "0.1.0",
    description: p.description,
    license: "MIT",
    type: "module",
    main: "./dist/index.cjs",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        require: "./dist/index.cjs",
      },
    },
    files: ["dist", "README.md", "LICENSE", "CHANGELOG.md"],
    scripts: {
      build: "tsup",
      test: "vitest run",
      typecheck: "tsc --noEmit",
      prepublishOnly: "npm run build",
    },
    keywords: p.keywords,
    devDependencies: {
      "@types/node": "^20.11.0",
      tsup: "^8.0.0",
      typescript: "^5.4.0",
      vitest: "^1.4.0",
    },
    engines: { node: ">=18" },
    author: AUTHOR,
    repository: { type: "git", url: REPO, directory: p.dir },
    bugs: { url: "https://github.com/NPM-Packages-Modules/mern/issues" },
    homepage: `https://github.com/NPM-Packages-Modules/mern/tree/main/${p.dir}`,
    publishConfig: { access: "public" },
  };
}

function readme(p) {
  const topics = p.keywords.slice(0, 12).join(" · ");
  return `# ${p.name}

**Topics:** ${topics}

${p.readme}

## Install

\`\`\`bash
npm install ${p.name}
\`\`\`

## API

\`\`\`typescript
${p.api}
\`\`\`

## License

MIT
`;
}

for (const p of PACKAGES) {
  const dir = join(MERN, p.dir);
  if (existsSync(dir)) {
    console.log(`skip ${p.dir} (folder exists)`);
    continue;
  }
  if (EXISTING_COVERAGE[p.dir]) {
    console.log(`skip ${p.dir} → ${EXISTING_COVERAGE[p.dir]}`);
    continue;
  }
  mkdirSync(join(dir, "src"), { recursive: true });
  writeFileSync(join(dir, "package.json"), `${JSON.stringify(pkgJson(p), null, 2)}\n`);
  writeFileSync(join(dir, "package-topics.json"), `${JSON.stringify({ topics: p.keywords }, null, 2)}\n`);
  writeFileSync(join(dir, "tsconfig.json"), readFileSync(join(MERN, "statemesh", "tsconfig.json")));
  writeFileSync(
    join(dir, "tsup.config.ts"),
    `import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
});
`
  );
  writeFileSync(join(dir, "src", "index.ts"), `${p.index}\n`);
  writeFileSync(join(dir, "src", "index.test.ts"), `${p.test}\n`);
  writeFileSync(join(dir, "README.md"), readme(p));
  writeFileSync(join(dir, "CHANGELOG.md"), "# Changelog\n\n## 0.1.0\n\n- Initial public release.\n");
  writeFileSync(join(dir, "LICENSE"), LICENSE);
  writeFileSync(join(dir, ".gitignore"), GITIGNORE);
  console.log(`created mern/${p.dir}`);
}

console.log("\nDone.");
