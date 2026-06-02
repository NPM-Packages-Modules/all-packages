import { writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const heap = join(root, "heapguard");

const stdTsconfig = {
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
};

function wf(p, s) {
  writeFileSync(p, s);
}
function mk(dir) {
  mkdirSync(join(root, dir, ".github", "workflows"), { recursive: true });
  mkdirSync(join(root, dir, "src"), { recursive: true });
  copyFileSync(join(heap, "LICENSE"), join(root, dir, "LICENSE"));
  copyFileSync(join(heap, "CHANGELOG.md"), join(root, dir, "CHANGELOG.md"));
  copyFileSync(join(heap, ".github", "workflows", "publish.yml"), join(root, dir, ".github", "workflows", "publish.yml"));
  wf(
    join(root, dir, ".gitignore"),
    ["node_modules", "dist", "coverage", ".DS_Store", "*.log", ""].join("\n")
  );
}

function pkg(p) {
  const j = {
    name: `${p.n}`,
    version: "0.1.0",
    description: p.d,
    license: "MIT",
    type: "module",
    main: "./dist/index.cjs",
    module: "./dist/index.js",
    types: "./dist/index.d.ts",
    exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js", require: "./dist/index.cjs" } },
    files: p.bin ? ["dist", `${p.n}.cjs`, "README.md", "LICENSE", "CHANGELOG.md"] : ["dist", "README.md", "LICENSE", "CHANGELOG.md"],
    scripts: { build: "tsup", test: "vitest run", typecheck: "tsc --noEmit", prepublishOnly: "npm run build" },
    keywords: p.k,
    devDependencies: {
      "@types/node": "^20.11.0",
      tsup: "^8.0.0",
      typescript: "^5.4.0",
      vitest: "^1.4.0",
    },
    engines: { node: ">=18" },
    author: "Aftab Ahmad Khan (https://github.com/aftab-ahmad-khan-dev)",
    repository: { type: "git", url: `git+https://github.com/NPM-Packages-Modules/${p.n}.git` },
    bugs: { url: `https://github.com/NPM-Packages-Modules/${p.n}/issues` },
    homepage: `https://github.com/NPM-Packages-Modules/${p.n}#readme`,
    publishConfig: { access: "public" },
  };
  if (p.bin) {
    j.bin = { [p.n]: `${p.n}.cjs` };
    j.dependencies = { picocolors: "^1.0.0" };
  }
  if (p.ex) {
    j.peerDependencies = { express: "^4.0.0 || ^5.0.0" };
    j.peerDependenciesMeta = { express: { optional: true } };
    j.devDependencies["@types/express"] = "^4.17.21";
    j.devDependencies.express = "^4.19.2";
    if (p.st) j.devDependencies["@types/supertest"] = "^6.0.2";
    if (p.st) j.devDependencies.supertest = "^7.0.0";
  }
  return JSON.stringify(j, null, 2);
}

const tsupStd = `import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
});
`;

const tsupCli = `import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts", cli: "src/cli.ts" },
  format: ["esm", "cjs"],
  dts: { entry: { index: "src/index.ts" } },
  clean: true,
  sourcemap: true,
  target: "node18",
});
`;

const rd = (title, b) => `# ${title}\n\n${b}\n\n## License\n\nMIT\n`;

const defs = [
  {
    n: "servbridge",
    d: "servbridge — Service registry, in-process calls, and pub/sub channels for MERN-style service glue.",
    k: ["microservices", "discovery", "merndev", "typescript"],
  },
  {
    n: "datamorph",
    d: "datamorph — Fluent field hide/rename and shallow transforms on plain record objects.",
    k: ["transform", "dto", "api", "merndev", "typescript"],
  },
  {
    n: "dbmesh",
    d: "dbmesh — Multi-database façade: register named collection adapters behind one mesh API.",
    k: ["database", "mongodb", "postgres", "redis", "merndev", "typescript"],
  },
  {
    n: "routeboost",
    d: "routeboost — Express perf hints middleware (cache/surrogate headers + payload guard stub).",
    k: ["express", "performance", "api", "merndev", "typescript"],
    ex: 1,
    st: 1,
  },
  {
    n: "graphstack",
    d: "graphstack — CLI to list sorted npm dependencies from package.json (npx graphstack analyze).",
    k: ["dependencies", "graph", "cli", "merndev", "typescript"],
    bin: 1,
  },
  {
    n: "fusionstack",
    d: "fusionstack — Parallel Promise.allSettled helper to merge multiple service fetches safely.",
    k: ["aggregation", "api", "bff", "merndev", "typescript"],
  },
  {
    n: "logicforge",
    d: "logicforge — Tiny numeric comparison rules from strings (e.g. order > 100) plus function predicates.",
    k: ["rules", "workflow", "business-logic", "merndev", "typescript"],
  },
];

const src = {
  "servbridge-index": `export type ServFn = (payload: unknown) => unknown | Promise<unknown>;

export class ServBridge {
  private services = new Map<string, ServFn>();
  private channels = new Map<string, Set<(e: unknown) => void>>();

  register(name: string, fn?: ServFn): this {
    if (fn) this.services.set(name, fn);
    return this;
  }

  list(): string[] {
    return [...this.services.keys()].sort();
  }

  async call<T = unknown>(name: string, payload?: unknown): Promise<T> {
    const fn = this.services.get(name);
    if (!fn) throw new Error("servbridge: unknown service " + name);
    return (await fn(payload)) as T;
  }

  on(channel: string, listener: (e: unknown) => void): this {
    let set = this.channels.get(channel);
    if (!set) {
      set = new Set();
      this.channels.set(channel, set);
    }
    set.add(listener);
    return this;
  }

  emit(channel: string, event: unknown): void {
    const set = this.channels.get(channel);
    if (!set) return;
    for (const l of set) l(event);
  }
}

export const servbridge = () => new ServBridge();
`,
  "servbridge-test": `import { describe, expect, it } from "vitest";
import { servbridge } from "./index.js";

it("register and call", async () => {
  const sb = servbridge();
  sb.register("payments", async (p) => ({ ok: true, p }));
  expect(sb.list()).toContain("payments");
  const r = await sb.call<{ ok: boolean }>("payments", 1);
  expect(r.ok).toBe(true);
});

it("emit", () => {
  const sb = servbridge();
  const seen: unknown[] = [];
  sb.on("x", (e) => seen.push(e));
  sb.emit("x", 2);
  expect(seen).toEqual([2]);
});
`,

  "datamorph-index": `type Op =
  | { kind: "hide"; key: string }
  | { kind: "rename"; from: string; to: string }
  | { kind: "map"; key: string; fn: (v: unknown) => unknown };

export class Datamorph {
  private ops: Op[] = [];

  hide(key: string): this {
    this.ops.push({ kind: "hide", key });
    return this;
  }

  rename(from: string, to: string): this {
    this.ops.push({ kind: "rename", from, to });
    return this;
  }

  mapField(key: string, fn: (v: unknown) => unknown): this {
    this.ops.push({ kind: "map", key, fn });
    return this;
  }

  apply<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
    let out: Record<string, unknown> = { ...row };
    for (const op of this.ops) {
      if (op.kind === "hide") {
        const { [op.key]: _, ...rest } = out;
        void _;
        out = rest;
      } else if (op.kind === "rename") {
        if (op.from in out) {
          const v = out[op.from];
          const { [op.from]: _r, ...rest } = out;
          void _r;
          out = { ...rest, [op.to]: v };
        }
      } else if (op.kind === "map" && op.key in out) {
        out = { ...out, [op.key]: op.fn(out[op.key]) };
      }
    }
    return out;
  }
}

export const datamorph = () => new Datamorph();
`,
  "datamorph-test": `import { describe, expect, it } from "vitest";
import { datamorph } from "./index.js";

it("hide rename", () => {
  const d = datamorph().hide("password").rename("full_name", "name");
  expect(d.apply({ password: "x", full_name: "A", id: 1 })).toEqual({ name: "A", id: 1 });
});
`,

  "dbmesh-index": `export interface DbMeshAdapter<T = Record<string, unknown>> {
  find(filter?: Partial<T>): Promise<T[]>;
}

export class DbMesh {
  private adapters = new Map<string, DbMeshAdapter<Record<string, unknown>>>();

  use<T extends Record<string, unknown>>(name: string, adapter: DbMeshAdapter<T>): this {
    this.adapters.set(name, adapter as DbMeshAdapter<Record<string, unknown>>);
    return this;
  }

  collection<T extends Record<string, unknown>>(name: string): { find: (f?: Partial<T>) => Promise<T[]> } {
    const a = this.adapters.get(name);
    if (!a) throw new Error("dbmesh: unknown collection " + name);
    return {
      find: (f?: Partial<T>) => a.find(f as never) as Promise<T[]>,
    };
  }

  get users(): { find: (f?: Partial<Record<string, unknown>>) => Promise<Record<string, unknown>[]> } {
    return this.collection("users");
  }
}

export const dbmesh = () => new DbMesh();
`,
  "dbmesh-test": `import { describe, expect, it } from "vitest";
import { dbmesh } from "./index.js";

it("users.find", async () => {
  const mesh = dbmesh();
  mesh.use("users", {
    find: async (f) => [{ id: "1", ...(f as object) }],
  });
  const rows = await mesh.users.find({ id: "1" });
  expect(rows[0]?.id).toBe("1");
});
`,

  "routeboost-index": `import type { NextFunction, Request, Response } from "express";

export interface RouteBoostOpts {
  /** Surrogate key hint for shared HTTP caches */
  surrogateKey?: string;
  /** Short public cache in seconds (0 = no-store) */
  maxAgeSec?: number;
}

export function routeboost(opts: RouteBoostOpts = {}): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  const maxAge = opts.maxAgeSec ?? 0;
  const surrogate = opts.surrogateKey;
  return (_req, res, next) => {
    res.setHeader("X-Routeboost", "1");
    if (surrogate) res.setHeader("Surrogate-Key", surrogate);
    if (maxAge > 0) res.setHeader("Cache-Control", \`public, max-age=\${maxAge}\`);
    else res.setHeader("Cache-Control", "private, no-cache");
    next();
  };
}
`,
  "routeboost-test": `import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { routeboost } from "./index.js";

it("headers", async () => {
  const app = express();
  app.get("/", routeboost({ surrogateKey: "api", maxAgeSec: 30 }), (_q, res) => res.send("ok"));
  const h = await request(app).get("/");
  expect(h.headers["x-routeboost"]).toBe("1");
  expect(h.headers["surrogate-key"]).toBe("api");
});
`,

  "graphstack-index": `export const graphstack = { version: "0.1.0" as const };
`,
  "graphstack-cli": `import pc from "picocolors";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const [, , cmd, dir] = process.argv;
  if (cmd === "analyze") {
    const root = resolve(dir ?? ".");
    const raw = await readFile(resolve(root, "package.json"), "utf8");
    const pj = JSON.parse(raw) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const names = new Set([
      ...Object.keys(pj.dependencies ?? {}),
      ...Object.keys(pj.devDependencies ?? {}),
    ]);
    const sorted = [...names].sort();
    console.log(pc.cyan("graphstack"), "analyze —", sorted.length, "packages");
    for (const n of sorted) console.log(" ", n);
    return;
  }
  console.log(pc.cyan("graphstack"), "analyze [dir]");
  process.exit(cmd ? 1 : 0);
}
void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
`,
  "graphstack-test": `import { describe, expect, it } from "vitest";
import { graphstack } from "./index.js";

it("version", () => expect(graphstack.version).toBe("0.1.0"));
`,

  "fusionstack-index": `export type FusionSource<T = unknown> = () => Promise<T>;

export interface FusionEntry<T = unknown> {
  ok: boolean;
  value?: T;
  reason?: unknown;
}

export async function fusionstackCombine<T = unknown>(sources: FusionSource<T>[]): Promise<FusionEntry<T>[]> {
  const settled = await Promise.allSettled(sources.map((s) => s()));
  return settled.map((r) =>
    r.status === "fulfilled"
      ? { ok: true, value: r.value as T }
      : { ok: false, reason: r.reason }
  );
}

export async function fusionstackMergeObjects(parts: Record<string, unknown>[]): Promise<Record<string, unknown>> {
  return Object.assign({}, ...parts);
}
`,
  "fusionstack-test": `import { describe, expect, it } from "vitest";
import { fusionstackCombine, fusionstackMergeObjects } from "./index.js";

it("combine", async () => {
  const r = await fusionstackCombine([
    async () => ({ a: 1 }),
    async () => {
      throw new Error("x");
    },
  ]);
  expect(r[0]?.ok).toBe(true);
  expect(r[1]?.ok).toBe(false);
});

it("merge", async () => {
  expect(await fusionstackMergeObjects([{ a: 1 }, { b: 2 }])).toEqual({ a: 1, b: 2 });
});
`,

  "logicforge-index": `export type LogicCtx = Record<string, unknown>;

export type LogicPredicate = (ctx: LogicCtx) => boolean;

/** Safe subset: "key > number" or "key >= number" (whitespace flexible). */
export function logicforgePredicateFromIf(expr: string): LogicPredicate {
  const m = expr
    .trim()
    .match(/^([a-zA-Z_][a-zA-Z0-9_]*)\\s*(>|>=|<|<=)\\s*([-+]?\\d*\\.?\\d+)$/);
  if (!m) throw new Error("logicforge: unsupported if expression (use key > 100 style)");
  const key = m[1]!;
  const op = m[2]!;
  const numStr = m[3]!;
  const num = Number(numStr);
  return (ctx) => {
    const v = Number(ctx[key]);
    if (Number.isNaN(v)) return false;
    switch (op) {
      case ">":
        return v > num;
      case ">=":
        return v >= num;
      case "<":
        return v < num;
      case "<=":
        return v <= num;
      default:
        return false;
    }
  };
}

export function logicforgeRule(
  spec: { if: string },
  then?: (ctx: LogicCtx) => unknown
): { when: LogicPredicate; run?: (ctx: LogicCtx) => unknown } {
  const when = logicforgePredicateFromIf(spec.if);
  return { when, run: then };
}
`,
  "logicforge-test": `import { describe, expect, it } from "vitest";
import { logicforgePredicateFromIf, logicforgeRule } from "./index.js";

it("order > 100", () => {
  const p = logicforgePredicateFromIf("order > 100");
  expect(p({ order: 99 })).toBe(false);
  expect(p({ order: 101 })).toBe(true);
});

it("rule", () => {
  const r = logicforgeRule({ if: "x >= 2" }, (ctx) => ctx.x);
  expect(r.when({ x: 2 })).toBe(true);
  expect(r.run?.({ x: 3 })).toBe(3);
});
`,
};

for (const p of defs) {
  mk(p.n);
  wf(join(root, p.n, "package.json"), pkg(p));
  wf(join(root, p.n, "tsconfig.json"), JSON.stringify(stdTsconfig, null, 2));
  wf(join(root, p.n, "tsup.config.ts"), p.bin ? tsupCli : tsupStd);
  wf(join(root, p.n, "src", "index.ts"), src[p.n + "-index"]);
  wf(join(root, p.n, "src", "index.test.ts"), src[p.n + "-test"]);
  wf(
    join(root, p.n, "README.md"),
    rd(p.n, p.d.replace(/^[^:]+:\s*/, "") + " See `src/index.ts` for the public API surface.")
  );
  if (p.bin) {
    wf(join(root, p.n, "src", "cli.ts"), src[p.n + "-cli"]);
    wf(join(root, p.n, `${p.n}.cjs`), "#!/usr/bin/env node\nrequire(\"./dist/cli.cjs\");\n");
  }
}

console.log("wave7 ok", defs.length);
