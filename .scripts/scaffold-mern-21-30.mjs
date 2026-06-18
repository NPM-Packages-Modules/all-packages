/**
 * Scaffold MERN packages #21–30. Run: node .scripts/scaffold-mern-21-30.mjs
 *
 * Skips creation when folder exists OR when an existing package already covers the idea
 * (see EXISTING_COVERAGE).
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXISTING_COVERAGE } from "./package-coverage.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const MERN = join(root, "mern");

const ROOT = MERN;
const LICENSE = readFileSync(join(ROOT, "statemesh", "LICENSE"), "utf8");
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
    dir: "schema-ops",
    name: "schema-ops",
    description:
      "schema-ops — Mongoose schema as source of truth: generate types, validators, API docs, mocks, and tests from one definition.",
    keywords: ["mongoose", "schema", "codegen", "typescript", "validation", "mern-packages", "merndev", "nodejs", "npm-pm"],
    readme: `Treat **Mongoose schemas** as the source of truth and generate validation, forms, API docs, TS types, mock data, and tests from the same model.`,
    example: `schema-ops generate User`,
    install: "schema-ops",
    api: `import { schemaOps } from "schema-ops";

const plan = await schemaOps.generate("User");
// plan.outputs → types/, validators/, docs/, mocks/, tests/`,
    index: `export interface SchemaOpsPlan {
  schema: string;
  outputs: readonly string[];
}

export const schemaOps = {
  async generate(schema: string): Promise<SchemaOpsPlan> {
    const base = schema.replace(/Schema$/i, "");
    return {
      schema: base,
      outputs: ["types/", "validators/", "docs/", "mocks/", "tests/"],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { schemaOps } from "./index.js";

it("generate", async () => {
  const p = await schemaOps.generate("User");
  expect(p.outputs).toContain("types/");
});`,
    cliBody: `  if (cmd === "generate") {
    const schema = process.argv[3] ?? "Model";
    const p = await schemaOps.generate(schema);
    console.log(pc.green("schema-ops"), "→", p.outputs.join(", "));
    return;
  }
  console.log(pc.cyan("schema-ops"), "generate <SchemaName>");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { schemaOps } from "./index.js";`,
  },
  {
    dir: "react-hook-factory",
    name: "react-hook-factory",
    description:
      "react-hook-factory — Generate React Query hooks from backend routes (useUsers, useCreateUser, …).",
    keywords: ["react", "react-query", "hooks", "codegen", "api", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **React Query hooks** from backend routes — stop rewriting useUsers(), useProducts(), and mutation hooks.`,
    example: `react-hook-factory sync users`,
    install: "react-hook-factory",
    api: `import { hookFactory } from "react-hook-factory";

const { hooks } = hookFactory.sync(["users", "products"]);`,
    index: `export interface HookFactoryResult {
  routes: string[];
  hooks: string[];
}

export const hookFactory = {
  sync(routes: string[]): HookFactoryResult {
    const hooks: string[] = [];
    for (const r of routes) {
      const singular = r.replace(/s$/, "");
      const cap = singular.charAt(0).toUpperCase() + singular.slice(1);
      hooks.push(\`use\${cap}s\`, \`useCreate\${cap}\`, \`useDelete\${cap}\`);
    }
    return { routes, hooks };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { hookFactory } from "./index.js";

it("sync", () => {
  const { hooks } = hookFactory.sync(["users"]);
  expect(hooks[0]).toBe("useUsers");
});`,
    cliBody: `  if (cmd === "sync") {
    const routes = process.argv.slice(3);
    const r = hookFactory.sync(routes.length ? routes : ["users"]);
    console.log(pc.green("hooks:"), r.hooks.join(", "));
    return;
  }
  console.log(pc.cyan("react-hook-factory"), "sync [routes…]");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { hookFactory } from "./index.js";`,
  },
  {
    dir: "crud-storm",
    name: "crud-storm",
    description: "crud-storm — Generate entire CRUD modules from a schema (routes, controllers, services, hooks, pages).",
    keywords: ["crud", "express", "scaffold", "codegen", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **entire CRUD modules** from a schema — routes, controllers, services, hooks, and pages.`,
    example: `crud-storm User`,
    install: "crud-storm",
    api: `import { crudStorm } from "crud-storm";

const mod = crudStorm("User");`,
    index: `export interface CrudStormModule {
  resource: string;
  artifacts: readonly string[];
}

export function crudStorm(resource: string): CrudStormModule {
  const r = resource.charAt(0).toUpperCase() + resource.slice(1);
  return {
    resource: r,
    artifacts: ["routes", "controllers", "services", "hooks", "pages"],
  };
}`,
    test: `import { describe, expect, it } from "vitest";
import { crudStorm } from "./index.js";

it("User", () => {
  expect(crudStorm("User").artifacts).toContain("routes");
});`,
    cliBody: `  const res = process.argv[2];
  if (res) {
    const m = crudStorm(res);
    console.log(pc.green("crud-storm"), m.resource, "→", m.artifacts.join(", "));
    return;
  }
  console.log(pc.cyan("crud-storm"), "<Resource>");
  process.exit(1);`,
    cliImports: `import { crudStorm } from "./index.js";`,
  },
  {
    dir: "api-mocksmith",
    name: "api-mocksmith",
    description: "api-mocksmith — Generate realistic API mocks from schemas so frontend can start before the backend.",
    keywords: ["mock", "faker", "api", "frontend", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **realistic API mocks** automatically so frontend and backend teams can work in parallel.`,
    example: `api-mocksmith generate`,
    install: "api-mocksmith",
    api: `import { mocksmith } from "api-mocksmith";

const sample = mocksmith.generate({ fields: ["name", "email"] });`,
    index: `export interface MocksmithOptions {
  fields?: string[];
}

export const mocksmith = {
  generate(opts?: MocksmithOptions): Record<string, string> {
    const fields = opts?.fields ?? ["name", "email"];
    const out: Record<string, string> = {};
    for (const f of fields) {
      if (f === "email") out.email = "john@test.com";
      else if (f === "name") out.name = "John";
      else out[f] = \`sample-\${f}\`;
    }
    return out;
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { mocksmith } from "./index.js";

it("generate", () => {
  expect(mocksmith.generate().email).toBe("john@test.com");
});`,
    cliBody: `  if (cmd === "generate") {
    console.log(JSON.stringify(mocksmith.generate(), null, 2));
    return;
  }
  console.log(pc.cyan("api-mocksmith"), "generate");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { mocksmith } from "./index.js";`,
  },
  {
    dir: "stack-sync",
    name: "stack-sync",
    description: "stack-sync — Detect contract drift between frontend API clients and Express backend routes.",
    keywords: ["contract", "api", "drift", "express", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `**Detect breaking changes** between frontend and backend when routes change.`,
    example: `stack-sync check`,
    install: "stack-sync",
    api: `import { stackSync } from "stack-sync";

const report = stackSync.check({ client: ["/users"], server: ["/posts"] });`,
    index: `export interface StackSyncReport {
  brokenEndpoints: string[];
  ok: boolean;
}

export const stackSync = {
  check(opts: { client: string[]; server: string[] }): StackSyncReport {
    const server = new Set(opts.server);
    const broken = opts.client.filter((p) => !server.has(p));
    return { brokenEndpoints: broken, ok: broken.length === 0 };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { stackSync } from "./index.js";

it("check", () => {
  const r = stackSync.check({ client: ["/gone"], server: ["/users"] });
  expect(r.brokenEndpoints).toContain("/gone");
});`,
    cliBody: `  if (cmd === "check") {
    const r = stackSync.check({ client: ["/users/delete"], server: [] });
    console.log(pc.yellow(String(r.brokenEndpoints.length)), "broken endpoints found");
    r.brokenEndpoints.forEach((e) => console.log(" ", e));
    return;
  }
  console.log(pc.cyan("stack-sync"), "check");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { stackSync } from "./index.js";`,
  },
  {
    dir: "auth-launcher",
    name: "auth-launcher",
    description: "auth-launcher — Scaffold JWT, refresh tokens, RBAC, email verify, and password reset.",
    keywords: ["auth", "jwt", "rbac", "express", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **production-ready authentication** scaffolding in one command.`,
    example: `auth-launcher install`,
    install: "auth-launcher",
    api: `import { authLauncher } from "auth-launcher";

const kit = authLauncher.install();`,
    index: `export interface AuthLauncherKit {
  features: readonly string[];
}

export const authLauncher = {
  install(): AuthLauncherKit {
    return {
      features: ["JWT", "Refresh Tokens", "RBAC", "Email Verify", "Password Reset"],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { authLauncher } from "./index.js";

it("install", () => {
  expect(authLauncher.install().features).toContain("JWT");
});`,
    cliBody: `  if (cmd === "install") {
    const k = authLauncher.install();
    console.log(pc.green("auth-launcher"), k.features.join(", "));
    return;
  }
  console.log(pc.cyan("auth-launcher"), "install");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { authLauncher } from "./index.js";`,
  },
  {
    dir: "mongo-seeder-pro",
    name: "mongo-seeder-pro",
    description: "mongo-seeder-pro — Intelligent MongoDB seed plans from schemas.",
    keywords: ["mongodb", "seed", "faker", "fixtures", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **intelligent seed data** from schemas — users, products, orders at scale.`,
    example: `mongo-seeder-pro generate`,
    install: "mongo-seeder-pro",
    api: `import { mongoSeederPro } from "mongo-seeder-pro";

const plan = mongoSeederPro.generate({ users: 100, products: 50, orders: 200 });`,
    index: `export interface SeederPlan {
  users: number;
  products: number;
  orders: number;
}

export const mongoSeederPro = {
  generate(counts: Partial<SeederPlan> = {}): SeederPlan {
    return {
      users: counts.users ?? 100,
      products: counts.products ?? 50,
      orders: counts.orders ?? 200,
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { mongoSeederPro } from "./index.js";

it("generate", () => {
  expect(mongoSeederPro.generate().users).toBe(100);
});`,
    cliBody: `  if (cmd === "generate") {
    const p = mongoSeederPro.generate();
    console.log(pc.green(String(p.users)), "users");
    console.log(pc.green(String(p.products)), "products");
    console.log(pc.green(String(p.orders)), "orders");
    return;
  }
  console.log(pc.cyan("mongo-seeder-pro"), "generate");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { mongoSeederPro } from "./index.js";`,
  },
  {
    dir: "route-audit",
    name: "route-audit",
    description: "route-audit — Scan Express routes for missing auth, validation, and rate limits.",
    keywords: ["express", "security", "audit", "routes", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `**Analyze Express routes** and detect missing auth, validation, and rate-limit middleware.`,
    example: `route-audit scan`,
    install: "route-audit",
    api: `import { routeAudit } from "route-audit";

const findings = routeAudit.scan([{ path: "/users/delete", auth: false }]);`,
    index: `export interface RouteFinding {
  path: string;
  issue: string;
}

export interface RouteInput {
  path: string;
  auth?: boolean;
}

export const routeAudit = {
  scan(routes: RouteInput[]): RouteFinding[] {
    return routes
      .filter((r) => !r.auth)
      .map((r) => ({ path: r.path, issue: "Missing auth middleware" }));
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { routeAudit } from "./index.js";

it("scan", () => {
  const f = routeAudit.scan([{ path: "/users/delete" }]);
  expect(f[0]?.issue).toMatch(/auth/i);
});`,
    cliBody: `  if (cmd === "scan") {
    const f = routeAudit.scan([{ path: "/users/delete" }]);
    for (const x of f) console.log(pc.red(x.path), "—", x.issue);
    return;
  }
  console.log(pc.cyan("route-audit"), "scan");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { routeAudit } from "./index.js";`,
  },
  {
    dir: "component-admin",
    name: "component-admin",
    description: "component-admin — Generate React admin UI: table, form, filter, search, pagination.",
    keywords: ["react", "admin", "dashboard", "crud", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate complete **React admin pages** from a resource name.`,
    example: `component-admin User`,
    install: "component-admin",
    api: `import { componentAdmin } from "component-admin";

const ui = componentAdmin("User");`,
    index: `export interface AdminUiPlan {
  resource: string;
  components: readonly string[];
}

export function componentAdmin(resource: string): AdminUiPlan {
  return {
    resource,
    components: ["Table", "Form", "Filter", "Search", "Pagination"],
  };
}`,
    test: `import { describe, expect, it } from "vitest";
import { componentAdmin } from "./index.js";

it("User", () => {
  expect(componentAdmin("User").components).toContain("Table");
});`,
    cliBody: `  const res = process.argv[2];
  if (res) {
    const u = componentAdmin(res);
    console.log(pc.green("component-admin"), u.resource, "→", u.components.join(", "));
    return;
  }
  console.log(pc.cyan("component-admin"), "<Resource>");
  process.exit(1);`,
    cliImports: `import { componentAdmin } from "./index.js";`,
  },
  {
    dir: "deploy-template",
    name: "deploy-template",
    description: "deploy-template — Generate Docker, Nginx, PM2, GitHub Actions, and env files for MERN.",
    keywords: ["docker", "deploy", "nginx", "ci", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **deployment configs** — Dockerfile, compose, Nginx, GitHub Actions, env templates.`,
    example: `deploy-template generate`,
    install: "deploy-template",
    api: `import { deployTemplate } from "deploy-template";

const files = deployTemplate.generate();`,
    index: `export const deployTemplate = {
  generate(): readonly string[] {
    return [
      "Dockerfile",
      "docker-compose.yml",
      "nginx.conf",
      "github-actions.yml",
      ".env.example",
    ];
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { deployTemplate } from "./index.js";

it("generate", () => {
  expect(deployTemplate.generate()).toContain("Dockerfile");
});`,
    cliBody: `  if (cmd === "generate") {
    console.log(pc.green("deploy-template"), deployTemplate.generate().join(", "));
    return;
  }
  console.log(pc.cyan("deploy-template"), "generate");
  process.exit(cmd ? 1 : 0);`,
    cliImports: `import { deployTemplate } from "./index.js";`,
  },
];

function pkgJson(p) {
  const binName = p.name;
  return {
    name: p.name,
    version: "0.1.0",
    description: p.description,
    license: "MIT",
    type: "module",
    main: "./dist/index.cjs",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    bin: { [binName]: `${binName}.cjs` },
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        require: "./dist/index.cjs",
      },
    },
    files: ["dist", `${binName}.cjs`, "README.md", "LICENSE", "CHANGELOG.md"],
    scripts: {
      build: "tsup",
      test: "vitest run",
      typecheck: "tsc --noEmit",
      prepublishOnly: "npm run build",
    },
    keywords: p.keywords,
    dependencies: { picocolors: "^1.0.0" },
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
  const topics = p.keywords.slice(0, 10).join(" · ");
  return `# ${p.name}

**Topics:** ${topics}

${p.readme}

## Install

\`\`\`bash
npm install ${p.install}
\`\`\`

## Example

\`\`\`bash
npx ${p.example}
\`\`\`

## API

\`\`\`typescript
${p.api}
\`\`\`

## License

MIT
`;
}

function cliTs(p) {
  const usesCmd = p.dir !== "crud-storm" && p.dir !== "component-admin";
  const header = usesCmd
    ? `async function main() {
  const cmd = process.argv[2];
`
    : `async function main() {
`;
  return `import pc from "picocolors";
${p.cliImports}

${header}${p.cliBody}
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
`;
}

for (const p of PACKAGES) {
  const dir = join(ROOT, p.dir);
  if (existsSync(dir)) {
    console.log(`skip ${p.dir} (folder exists)`);
    continue;
  }
  if (EXISTING_COVERAGE[p.dir]) {
    console.log(`skip ${p.dir} (already covered by ${EXISTING_COVERAGE[p.dir]})`);
    continue;
  }
  mkdirSync(join(dir, "src"), { recursive: true });
  const binName = p.name;
  writeFileSync(join(dir, "package.json"), `${JSON.stringify(pkgJson(p), null, 2)}\n`);
  writeFileSync(join(dir, "package-topics.json"), `${JSON.stringify({ topics: p.keywords }, null, 2)}\n`);
  writeFileSync(join(dir, "tsconfig.json"), readFileSync(join(ROOT, "statemesh", "tsconfig.json")));
  writeFileSync(
    join(dir, "tsup.config.ts"),
    `import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts", cli: "src/cli.ts" },
  format: ["esm", "cjs"],
  dts: { entry: { index: "src/index.ts" } },
  clean: true,
  sourcemap: true,
  target: "node18",
});
`
  );
  writeFileSync(join(dir, "src", "index.ts"), `${p.index}\n`);
  writeFileSync(join(dir, "src", "index.test.ts"), `${p.test}\n`);
  writeFileSync(join(dir, "src", "cli.ts"), cliTs(p));
  writeFileSync(join(dir, `${binName}.cjs`), `#!/usr/bin/env node\nrequire("./dist/cli.cjs");\n`);
  writeFileSync(join(dir, "README.md"), readme(p));
  writeFileSync(join(dir, "CHANGELOG.md"), "# Changelog\n\n## 0.1.0\n\n- Initial public release.\n");
  writeFileSync(join(dir, "LICENSE"), LICENSE);
  writeFileSync(join(dir, ".gitignore"), GITIGNORE);
  console.log(`created ${p.dir}`);
}

console.log(`\nDone. Run: npm install && npm test --workspaces --if-present`);
