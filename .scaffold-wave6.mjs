import { writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname);

const stdTsconfig = JSON.stringify(
  {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "Bundler",
      lib: ["ES2022"],
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      noUncheckedIndexedAccess: true,
      resolveJsonModule: true,
      isolatedModules: true,
      outDir: "dist",
    },
    include: ["src/**/*"],
  },
  null,
  2
);

const stdTsup = `import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
});
`;

const cliTsup = `import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts", cli: "src/cli.ts" },
  format: ["esm", "cjs"],
  dts: { entry: { index: "src/index.ts" } },
  clean: true,
  sourcemap: true,
  target: "node18",
});
`;

function pkgJson(p) {
  const repo = `git+https://github.com/NPM-Packages-Modules/${p.name}.git`;
  const base = {
    name: `@mr-aftab-ahmad-khan/${p.name}`,
    version: "0.1.0",
    description: p.desc,
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
    author: "Aftab Ahmad Khan (https://github.com/aftab-ahmad-khan-dev)",
    repository: { type: "git", url: repo },
    bugs: { url: `https://github.com/NPM-Packages-Modules/${p.name}/issues` },
    homepage: `https://github.com/NPM-Packages-Modules/${p.name}#readme`,
    publishConfig: { access: "public" },
  };

  if (p.bin) {
    base.bin = { [p.name]: `${p.name}.cjs` };
    base.files = ["dist", `${p.name}.cjs`, "README.md", "LICENSE", "CHANGELOG.md"];
    base.dependencies = { picocolors: "^1.0.0" };
  }
  if (p.deps?.length) {
    base.dependencies = base.dependencies ?? {};
    for (const d of p.deps) {
      const [n, v] = d.split("@");
      base.dependencies[n] = v ? `^${v}` : "^1.0.0";
    }
  }
  if (p.express) {
    base.peerDependencies = { ...(base.peerDependencies ?? {}), express: "^4.0.0 || ^5.0.0" };
    base.peerDependenciesMeta = { ...(base.peerDependenciesMeta ?? {}), express: { optional: true } };
    base.devDependencies["@types/express"] = "^4.17.21";
    base.devDependencies.express = "^4.19.2";
  }
  if (p.zod) {
    base.dependencies = { ...(base.dependencies ?? {}), zod: "^3.23.8" };
  }
  return JSON.stringify(base, null, 2);
}

const readme = (title, body) => `# ${title}\n\n${body}\n\n## License\n\nMIT\n`;

