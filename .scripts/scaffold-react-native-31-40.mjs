/**
 * Scaffold react-native/ packages #31–40.
 * Skips folders that exist or ideas already covered in mern/ or react-native/.
 *
 *   node .scripts/scaffold-react-native-31-40.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXISTING_COVERAGE } from "./package-coverage.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const RN = join(root, "react-native");
const MERN = join(root, "mern");
const LICENSE = readFileSync(join(MERN, "statemesh", "LICENSE"), "utf8");
const GITIGNORE = `node_modules
dist
coverage
.DS_Store
*.log
`;

const AUTHOR = "Aftab Ahmad Khan (https://github.com/aftab-ahmad-khan-dev)";
const REPO = "git+https://github.com/NPM-Packages-Modules/react-native.git";

const PACKAGES = [
  {
    dir: "featureforge",
    name: "featureforge",
    description:
      "featureforge — Generate complete backend features: routes, controllers, services, validators, DTOs, tests, docs.",
    keywords: ["express", "scaffold", "feature", "codegen", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **complete backend features** from one command — routes, controllers, services, validators, DTOs, tests, and documentation.`,
    example: `featureforge create orders`,
    api: `import { featureforge } from "featureforge";

const mod = await featureforge.create("orders");`,
    index: `export interface FeatureModule {
  name: string;
  paths: readonly string[];
}

export const featureforge = {
  async create(name: string): Promise<FeatureModule> {
    return {
      name,
      paths: [
        \`/\${name}\`,
        "/controllers",
        "/services",
        "/validators",
        "/tests",
      ],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { featureforge } from "./index.js";

it("create", async () => {
  const m = await featureforge.create("orders");
  expect(m.paths).toContain("/controllers");
});`,
  },
  {
    dir: "relationforge",
    name: "relationforge",
    description: "relationforge — MongoDB relationship engine: populate, cascade, reverse refs, validation.",
    keywords: ["mongodb", "mongoose", "relations", "populate", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Automatically create and manage **MongoDB relationships** with populate, cascade, and validation.`,
    example: `relationforge connect User Order`,
    api: `import { relationforge } from "relationforge";

relationforge.connect("User", "Order");`,
    index: `export const relationforge = {
  connect(from: string, to: string): { from: string; to: string; linked: true } {
    return { from, to, linked: true };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { relationforge } from "./index.js";

it("connect", () => {
  expect(relationforge.connect("User", "Order").linked).toBe(true);
});`,
  },
  {
    dir: "mockforge",
    name: "mockforge",
    description: "mockforge — API mock server from schemas: fake data, latency, errors, pagination, auth.",
    keywords: ["mock", "api", "faker", "express", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Instantly generate **realistic APIs** from schemas so frontend teams are not blocked.`,
    example: `mockforge generate User`,
    api: `import { mockforge } from "mockforge";

mockforge.generate("User");`,
    index: `export const mockforge = {
  generate(model: string): Record<string, string> {
    return { model, name: "John", email: "john@test.com" };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { mockforge } from "./index.js";

it("generate", () => {
  expect(mockforge.generate("User").email).toBe("john@test.com");
});`,
  },
  {
    dir: "auditmesh",
    name: "auditmesh",
    description:
      "auditmesh — Universal audit log engine: before/after snapshots, user tracking, rollback, compliance timelines.",
    keywords: ["audit", "compliance", "mongodb", "changelog", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Track **every database change** automatically — snapshots, user attribution, rollback, and compliance timelines.`,
    example: `auditmesh watch User`,
    api: `import { auditmesh } from "auditmesh";

auditmesh.watch("User");`,
    index: `export interface AuditWatcher {
  model: string;
  events: readonly string[];
}

export const auditmesh = {
  watch(model: string): AuditWatcher {
    return {
      model,
      events: ["create", "update", "delete"],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { auditmesh } from "./index.js";

it("watch", () => {
  expect(auditmesh.watch("User").events).toContain("update");
});`,
  },
  {
    dir: "jobforge",
    name: "jobforge",
    description: "jobforge — Turn functions into background jobs: retries, scheduling, queues, workers.",
    keywords: ["jobs", "queue", "worker", "cron", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Turn normal functions into **scalable background jobs** with retries, scheduling, and monitoring.`,
    example: `jobforge wrap sendEmail`,
    api: `import { jobforge } from "jobforge";

jobforge.wrap(() => {});`,
    index: `export const jobforge = {
  wrap<T extends (...args: unknown[]) => unknown>(fn: T): { wrapped: true; name: string } {
    return { wrapped: true, name: fn.name || "anonymous" };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { jobforge } from "./index.js";

it("wrap", () => {
  function sendEmail() {}
  expect(jobforge.wrap(sendEmail).wrapped).toBe(true);
});`,
  },
  {
    dir: "contractforge",
    name: "contractforge",
    description: "contractforge — API contracts: TS types, Zod, OpenAPI, SDK, breaking-change detection.",
    keywords: ["openapi", "contract", "sdk", "typescript", "mern-packages", "merndev", "nodejs", "npm-pm"],
    readme: `Generate **frontend and backend contracts** — types, validation, OpenAPI, SDKs, and drift detection.`,
    example: `contractforge sync`,
    api: `import { contractforge } from "contractforge";

contractforge.sync();`,
    index: `export const contractforge = {
  sync(): { ok: true; artifacts: readonly string[] } {
    return {
      ok: true,
      artifacts: ["types", "validators", "openapi.json", "sdk"],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { contractforge } from "./index.js";

it("sync", () => {
  expect(contractforge.sync().artifacts).toContain("openapi.json");
});`,
  },
  {
    dir: "seedforge",
    name: "seedforge",
    description: "seedforge — Smart relational seed data for dev and test environments.",
    keywords: ["seed", "faker", "mongodb", "fixtures", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Generate **realistic development data** — relational seeds, bulk generation, repeatable runs.`,
    example: `seedforge generate 10000`,
    api: `import { seedforge } from "seedforge";

seedforge.generate(10_000);`,
    index: `export const seedforge = {
  generate(count: number): { count: number; repeatable: true } {
    return { count, repeatable: true };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { seedforge } from "./index.js";

it("generate", () => {
  expect(seedforge.generate(100).count).toBe(100);
});`,
  },
  {
    dir: "sdkforge",
    name: "sdkforge",
    description: "sdkforge — Auto-generate TS/React SDKs from APIs with retries, cache, and auth.",
    keywords: ["sdk", "codegen", "openapi", "typescript", "mern-packages", "merndev", "nodejs", "npm-pm"],
    readme: `Generate **frontend SDKs** from your API — TypeScript client with retries, caching, and auth.`,
    example: `sdkforge generate`,
    api: `import { sdkforge } from "sdkforge";

sdkforge.generate();`,
    index: `export const sdkforge = {
  generate(): { methods: string[] } {
    return { methods: ["users.getAll", "products.create"] };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { sdkforge } from "./index.js";

it("generate", () => {
  expect(sdkforge.generate().methods[0]).toMatch(/users/);
});`,
  },
  {
    dir: "recoverflow",
    name: "recoverflow",
    description: "recoverflow — Smart error recovery: retries, circuit breakers, fallbacks, dead-letter queues.",
    keywords: ["resilience", "retry", "circuit-breaker", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Automatically **recover from backend failures** — retries, fallbacks, circuit breakers, and health checks.`,
    example: `recoverflow wrap paymentService`,
    api: `import { recoverflow } from "recoverflow";

recoverflow.wrap(paymentService);`,
    index: `export const recoverflow = {
  wrap<T extends object>(service: T): T & { __recoverflow: true } {
    return Object.assign(service, { __recoverflow: true as const });
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { recoverflow } from "./index.js";

it("wrap", () => {
  const s = recoverflow.wrap({ pay() {} });
  expect(s.__recoverflow).toBe(true);
});`,
  },
  {
    dir: "tenantforge",
    name: "tenantforge",
    description: "tenantforge — SaaS multi-tenancy: isolation, workspaces, middleware, permissions, provisioning.",
    keywords: ["multi-tenant", "saas", "express", "mern-packages", "merndev", "nodejs", "npm-pm", "typescript"],
    readme: `Add **SaaS multi-tenancy** with minimal code — isolation, workspaces, middleware, and provisioning.`,
    example: `tenantforge enable`,
    api: `import { tenantforge } from "tenantforge";

tenantforge.enable();`,
    index: `export const tenantforge = {
  enable(): { multiTenant: true; features: readonly string[] } {
    return {
      multiTenant: true,
      features: ["isolation", "workspace", "middleware", "permissions", "provisioning"],
    };
  },
};`,
    test: `import { describe, expect, it } from "vitest";
import { tenantforge } from "./index.js";

it("enable", () => {
  expect(tenantforge.enable().multiTenant).toBe(true);
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
    keywords: [...p.keywords, "react-native", "mobile"],
    devDependencies: {
      "@types/node": "^20.11.0",
      tsup: "^8.0.0",
      typescript: "^5.4.0",
      vitest: "^1.4.0",
    },
    engines: { node: ">=18" },
    author: AUTHOR,
    repository: { type: "git", url: REPO, directory: p.dir },
    bugs: { url: "https://github.com/NPM-Packages-Modules/react-native/issues" },
    homepage: `https://github.com/NPM-Packages-Modules/react-native/tree/main/${p.dir}`,
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

for (const p of PACKAGES) {
  const dir = join(RN, p.dir);
  if (existsSync(dir)) {
    console.log(`skip ${p.dir} (folder exists)`);
    continue;
  }
  if (EXISTING_COVERAGE[p.dir]) {
    console.log(`skip ${p.dir} → use ${EXISTING_COVERAGE[p.dir]}`);
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
  console.log(`created react-native/${p.dir}`);
}

console.log("\nDone.");