const pkgs = [
  {
    name: "duoapi",
    desc: "duoapi — Dual API engine: define one resource graph and emit REST route stubs plus GraphQL SDL + resolver map skeletons from the same metadata.",
    keywords: ["graphql", "rest", "api", "merndev", "typescript"],
    zod: true,
  },
  {
    name: "relaforge",
    desc: "relaforge — Mongo relationship resolver utilities: safe populate paths, cycle guards, and lean join hints.",
    keywords: ["mongodb", "mongoose", "populate", "relations", "merndev", "typescript"],
  },
  {
    name: "sdkpress",
    desc: "sdkpress — Universal backend SDK generator CLI: minimal typed fetch client from OpenAPI 3 paths (`npx sdkpress generate`).",
    keywords: ["sdk", "openapi", "cli", "react", "merndev", "typescript"],
    bin: true,
  },
  {
    name: "cronmesh",
    desc: "cronmesh — Human-friendly cron-style task registry with named schedules, timezone labels, and async runner glue.",
    keywords: ["cron", "scheduler", "jobs", "merndev", "typescript"],
  },
  {
    name: "schemagen",
    desc: "schemagen — DTO + contract helpers: reflect Zod object keys to field specs and JSON-Schema-compatible shape summaries.",
    keywords: ["zod", "dto", "schema", "validation", "merndev", "typescript"],
    zod: true,
  },
  {
    name: "ctrlflow",
    desc: "ctrlflow — Controller composer: stack Express middleware + handler factories for CRUD/search/upload style endpoints.",
    keywords: ["express", "controller", "middleware", "merndev", "typescript"],
    express: true,
  },
  {
    name: "pageforge",
    desc: "pageforge — API pagination engine: cursor encode/decode + offset windows for infinite scroll and stable ordering.",
    keywords: ["pagination", "cursor", "api", "merndev", "typescript"],
  },
  {
    name: "transactly",
    desc: "transactly — Mongo transaction helper: retry wrapper and session callback typing (bring your own `startSession`).",
    keywords: ["mongodb", "transactions", "retry", "merndev", "typescript"],
  },
  {
    name: "guardpress",
    desc: "guardpress — Route protection composer: role predicates, ownership matchers, and stacked Express guards.",
    keywords: ["express", "auth", "rbac", "middleware", "merndev", "typescript"],
    express: true,
  },
  {
    name: "serviceforge",
    desc: "serviceforge — Service layer generator core: typed service shell with CRUD method slots and event hooks.",
    keywords: ["service", "layer", "architecture", "merndev", "typescript"],
  },
  {
    name: "lesscode",
    desc: "lesscode — Boilerplate reducer CLI: scan Express-style files and report route/middleware density (`npx lesscode analyze`).",
    keywords: ["cli", "boilerplate", "express", "merndev", "typescript"],
    bin: true,
  },
  {
    name: "retrystack",
    desc: "retrystack — Retry infrastructure: exponential backoff, jitter, max delay, and classify retryable errors.",
    keywords: ["retry", "backoff", "resilience", "merndev", "typescript"],
  },
  {
    name: "modstack",
    desc: "modstack — Dynamic module loader: discover and import plugin modules from a directory with simple hooks.",
    keywords: ["modules", "plugins", "dynamic-import", "merndev", "typescript"],
  },
  {
    name: "searchforge",
    desc: "searchforge — Mongo search helpers: Atlas-style text clauses, fuzzy regex, and safe term escaping.",
    keywords: ["mongodb", "search", "full-text", "merndev", "typescript"],
  },
  {
    name: "uploadflow",
    desc: "uploadflow — Upload processor pipeline: size/MIME steps and cloud-friendly staged handlers.",
    keywords: ["upload", "multipart", "validation", "merndev", "typescript"],
  },
  {
    name: "workerforge",
    desc: "workerforge — Background worker registry: named processors, retries, and simple in-process dispatch.",
    keywords: ["worker", "queue", "jobs", "merndev", "typescript"],
  },
  {
    name: "hookretry",
    desc: "hookretry — Webhook retry + replay ledger: attempt tracking, backoff schedule, and dead-letter handoff.",
    keywords: ["webhook", "retry", "reliability", "merndev", "typescript"],
  },
  {
    name: "pipeguard",
    desc: "pipeguard — Request validation pipeline: chain Zod parses, sanitizers, and Express middleware from one definition.",
    keywords: ["express", "validation", "zod", "pipeline", "merndev", "typescript"],
    express: true,
    zod: true,
  },
  {
    name: "eventforge",
    desc: "eventforge — Event-driven backend helper: attach a typed bus to Express and bridge HTTP + domain emits.",
    keywords: ["events", "express", "bus", "merndev", "typescript"],
    express: true,
  },
  {
    name: "routeblocks",
    desc: "routeblocks — API composition router: fluent blocks for auth, CRUD shells, and upload wiring on Express Router.",
    keywords: ["express", "router", "composition", "merndev", "typescript"],
    express: true,
  },
  {
    name: "cacheforge",
    desc: "cacheforge — Cache layer helpers: key builders, TTL envelopes, and tag-based invalidation sketches.",
    keywords: ["cache", "redis", "ttl", "merndev", "typescript"],
  },
  {
    name: "apilifecycle",
    desc: "apilifecycle — API lifecycle manager: sunset headers, version gates, and deprecation warnings for Express routes.",
    keywords: ["express", "deprecation", "versioning", "merndev", "typescript"],
    express: true,
  },
  {
    name: "queueflow",
    desc: "queueflow — Queue-to-workflow bridge: map queue job names to async handlers with pluggable retry.",
    keywords: ["queue", "workflow", "jobs", "merndev", "typescript"],
  },
  {
    name: "plugstack",
    desc: "plugstack — Backend plugin system: register plugins with init/teardown hooks and shared context.",
    keywords: ["plugins", "architecture", "node", "merndev", "typescript"],
  },
  {
    name: "midflow",
    desc: "midflow — Middleware composer: flatten Express middleware chains with optional error boundary.",
    keywords: ["express", "middleware", "composition", "merndev", "typescript"],
    express: true,
  },
  {
    name: "statemesh",
    desc: "statemesh — Backend state machine: explicit transitions, enter/exit hooks, and async guards.",
    keywords: ["state-machine", "workflow", "merndev", "typescript"],
  },
  {
    name: "testforge",
    desc: "testforge — Testing scaffolding CLI: emit starter Vitest API test files (`npx testforge generate`).",
    keywords: ["testing", "vitest", "cli", "merndev", "typescript"],
    bin: true,
  },
  {
    name: "dbflow",
    desc: "dbflow — Database access layer interface: repository façade for find/save/delete with optional hooks.",
    keywords: ["mongodb", "repository", "dal", "merndev", "typescript"],
  },
  {
    name: "metricpress",
    desc: "metricpress — API analytics middleware: per-route timings, status counters, and pluggable sinks for Express.",
    keywords: ["metrics", "express", "observability", "merndev", "typescript"],
    express: true,
  },
  {
    name: "configforge",
    desc: "configforge — Centralized config management: merge layers (env, JSON) and validate with Zod.",
    keywords: ["config", "env", "zod", "merndev", "typescript"],
    zod: true,
  },
  {
    name: "docstack",
    desc: "docstack — Backend documentation CLI: summarize workspace packages or emit stub architecture markdown (`npx docstack generate`).",
    keywords: ["docs", "markdown", "cli", "merndev", "typescript"],
    bin: true,
  },
  {
    name: "lockmesh",
    desc: "lockmesh — Distributed lock helper: in-memory + interface for Redis locks with TTL and `withLock` patterns.",
    keywords: ["lock", "redis", "concurrency", "merndev", "typescript"],
  },
];

const sources = {
  duoapi: `import type { ZodObject, ZodRawShape } from "zod";
import { z } from "zod";

export interface DualResourceMeta<T extends ZodObject<ZodRawShape>> {
  name: string;
  schema: T;
}

/** Build SDL stub and REST path stub from a Zod object resource. */
export function duoapi<T extends ZodObject<ZodRawShape>>(meta: DualResourceMeta<T>) {
  const fields = Object.keys(meta.schema.shape);
  const sdl = \`type \${meta.name} {\\n\${fields.map((f) => \`  \${f}: String\`).join("\\n")}\\n}\\n\\n type Query { \${meta.name.toLowerCase()}_by_id(id: ID!): \${meta.name} }\`;
  const restBase = \`/api/\${meta.name.toLowerCase()}s\`;
  return { graphqlSDL: sdl, restBase, fields, schema: meta.schema };
}

export { z };
`,
  duoapiTest: `import { describe, expect, it } from "vitest";
import { z } from "zod";
import { duoapi } from "./index.js";

describe("duoapi", () => {
  it("emits sdl and rest base", () => {
    const u = duoapi({ name: "User", schema: z.object({ email: z.string() }) });
    expect(u.restBase).toBe("/api/users");
    expect(u.graphqlSDL).toContain("type User");
  });
});
`,

  relaforge: `/** Build mongoose-style populate path with simple cycle guard (repeated segment). */
export function relaforgePaths(paths: string[], maxDepth = 5): string[] {
  const out: string[] = [];
  for (const p of paths) {
    const segs = p.split(".").filter(Boolean);
    if (segs.length > maxDepth) continue;
    const seen = new Set<string>();
    let bad = false;
    for (const s of segs) {
      if (seen.has(s)) {
        bad = true;
        break;
      }
      seen.add(s);
    }
    if (!bad) out.push(segs.join("."));
  }
  return out;
}

export function relaforgeNest(parent: string, child: string): string {
  return \`\${parent}.\${child}\`;
}
`,
  relaforgeTest: `import { describe, expect, it } from "vitest";
import { relaforgeNest, relaforgePaths } from "./index.js";

describe("relaforge", () => {
  it("drops cyclic populate hints", () => {
    expect(relaforgePaths(["a.b", "a.a.b"])).toEqual(["a.b"]);
  });
  it("nest", () => expect(relaforgeNest("user", "posts")).toBe("user.posts"));
});
`,

  sdkpress: `export function generateSdkSnippet(baseUrl: string, paths: string[]): string {
  const lines = paths.map(
    (p) => \`export async function api_\${p.replace(/[^a-zA-Z0-9]+/g, "_")}(init?: RequestInit) { return fetch(new URL("\${p}", "\${baseUrl}"), init); }\`
  );
  return ["/** sdkpress generated */", ...lines].join("\\n");
}
`,
  sdkpressCli: `import pc from "picocolors";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateSdkSnippet } from "./index.js";

async function main() {
  const [, , cmd, file, out] = process.argv;
  if (cmd === "generate" && file) {
    const raw = JSON.parse(await readFile(resolve(file), "utf8")) as { paths?: Record<string, unknown> };
    const pathKeys = raw.paths ? Object.keys(raw.paths) : [];
    const code = generateSdkSnippet("http://localhost:3000", pathKeys);
    const target = resolve(out ?? "sdkpress.client.ts");
    await writeFile(target, code, "utf8");
    console.log(pc.green("Wrote"), target);
    return;
  }
  console.log(pc.cyan("sdkpress"), "generate <openapi.json> [out.ts]");
  process.exit(cmd ? 1 : 0);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
`,
  sdkpressTest: `import { describe, expect, it } from "vitest";
import { generateSdkSnippet } from "./index.js";

describe("sdkpress", () => {
  it("generateSdkSnippet contains paths", () => {
    const s = generateSdkSnippet("http://x/", ["/users"]);
    expect(s).toContain("/users");
  });
});
`,

  cronmesh: `export type CronTask = () => void | Promise<void>;

export interface CronRegistration {
  name: string;
  schedule: "daily" | "hourly" | "manual";
  timezone?: string;
  run: CronTask;
}

export class CronMesh {
  private readonly tasks: CronRegistration[] = [];

  daily(name: string, run: CronTask, timezone?: string): this {
    this.tasks.push({ name, schedule: "daily", timezone, run });
    return this;
  }

  hourly(name: string, run: CronTask): this {
    this.tasks.push({ name, schedule: "hourly", run });
    return this;
  }

  list(): readonly CronRegistration[] {
    return this.tasks;
  }
}

export function cronmesh(): CronMesh {
  return new CronMesh();
}
`,
  cronmeshTest: `import { describe, expect, it } from "vitest";
import { cronmesh } from "./index.js";

describe("cronmesh", () => {
  it("registers schedules", () => {
    const c = cronmesh().daily("reports", async () => {});
    expect(c.list()[0]?.schedule).toBe("daily");
  });
});
`,

  schemagen: `import type { ZodObject, ZodRawShape } from "zod";

export interface FieldSpec {
  key: string;
  zodType: string;
}

export function schemagenFields(schema: ZodObject<ZodRawShape>): FieldSpec[] {
  return Object.entries(schema.shape).map(([key, z]) => ({
    key,
    zodType: (z as { _def?: { typeName?: string } })._def?.typeName ?? "unknown",
  }));
}

export function schemagenDtoInterface(schema: ZodObject<ZodRawShape>, name = "Dto"): string {
  const fields = schemagenFields(schema);
  const body = fields.map((f) => \`  \${f.key}: unknown;\`).join("\\n");
  return \`export interface \${name} {\\n\${body}\\n}\\n\`;
}
`,
  schemagenTest: `import { describe, expect, it } from "vitest";
import { z } from "zod";
import { schemagenDtoInterface, schemagenFields } from "./index.js";

describe("schemagen", () => {
  it("reflects zod object", () => {
    const s = z.object({ id: z.string() });
    expect(schemagenFields(s)[0]?.key).toBe("id");
    expect(schemagenDtoInterface(s, "User")).toContain("interface User");
  });
});
`,

  ctrlflow: `import type { RequestHandler, Router } from "express";
import { Router as R } from "express";

export class CtrlFlow {
  private readonly stack: RequestHandler[] = [];

  use(...mw: RequestHandler[]): this {
    this.stack.push(...mw);
    return this;
  }

  /** Attach stacked handlers, then optional setup */
  mount(router: Router, setup?: (r: Router) => void): Router {
    for (const m of this.stack) router.use(m);
    setup?.(router);
    return router;
  }

  /** Fresh router with this stack */
  toRouter(setup?: (r: Router) => void): Router {
    return this.mount(R(), setup);
  }
}

export function ctrlflow(): CtrlFlow {
  return new CtrlFlow();
}
`,
  ctrlflowTest: `import { describe, expect, it } from "vitest";
import { ctrlflow } from "./index.js";
import express from "express";
import request from "supertest";

describe("ctrlflow", () => {
  it("mounts middleware before routes", async () => {
    const app = express();
    const cf = ctrlflow().use((_req, _res, next) => next());
    const r = cf.toRouter((router) => {
      router.get("/", (_q, res) => res.json({ ok: true }));
    });
    app.use(r);
    const res = await request(app).get("/");
    expect(res.body.ok).toBe(true);
  });
});
`,

  pageforge: `export interface CursorPayload {
  id: string;
  sort: string;
}

export function pageforgeEncodeCursor(p: CursorPayload): string {
  return Buffer.from(JSON.stringify(p), "utf8").toString("base64url");
}

export function pageforgeDecodeCursor(s: string): CursorPayload | null {
  try {
    return JSON.parse(Buffer.from(s, "base64url").toString("utf8")) as CursorPayload;
  } catch {
    return null;
  }
}

export function pageforgeOffset(page: number, limit: number): { skip: number; limit: number } {
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  return { skip: (p - 1) * l, limit: l };
}
`,
  pageforgeTest: `import { describe, expect, it } from "vitest";
import { pageforgeDecodeCursor, pageforgeEncodeCursor, pageforgeOffset } from "./index.js";

describe("pageforge", () => {
  it("roundtrips cursor", () => {
    const c = pageforgeEncodeCursor({ id: "1", sort: "asc" });
    expect(pageforgeDecodeCursor(c)).toEqual({ id: "1", sort: "asc" });
    expect(pageforgeOffset(2, 10).skip).toBe(10);
  });
});
`,

  transactly: `export interface TransactlyOptions {
  retries?: number;
  delayMs?: (attempt: number) => number;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** Run async work with simple retries — wire Mongo session inside \`work\`. */
export async function transactly<T>(work: () => Promise<T>, opts?: TransactlyOptions): Promise<T> {
  const retries = opts?.retries ?? 2;
  const delay = opts?.delayMs ?? ((n: number) => 50 * n);
  let last: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await work();
    } catch (e) {
      last = e;
      if (i === retries) throw e;
      await sleep(delay(i + 1));
    }
  }
  throw last;
}
`,
  transactlyTest: `import { describe, expect, it } from "vitest";
import { transactly } from "./index.js";

describe("transactly", () => {
  it("retries then succeeds", async () => {
    let n = 0;
    const v = await transactly(
      async () => {
        n++;
        if (n < 2) throw new Error("x");
        return 1;
      },
      { retries: 3, delayMs: () => 1 }
    );
    expect(v).toBe(1);
  });
});
`,

  guardpress: `import type { NextFunction, Request, RequestHandler, Response } from "express";

export type GuardFn = (req: Request) => boolean | Promise<boolean>;

export function guardpress(...guards: GuardFn[]): RequestHandler {
  return async (req, res, next) => {
    for (const g of guards) {
      if (!(await g(req))) {
        res.status(403).json({ error: "forbidden" });
        return;
      }
    }
    next();
  };
}

export function guardRole(getRole: (req: Request) => string | undefined, allowed: Set<string>): GuardFn {
  return (req) => {
    const r = getRole(req);
    return !!r && allowed.has(r);
  };
}
`,
  guardpressTest: `import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { guardpress, guardRole } from "./index.js";

describe("guardpress", () => {
  it("403 when guard fails", async () => {
    const app = express();
    app.get("/", guardpress(async () => false), (_q, res) => res.send("ok"));
    const bad = await request(app).get("/");
    expect(bad.status).toBe(403);
    app.get("/ok", guardpress(guardRole(() => "admin", new Set(["admin"]))), (_q, res) => res.send("ok"));
    const ok = await request(app).get("/ok");
    expect(ok.status).toBe(200);
  });
});
`,

  serviceforge: `export interface ServiceHooks<T> {
  beforeCreate?: (doc: T) => void | Promise<void>;
  afterCreate?: (doc: T) => void | Promise<void>;
}

export class ServiceForge<T> {
  constructor(
    readonly name: string,
    private readonly hooks: ServiceHooks<T> = {}
  ) {}

  async create(doc: T): Promise<T> {
    await this.hooks.beforeCreate?.(doc);
    await this.hooks.afterCreate?.(doc);
    return doc;
  }
}

export function serviceForge<T>(name: string, hooks?: ServiceHooks<T>): ServiceForge<T> {
  return new ServiceForge(name, hooks);
}
`,
  serviceforgeTest: `import { describe, expect, it } from "vitest";
import { serviceForge } from "./index.js";

describe("serviceforge", () => {
  it("runs hooks", async () => {
    const log: string[] = [];
    const s = serviceForge<{ id: string }>("User", {
      beforeCreate: () => log.push("b"),
      afterCreate: () => log.push("a"),
    });
    await s.create({ id: "1" });
    expect(log).toEqual(["b", "a"]);
  });
});
`,

  lesscodeCli: `import pc from "picocolors";
import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import path from "node:path";

async function main() {
  const [, , cmd, dir] = process.argv;
  if (cmd === "analyze") {
    const root = path.resolve(dir ?? "src");
    let hits = 0;
    let files = 0;
    try {
      for await (const f of glob("**/*.{ts,tsx,js}", { cwd: root })) {
        files++;
        const t = await readFile(path.join(root, f), "utf8").catch(() => "");
        hits += (t.router || t.match(/\\.(get|post|put|patch|delete)\\(/g) || []).length ? (t.match(/\\.(get|post|put|patch|delete|use)\\(/g) || []).length : 0;
        // count express style methods
        hits += (t.match(/\\.(get|post|put|patch|delete|use)\\(/g) || []).length;
      }
    } catch {
      console.log(pc.yellow("lesscode: could not read"), root);
    }
    console.log(pc.green("lesscode analyze"), root, pc.cyan(\`files=\${files} express-ish calls=\${hits}\`));
    return;
  }
  console.log(pc.cyan("lesscode"), "analyze [dir]");
  process.exit(cmd ? 1 : 0);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
`,
  lesscodeIndex: `export const lesscode = { version: "0.1.0" as const };
`,
  lesscodeTest: `import { describe, expect, it } from "vitest";
import { lesscode } from "./index.js";

describe("lesscode", () => {
  it("exports version", () => expect(lesscode.version).toBe("0.1.0"));
});
`,

  retrystack: `export interface RetryStackOpts {
  maxAttempts?: number;
  initialDelayMs?: number;
  factor?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function retrystack<T>(fn: () => Promise<T>, opts: RetryStackOpts = {}): Promise<T> {
  const max = opts.maxAttempts ?? 4;
  let delay = opts.initialDelayMs ?? 100;
  const factor = opts.factor ?? 2;
  const cap = opts.maxDelayMs ?? 30_000;
  let last: unknown;
  for (let i = 0; i < max; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i === max - 1) throw e;
      const j = opts.jitter ? delay * (0.5 + Math.random() / 2) : delay;
      await sleep(Math.min(cap, j));
      delay = Math.min(cap, delay * factor);
    }
  }
  throw last;
}
`,
  retrystackTest: `import { describe, expect, it } from "vitest";
import { retrystack } from "./index.js";

describe("retrystack", () => {
  it("succeeds after retry", async () => {
    let n = 0;
    const v = await retrystack(
      async () => {
        n++;
        if (n < 2) throw new Error("x");
        return 1;
      },
      { maxAttempts: 3, initialDelayMs: 1, jitter: false }
    );
    expect(v).toBe(1);
  });
});
`,

  modstack: `import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface LoadedMod<T = unknown> {
  name: string;
  defaultExport?: T;
}

export async function modstackLoadDir(absDir: string, pattern = /\\.(plugin|mod)\\.[cm]?js$/i): Promise<LoadedMod[]> {
  const out: LoadedMod[] = [];
  let ents;
  try {
    ents = await readdir(absDir, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const e of ents) {
    if (!e.isFile() || !pattern.test(e.name)) continue;
    const url = pathToFileURL(path.join(absDir, e.name)).href;
    const m = (await import(url)) as { default?: unknown };
    out.push({ name: e.name.replace(pattern, ""), defaultExport: m.default });
  }
  return out;
}
`,
  modstackTest: `import { describe, expect, it } from "vitest";
import { modstackLoadDir } from "./index.js";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

describe("modstack", () => {
  it("empty dir", async () => {
    const d = await mkdtemp(path.join(tmpdir(), "ms-"));
    try {
      expect((await modstackLoadDir(d)).length).toBe(0);
    } finally {
      await rm(d, { recursive: true, force: true });
    }
  });
});
`,

  searchforge: `/** Escape user input for safe inclusion in Mongo \$regex */
export function searchforgeEscapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
}

export function searchforgeFuzzyClause(field: string, term: string): Record<string, unknown> {
  const rx = new RegExp(searchforgeEscapeRegex(term), "i");
  return { [field]: { $regex: rx } };
}

export function searchforgeText(term: string, path: string): Record<string, unknown> {
  return { $text: { $search: term, $language: "en", $path: path } };
}
`,
  searchforgeTest: `import { describe, expect, it } from "vitest";
import { searchforgeEscapeRegex, searchforgeFuzzyClause } from "./index.js";

describe("searchforge", () => {
  it("escape and clause", () => {
    expect(searchforgeEscapeRegex("a+b")).toBe("a\\\\+b");
    const q = searchforgeFuzzyClause("title", "foo");
    expect(q.title).toBeDefined();
  });
});
`,

  uploadflow: `export type UploadStep<T> = (file: T) => void | Promise<void>;

export class UploadFlow<T> {
  private readonly steps: UploadStep<T>[] = [];

  step(_name: string, fn: UploadStep<T>): this {
    this.steps.push(fn);
    return this;
  }

  async run(file: T): Promise<void> {
    for (const s of this.steps) await s(file);
  }
}

export function uploadflow<T>(): UploadFlow<T> {
  return new UploadFlow();
}
`,
  uploadflowTest: `import { describe, expect, it } from "vitest";
import { uploadflow } from "./index.js";

describe("uploadflow", () => {
  it("runs steps", async () => {
    const u = uploadflow<{ n: number }>();
    let x = 0;
    u.step("a", async (f) => {
      x += f.n;
    });
    await u.run({ n: 2 });
    expect(x).toBe(2);
  });
});
`,

  workerforge: `export type WorkerHandler<T = unknown> = (job: T) => void | Promise<void>;

export class WorkerForge {
  private readonly map = new Map<string, WorkerHandler[]>();

  process<T = unknown>(name: string, handler: WorkerHandler<T>): this {
    const arr = this.map.get(name) ?? [];
    arr.push(handler as WorkerHandler);
    this.map.set(name, arr);
    return this;
  }

  async dispatch<T = unknown>(name: string, payload: T): Promise<void> {
    for (const h of this.map.get(name) ?? []) await (h as WorkerHandler<T>)(payload);
  }
}

export function workerforge(): WorkerForge {
  return new WorkerForge();
}
`,
  workerforgeTest: `import { describe, expect, it } from "vitest";
import { workerforge } from "./index.js";

describe("workerforge", () => {
  it("dispatch fans out", async () => {
    const w = workerforge();
    const log: number[] = [];
    w.process("emails", async (n: number) => log.push(n));
    await w.dispatch("emails", 1);
    expect(log).toEqual([1]);
  });
});
`,

  hookretry: `export interface HookAttempt {
  at: number;
  error?: string;
  status?: number;
}

export class HookRetry {
  private readonly attempts = new Map<string, HookAttempt[]>();

  record(id: string, attempt: HookAttempt): void {
    const a = this.attempts.get(id) ?? [];
    a.push(attempt);
    this.attempts.set(id, a);
  }

  nextBackoffMs(attemptIndex: number, base = 200): number {
    return Math.min(60_000, base * 2 ** attemptIndex);
  }

  history(id: string): HookAttempt[] {
    return [...(this.attempts.get(id) ?? [])];
  }
}

export function hookretry(): HookRetry {
  return new HookRetry();
}
`,
  hookretryTest: `import { describe, expect, it } from "vitest";
import { hookretry } from "./index.js";

describe("hookretry", () => {
  it("tracks attempts", () => {
    const h = hookretry();
    h.record("a", { at: 1, status: 500 });
    expect(h.history("a").length).toBe(1);
    expect(h.nextBackoffMs(2, 100)).toBe(400);
  });
});
`,

  pipeguard: `import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

export function pipeguardBody(schema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const r = schema.safeParse(req.body);
    if (!r.success) {
      res.status(400).json({ error: "invalid_body", details: r.error.flatten() });
      return;
    }
    req.body = r.data as unknown;
    next();
  };
}
`,
  pipeguardTest: `import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { z } from "zod";
import { pipeguardBody } from "./index.js";

describe("pipeguard", () => {
  it("validates body", async () => {
    const app = express();
    app.use(express.json());
    app.post("/", pipeguardBody(z.object({ x: z.number() })), (req, res) => res.json(req.body));
    const ok = b;
```

Stopping - the script file got corrupted/truncated. I need to write a complete scaffold script or continue with smaller writes.

Let me delete the broken file and write the rest of the sources in a second file or use separate approach: write each package manually in batches using Write tool only for key files.

Actually the Write was interrupted. Let me read what exists in .scaffold-wave6.mjs




Read