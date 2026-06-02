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
  if (p.z) j.dependencies = { ...(j.dependencies ?? {}), zod: "^3.23.8" };
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
  { n: "duoapi", d: "duoapi — Dual API engine: one Zod resource → GraphQL SDL stub + REST base path metadata.", k: ["graphql", "rest", "api", "merndev", "typescript"], z: 1 },
  { n: "relaforge", d: "relaforge — Mongo populate path helper with cycle detection and nesting utilities.", k: ["mongodb", "populate", "relations", "merndev", "typescript"] },
  { n: "sdkpress", d: "sdkpress — SDK generator CLI: typed fetch stubs from OpenAPI path keys (`npx sdkpress generate`).", k: ["openapi", "sdk", "cli", "merndev", "typescript"], bin: 1 },
  { n: "cronmesh", d: "cronmesh — Named cron-style task registry (daily/hourly/manual) for scheduler glue.", k: ["cron", "scheduler", "jobs", "merndev", "typescript"] },
  { n: "schemagen", d: "schemagen — Zod object → DTO interface string + field reflection for contracts.", k: ["zod", "dto", "schema", "merndev", "typescript"], z: 1 },
  { n: "ctrlflow", d: "ctrlflow — Express controller composer: stack middleware then mount handlers.", k: ["express", "controller", "merndev", "typescript"], ex: 1, st: 1 },
  { n: "pageforge", d: "pageforge — Cursor + offset pagination helpers for APIs.", k: ["pagination", "cursor", "api", "merndev", "typescript"] },
  { n: "transactly", d: "transactly — Retry wrapper for transactional async work (Mongo session inside callback).", k: ["mongodb", "transactions", "retry", "merndev", "typescript"] },
  { n: "guardpress", d: "guardpress — Route guard composer for Express (role + custom predicates).", k: ["express", "auth", "merndev", "typescript"], ex: 1, st: 1 },
  { n: "serviceforge", d: "serviceforge — Service layer shell with before/after CRUD hooks.", k: ["service", "architecture", "merndev", "typescript"] },
  { n: "lesscode", d: "lesscode — Boilerplate CLI: scan files for Express-style `.get/.use` usage.", k: ["cli", "express", "merndev", "typescript"], bin: 1 },
  { n: "retrystack", d: "retrystack — Exponential backoff retries with jitter for async calls.", k: ["retry", "resilience", "merndev", "typescript"] },
  { n: "modstack", d: "modstack — Load `*.plugin.js` modules from a directory via dynamic import.", k: ["plugins", "dynamic-import", "merndev", "typescript"] },
  { n: "searchforge", d: "searchforge — Mongo \$regex helpers + Atlas \$text clause builder.", k: ["mongodb", "search", "merndev", "typescript"] },
  { n: "uploadflow", d: "uploadflow — Named upload pipeline steps.", k: ["upload", "pipeline", "merndev", "typescript"] },
  { n: "workerforge", d: "workerforge — In-process worker registry and dispatcher by job name.", k: ["worker", "jobs", "merndev", "typescript"] },
  { n: "hookretry", d: "hookretry — Webhook delivery attempt log + backoff helper.", k: ["webhook", "retry", "merndev", "typescript"] },
  { n: "pipeguard", d: "pipeguard — Zod body validation as Express middleware.", k: ["express", "zod", "validation", "merndev", "typescript"], ex: 1, st: 1, z: 1 },
  { n: "eventforge", d: "eventforge — Tiny typed event bus for Express apps.", k: ["events", "express", "merndev", "typescript"], ex: 1 },
  { n: "routeblocks", d: "routeblocks — Fluent Express router blocks (use/mount helpers).", k: ["express", "router", "merndev", "typescript"], ex: 1 },
  { n: "cacheforge", d: "cacheforge — Cache entry envelope with TTL + tag list for invalidation.", k: ["cache", "redis", "merndev", "typescript"] },
  { n: "apilifecycle", d: "apilifecycle — Deprecation and version gate middleware for Express.", k: ["express", "deprecation", "version", "merndev", "typescript"], ex: 1 },
  { n: "queueflow", d: "queueflow — Map queue channel names to async handlers with retries.", k: ["queue", "workflow", "merndev", "typescript"] },
  { n: "plugstack", d: "plugstack — Plugin registry with async init hooks.", k: ["plugins", "architecture", "merndev", "typescript"] },
  { n: "midflow", d: "midflow — Compose Express middleware arrays into one handler.", k: ["express", "middleware", "merndev", "typescript"], ex: 1 },
  { n: "statemesh", d: "statemesh — Minimal finite state machine with transitions.", k: ["fsm", "workflow", "merndev", "typescript"] },
  { n: "testforge", d: "testforge — CLI to emit a starter Vitest file (`npx testforge generate`).", k: ["testing", "vitest", "cli", "merndev", "typescript"], bin: 1 },
  { n: "dbflow", d: "dbflow — Repository façade interface for CRUD-style data access.", k: ["repository", "dal", "merndev", "typescript"] },
  { n: "metricpress", d: "metricpress — Express middleware collecting per-route timings + status counts.", k: ["metrics", "express", "merndev", "typescript"], ex: 1 },
  { n: "configforge", d: "configforge — Merge config objects then validate with Zod.", k: ["config", "zod", "merndev", "typescript"], z: 1 },
  { n: "docstack", d: "docstack — CLI markdown stub from CWD package.json (`npx docstack generate`).", k: ["docs", "markdown", "cli", "merndev", "typescript"], bin: 1 },
  { n: "lockmesh", d: "lockmesh — In-memory lock with TTL; interface-friendly for Redis backends.", k: ["lock", "concurrency", "merndev", "typescript"] },
];

const src = {
  "duoapi-index": `import type { ZodObject, ZodRawShape } from "zod";
import { z } from "zod";
export interface DualMeta<T extends ZodObject<ZodRawShape>> { name: string; schema: T }
export function duoapi<T extends ZodObject<ZodRawShape>>(m: DualMeta<T>) {
  const fields = Object.keys(m.schema.shape);
  const sdl = \`type \${m.name} {\\n\${fields.map((f) => "  " + f + ": String").join("\\n")}\\n}\\n\\ntype Query { \${m.name.toLowerCase()}_by_id(id: ID!): \${m.name} }\\n\`;
  return { graphqlSDL: sdl, restBase: "/api/" + m.name.toLowerCase() + "s", fields, schema: m.schema };
}
export { z };
`,
  "duoapi-test": `import { describe, expect, it } from "vitest";
import { z } from "zod"; import { duoapi } from "./index.js";
it("duoapi", () => { const u = duoapi({ name: "User", schema: z.object({ email: z.string() }) });
expect(u.restBase).toBe("/api/users"); expect(u.graphqlSDL).toContain("type User"); });
`,
  "relaforge-index": `export function relaforgePaths(paths: string[], maxDepth = 5): string[] {
  const out: string[] = [];
  for (const p of paths) {
    const segs = p.split(".").filter(Boolean);
    if (segs.length > maxDepth) continue;
    const seen = new Set<string>(); let bad = false;
    for (const s of segs) { if (seen.has(s)) { bad = true; break; } seen.add(s); }
    if (!bad) out.push(segs.join("."));
  } return out;
}
export const relaforgeNest = (a: string, b: string) => a + "." + b;
`,
  "relaforge-test": `import { describe, expect, it } from "vitest"; import { relaforgeNest, relaforgePaths } from "./index.js";
it("paths", () => { expect(relaforgePaths(["a.b","a.a.b"])).toEqual(["a.b"]); expect(relaforgeNest("u","p")).toBe("u.p"); });
`,
  "sdkpress-index": `export function generateSdkSnippet(baseUrl: string, paths: string[]): string {
  return paths.map((p) => "export async function api_" + p.replace(/[^a-zA-Z0-9]+/g, "_") + "(init?: RequestInit) { return fetch(new URL('" + p + "', '" + baseUrl + "'), init); }").join("\\n");
}`,
  "sdkpress-cli": `import pc from "picocolors"; import { readFile, writeFile } from "node:fs/promises"; import { resolve } from "node:path";
import { generateSdkSnippet } from "./index.js";
async function main() { const a = process.argv.slice(2); const [cmd, f, out] = a;
if (cmd === "generate" && f) { const raw = JSON.parse(await readFile(resolve(f),"utf8")); const keys = raw.paths ? Object.keys(raw.paths) : [];
await writeFile(resolve(out ?? "sdkpress.client.ts"), "/** sdkpress */\\n"+generateSdkSnippet("http://localhost:3000", keys), "utf8");
console.log(pc.green("Wrote")); return; }
console.log(pc.cyan("sdkpress"), "generate <openapi.json> [out]"); process.exit(cmd?1:0); }
void main().catch((e)=>{ console.error(e); process.exit(1); });
`,
  "sdkpress-test": `import { describe, expect, it } from "vitest"; import { generateSdkSnippet } from "./index.js";
it("sdk", () => expect(generateSdkSnippet("http://x/",["/u"])).toContain("/u"));
`,
  "cronmesh-index": `export type CronTask = () => void | Promise<void>;
export interface CronReg { name: string; schedule: "daily"|"hourly"|"manual"; timezone?: string; run: CronTask }
export class CronMesh { private t: CronReg[] = []; daily(n:string,r:CronTask,tz?:string){this.t.push({name:n,schedule:"daily",timezone:tz,run:r});return this}
hourly(n:string,r:CronTask){this.t.push({name:n,schedule:"hourly",run:r});return this} list(){return this.t}}
export const cronmesh = () => new CronMesh();
`,
  "cronmesh-test": `import { describe, expect, it } from "vitest"; import { cronmesh } from "./index.js";
it("c", () => expect(cronmesh().daily("r",async()=>{}).list()[0]?.schedule).toBe("daily"));
`,
  "schemagen-index": `import type { ZodObject, ZodRawShape } from "zod";
export interface FieldSpec { key: string; zodType: string }
export function schemagenFields(s: ZodObject<ZodRawShape>): FieldSpec[] {
return Object.entries(s.shape).map(([k,z])=>({key:k,zodType:(z as { _def?: { typeName?: string } })._def?.typeName??"unknown"})); }
export function schemagenDtoInterface(s: ZodObject<ZodRawShape>, n="Dto") { const f=schemagenFields(s);
return "export interface "+n+" {\\n"+f.map(x=>"  "+x.key+": unknown;").join("\\n")+"\\n}\\n"; }
`,
  "schemagen-test": `import { describe, expect, it } from "vitest"; import { z } from "zod"; import { schemagenDtoInterface, schemagenFields } from "./index.js";
it("s", () => { const o=z.object({id:z.string()}); expect(schemagenFields(o)[0]?.key).toBe("id"); expect(schemagenDtoInterface(o,"U")).toContain("interface U"); });
`,
  "ctrlflow-index": `import type { RequestHandler, Router } from "express"; import { Router as R } from "express";
export class CtrlFlow { private s: RequestHandler[] = []; use(...m: RequestHandler[]){this.s.push(...m);return this}
mount(router: Router, setup?: (r: Router)=>void){for(const m of this.s)router.use(m);setup?.(router);return router} toRouter(setup?: (r: Router)=>void){return this.mount(R(),setup)}}
export const ctrlflow = () => new CtrlFlow();
`,
  "ctrlflow-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { ctrlflow } from "./index.js";
it("cf", async () => { const app=express(); const r=ctrlflow().use((_q,_r,n)=>n()).toRouter(x=>{x.get("/",(_q,res)=>res.json({ok:1}))}); app.use(r);
expect((await request(app).get("/")).body.ok).toBe(1); });
`,
  "pageforge-index": `export interface CP { id: string; sort: string }
export const pageforgeEncodeCursor = (p: CP) => Buffer.from(JSON.stringify(p),"utf8").toString("base64url");
export const pageforgeDecodeCursor = (s: string): CP|null => { try { return JSON.parse(Buffer.from(s,"base64url").toString("utf8")); } catch { return null; } };
export const pageforgeOffset = (page: number, limit: number) => { const p=Math.max(1,page), l=Math.max(1,limit); return { skip:(p-1)*l, limit:l }; };
`,
  "pageforge-test": `import { describe, expect, it } from "vitest"; import { pageforgeDecodeCursor, pageforgeEncodeCursor, pageforgeOffset } from "./index.js";
it("p", () => { const x={id:"1",sort:"a"}; expect(pageforgeDecodeCursor(pageforgeEncodeCursor(x))).toEqual(x); expect(pageforgeOffset(2,10).skip).toBe(10); });
`,
  "transactly-index": `export interface TO { retries?: number; delayMs?: (n:number)=>number }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export async function transactly<T>(work: ()=>Promise<T>, opts?: TO): Promise<T> {
const retries=opts?.retries??2, d=opts?.delayMs??(n=>50*n); let last: unknown;
for(let i=0;i<=retries;i++){ try { return await work(); } catch(e){ last=e; if(i===retries)throw e; await sleep(d(i+1)); } } throw last; }
`,
  "transactly-test": `import { describe, expect, it } from "vitest"; import { transactly } from "./index.js";
it("t", async () => { let n=0; const v=await transactly(async()=>{n++; if(n<2)throw new Error("x"); return 1;},{retries:3,delayMs:()=>1}); expect(v).toBe(1); });
`,
  "guardpress-index": `import type { Request, RequestHandler } from "express";
export type GF = (req: Request)=>boolean|Promise<boolean>;
export function guardpress(...g: GF[]): RequestHandler { return async (req,res,next)=>{ for(const x of g){ if(!(await x(req))){ res.status(403).json({error:"forbidden"}); return; } } next(); }; }
export const guardRole = (get:(req:Request)=>string|undefined, ok: Set<string>): GF => (req) => { const r=get(req); return !!r&&ok.has(r); };
`,
  "guardpress-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { guardpress, guardRole } from "./index.js";
it("g", async () => { const app=express();
app.get("/b", guardpress(async()=>false), (_q,res)=>res.send("x")); expect((await request(app).get("/b")).status).toBe(403);
app.get("/o", guardpress(guardRole(()=>"admin", new Set(["admin"]))), (_q,res)=>res.send("ok")); expect((await request(app).get("/o")).status).toBe(200); });
`,
  "serviceforge-index": `export interface SH<T> { beforeCreate?: (d:T)=>void|Promise<void>; afterCreate?: (d:T)=>void|Promise<void> }
export class ServiceForge<T> { constructor(readonly name: string, private h: SH<T> = {}) {} async create(d:T): Promise<T> { await this.h.beforeCreate?.(d); await this.h.afterCreate?.(d); return d; } }
export const serviceForge = <T>(n: string, h?: SH<T>) => new ServiceForge<T>(n,h);
`,
  "serviceforge-test": `import { describe, expect, it } from "vitest"; import { serviceForge } from "./index.js";
it("s", async () => { const l: string[] = []; await serviceForge<{id:string}>("U",{beforeCreate:()=>l.push("b"),afterCreate:()=>l.push("a")}).create({id:"1"}); expect(l).toEqual(["b","a"]); });
`,
  "lesscode-index": `export const lesscode = { version: "0.1.0" as const };
`,
  "lesscode-cli": `import pc from "picocolors"; import { readdir, readFile } from "node:fs/promises"; import path from "node:path";
async function walk(dir: string): Promise<string[]> { let e; try { e = await readdir(dir,{withFileTypes:true}); } catch { return []; }
const o: string[] = []; for(const x of e){ const p=path.join(dir,x.name); if(x.isDirectory()&&x.name!=="node_modules") o.push(...await walk(p)); else if(x.isFile()&&/\\.(ts|tsx|js)$/.test(x.name)) o.push(p); } return o; }
async function main(){ const [,,cmd,dir]=process.argv; if(cmd==="analyze"){ const root=path.resolve(dir??"src"); const files=await walk(root); let hits=0;
for(const f of files){ const t=await readFile(f,"utf8"); hits+=(t.match(/\\.(get|post|put|patch|delete|use)\\(/g)?.length??0); }
console.log(pc.green("lesscode"), root, "files="+files.length, "calls="+hits); return; }
console.log(pc.cyan("lesscode"),"analyze [dir]"); process.exit(cmd?1:0); }
void main().catch(e=>{console.error(e);process.exit(1);});
`,
  "lesscode-test": `import { describe, expect, it } from "vitest"; import { lesscode } from "./index.js"; it("v", ()=>expect(lesscode.version).toBe("0.1.0"));
`,
  "retrystack-index": `export interface RO { maxAttempts?: number; initialDelayMs?: number; factor?: number; maxDelayMs?: number; jitter?: boolean }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export async function retrystack<T>(fn: ()=>Promise<T>, opts: RO={}): Promise<T> {
const max=opts.maxAttempts??4; let delay=opts.initialDelayMs??100; const fac=opts.factor??2; const cap=opts.maxDelayMs??30000; let last: unknown;
for(let i=0;i<max;i++){ try{return await fn();}catch(e){last=e;if(i===max-1)throw e; const j=opts.jitter?delay*(0.5+Math.random()/2):delay; await sleep(Math.min(cap,j)); delay=Math.min(cap,delay*fac);} }
throw last;
}
`,
  "retrystack-test": `import { describe, expect, it } from "vitest"; import { retrystack } from "./index.js";
it("r", async ()=>{ let n=0; const v=await retrystack(async()=>{n++; if(n<2)throw new Error("x"); return 1;},{maxAttempts:3,initialDelayMs:1,jitter:false}); expect(v).toBe(1); });
`,
  "modstack-index": `import { readdir } from "node:fs/promises"; import path from "node:path"; import { pathToFileURL } from "node:url";
export interface LM { name: string; defaultExport?: unknown }
export async function modstackLoadDir(abs: string, pat = /\\.(plugin|mod)\\.[cm]?js$/i): Promise<LM[]> {
const o: LM[] = []; let e; try{e=await readdir(abs,{withFileTypes:true});}catch{return o;}
for(const x of e){ if(!x.isFile()||!pat.test(x.name))continue; const u=pathToFileURL(path.join(abs,x.name)).href; const m=await import(u) as {default?:unknown};
o.push({name:x.name.replace(pat,""),defaultExport:m.default}); } return o; }
`,
  "modstack-test": `import { describe, expect, it } from "vitest"; import { modstackLoadDir } from "./index.js"; import { mkdtemp, rm } from "node:fs/promises"; import { tmpdir } from "node:os"; import path from "node:path";
it("m", async ()=>{ const d=await mkdtemp(path.join(tmpdir(),"ms-")); try{ expect((await modstackLoadDir(d)).length).toBe(0);}finally{ await rm(d,{recursive:true,force:true});}});
`,
  "searchforge-index": `export const searchforgeEscapeRegex = (s: string) => s.replace(/[.*+?^\${}()|[\\]\\\\]/g,"\\\\$&");
export const searchforgeFuzzyClause = (field: string, term: string) => ({[field]:{$regex:new RegExp(searchforgeEscapeRegex(term),"i")}});
export const searchforgeText = (term: string, p: string) => ({$text:{$search:term,$language:"en",$path:p}});
`,
  "searchforge-test": `import { describe, expect, it } from "vitest"; import { searchforgeEscapeRegex, searchforgeFuzzyClause } from "./index.js";
it("s", ()=>{ expect(searchforgeEscapeRegex("a+b")).toContain("\\\\+"); expect(searchforgeFuzzyClause("t","x").t).toBeDefined(); });
`,
  "uploadflow-index": `export type US<T> = (f:T)=>void|Promise<void>;
export class UploadFlow<T> { private s: US<T>[] = []; step(_: string, fn: US<T>){this.s.push(fn);return this} async run(f:T){for(const x of this.s)await x(f);} }
export const uploadflow = <T>() => new UploadFlow<T>();
`,
  "uploadflow-test": `import { describe, expect, it } from "vitest"; import { uploadflow } from "./index.js";
it("u", async ()=>{ let n=0; await uploadflow<{n:number}>().step("a",async f=>{n+=f.n}).run({n:3}); expect(n).toBe(3); });
`,
  "workerforge-index": `export type WH<T=unknown> = (j:T)=>void|Promise<void>;
export class WorkerForge { private m = new Map<string, WH[]>(); process<T=unknown>(n:string,h:WH<T>){const a=this.m.get(n)??[];a.push(h as WH);this.m.set(n,a);return this}
async dispatch<T=unknown>(n:string,p:T){ for(const h of this.m.get(n)??[])await(h as WH<T>)(p);} }
export const workerforge = () => new WorkerForge();
`,
  "workerforge-test": `import { describe, expect, it } from "vitest"; import { workerforge } from "./index.js";
it("w", async ()=>{ const x=workerforge(); const l:number[]=[]; x.process("e",async (n:number)=>l.push(n)); await x.dispatch("e",5); expect(l).toEqual([5]); });
`,
  "hookretry-index": `export interface HA { at: number; error?: string; status?: number }
export class HookRetry { private m = new Map<string, HA[]>(); record(id:string,a:HA){const x=this.m.get(id)??[];x.push(a);this.m.set(id,x);}
nextBackoffMs(i:number,b=200){return Math.min(60000,b*2**i)} history(id:string){return [...(this.m.get(id)??[])]} }
export const hookretry = () => new HookRetry();
`,
  "hookretry-test": `import { describe, expect, it } from "vitest"; import { hookretry } from "./index.js";
it("h", ()=>{ const x=hookretry(); x.record("a",{at:1,status:500}); expect(x.history("a").length).toBe(1); expect(x.nextBackoffMs(2,100)).toBe(400); });
`,
  "pipeguard-index": `import type { RequestHandler } from "express"; import type { ZodTypeAny } from "zod";
export const pipeguardBody = (s: ZodTypeAny): RequestHandler => (req,res,next)=>{ const r=s.safeParse(req.body); if(!r.success){res.status(400).json({error:"invalid_body",details:r.error.flatten()});return;}
req.body=r.data as unknown; next(); };
`,
  "pipeguard-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { z } from "zod"; import { pipeguardBody } from "./index.js";
it("p", async ()=>{ const app=express(); app.use(express.json()); app.post("/", pipeguardBody(z.object({x:z.number()})), (req,res)=>res.json(req.body));
const ok=await request(app).post("/").send({x:1}); expect(ok.body.x).toBe(1); });
`,
  "eventforge-index": `type L<T=unknown> = (e:T)=>void|Promise<void>;
export class EventForge { private m = new Map<string, L[]>();
on<T=unknown>(ev: string, fn: L<T>){ const a=this.m.get(ev)??[]; a.push(fn as L); this.m.set(ev,a); return this; }
async emit<T=unknown>(ev: string, payload: T){ for(const fn of this.m.get(ev)??[]) await (fn as L<T>)(payload); } }
export const eventforge = () => new EventForge();
`,
  "eventforge-test": `import { describe, expect, it } from "vitest"; import { eventforge } from "./index.js";
it("e", async ()=>{ const b=eventforge(); const l:number[]=[]; b.on("x",async (n:number)=>l.push(n)); await b.emit("x",2); expect(l).toEqual([2]); });
`,
  "routeblocks-index": `import type { RequestHandler, Router } from "express"; import { Router as R } from "express";
export class RouteBlocks { private m: RequestHandler[] = []; auth(...mw: RequestHandler[]){ this.m.push(...mw); return this; }
build(fn:(r:Router)=>void): Router { const r=R(); for(const x of this.m) r.use(x); fn(r); return r; } }
export const routeblocks = () => new RouteBlocks();
`,
  "routeblocks-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { routeblocks } from "./index.js";
it("rb", async ()=>{ const app=express(); const r=routeblocks().auth((_q,_r,n)=>n()).build(x=>{x.get("/",(_q,res)=>res.json({ok:1}))}); app.use(r);
expect((await request(app).get("/")).body.ok).toBe(1); });
`,
  "cacheforge-index": `export interface CEntry<T> { value: T; expiresAt: number; tags: string[] }
export class CacheForge { private store = new Map<string, CEntry<unknown>>();
set<T>(k: string, v: T, ttlMs: number, tags: string[] = []) { this.store.set(k, { value: v, expiresAt: Date.now()+ttlMs, tags }); }
get<T>(k: string): T|undefined { const e=this.store.get(k); if(!e||e.expiresAt<Date.now()) return undefined; return e.value as T; }
invalidateTag(t: string){ for(const [k,e] of this.store){ if(e.tags.includes(t)) this.store.delete(k); } } }
export const cacheforge = () => new CacheForge();
`,
  "cacheforge-test": `import { describe, expect, it } from "vitest"; import { cacheforge } from "./index.js";
it("c", ()=>{ const c=cacheforge(); c.set("a",1,10000,["t"]); expect(c.get("a")).toBe(1); c.invalidateTag("t"); expect(c.get("a")).toBeUndefined(); });
`,
  "apilifecycle-index": `import type { RequestHandler } from "express";
export function apilifecycleDeprecation(sunset: string): RequestHandler {
return (_req,res,next)=>{ res.setHeader("Deprecation","true"); res.setHeader("Sunset", sunset); next(); }; }
export function apilifecycleVersionGate(min: string, getVer: (req: { headers: { [k:string]: string|string[]|undefined }})=>string|undefined): RequestHandler {
return (req,res,next)=>{ const v=getVer(req as never); if(!v||v<min){res.status(426).json({error:"upgrade_client",min});return;} next(); };
}
`,
  "apilifecycle-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { apilifecycleDeprecation, apilifecycleVersionGate } from "./index.js";
it("a", async ()=>{ const app=express(); app.get("/d", apilifecycleDeprecation("Wed, 11 Nov 2026 00:00:00 GMT"), (_q,res)=>res.send("x"));
const h=await request(app).get("/d"); expect(h.headers.deprecation).toBe("true");
app.get("/v", apilifecycleVersionGate("2", ()=>"1"), (_q,res)=>res.send("ok")); expect((await request(app).get("/v")).status).toBe(426); });
`,
  "queueflow-index": `export class QueueFlow { private m = new Map<string, (p: unknown)=>Promise<void>>();
register(name: string, fn: (p: unknown)=>Promise<void>){ this.m.set(name, fn); return this; }
async push(name: string, payload: unknown, tries=2){ const fn=this.m.get(name); if(!fn) throw new Error("queueflow: unknown "+name); let last: unknown;
for(let i=0;i<=tries;i++){ try{ await fn(payload); return; }catch(e){ last=e; if(i===tries)throw e;} } throw last; } }
export const queueflow = () => new QueueFlow();
`,
  "queueflow-test": `import { describe, expect, it } from "vitest"; import { queueflow } from "./index.js";
it("q", async ()=>{ const q=queueflow(); const l:number[]=[]; q.register("orders",async (p)=>l.push(p as number)); await q.push("orders",7); expect(l).toEqual([7]); });
`,
  "plugstack-index": `export interface Plug<T> { name: string; init: (ctx: T) => void | Promise<void> }
export class PlugStack<T> { private plugs: Plug<T>[] = []; use(p: Plug<T>){ this.plugs.push(p); return this; }
async boot(ctx: T){ for(const p of this.plugs) await p.init(ctx); } }
export const plugstack = <T>() => new PlugStack<T>();
`,
  "plugstack-test": `import { describe, expect, it } from "vitest"; import { plugstack } from "./index.js";
it("p", async ()=>{ const ps=plugstack<{n:number}>(); let x=0; ps.use({name:"a",init:async ctx=>{x+=ctx.n}}); await ps.boot({n:2}); expect(x).toBe(2); });
`,
  "midflow-index": `import type { NextFunction, Request, RequestHandler, Response } from "express";
export function midflow(...m: RequestHandler[]): RequestHandler {
return (req: Request, res: Response, next: NextFunction) => { let i = 0; const run = (err?: unknown) => {
if(err)return next(err); if(i>=m.length)return next(); const fn=m[i++]!; Promise.resolve(fn(req,res,run as NextFunction)).catch(next);
}; run(); }; }
`,
  "midflow-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { midflow } from "./index.js";
it("m", async ()=>{ const app=express(); let n=0; app.get("/", midflow((_q,_r,nx)=>{n++;nx();},(_q,res)=>res.json({n}))); expect((await request(app).get("/")).body.n).toBe(1); });
`,
  "statemesh-index": `export interface SMDef<S extends string, E extends string> { initial: S; transitions: Record<S, Partial<Record<E, S>>>; }
export class StateMesh<S extends string, E extends string> {
constructor(private def: SMDef<S,E>, private st: S) {}
get state(){return this.st}
async send(ev: E){ const next=this.def.transitions[this.st]?.[ev]; if(!next)throw new Error("statemesh: illegal "+ev); this.st=next; }
}
export const statemesh = <S extends string, E extends string>(d: SMDef<S,E>) => new StateMesh(d, d.initial);
`,
  "statemesh-test": `import { describe, expect, it } from "vitest"; import { statemesh } from "./index.js";
it("s", async ()=>{ type S="a"|"b"; type E="go"; const m=statemesh<S,E>({initial:"a",transitions:{a:{go:"b"},b:{}}}); await m.send("go"); expect(m.state).toBe("b"); });
`,
  "testforge-index": `export const testforge = { version: "0.1.0" as const };
`,
  "testforge-cli": `import pc from "picocolors"; import { writeFile } from "node:fs/promises"; import { resolve } from "node:path";
async function main(){ const [,,cmd,out]=process.argv; if(cmd==="generate"){ const p=resolve(out??"generated.test.ts");
await writeFile(p, "import { describe, it, expect } from \\"vitest\\";\\ndescribe(\\"gen\\", () => { it(\\"ok\\", () => expect(1).toBe(1)); });\\n", "utf8");
console.log(pc.green("Wrote"), p); return; } console.log(pc.cyan("testforge"), "generate [file]"); process.exit(cmd?1:0); }
void main().catch(e=>{console.error(e);process.exit(1);});
`,
  "testforge-test": `import { describe, expect, it } from "vitest"; import { testforge } from "./index.js"; it("t", ()=>expect(testforge.version).toBe("0.1.0"));
`,
  "dbflow-index": `export interface Repo<T, F> { findMany(filter: F): Promise<T[]>; findOne(filter: F): Promise<T|null>; save(doc: T): Promise<T>; remove(filter: F): Promise<number> }
export function dbflowRepo<T, F>(impl: Repo<T,F>): Repo<T,F> { return impl; }
`,
  "dbflow-test": `import { describe, expect, it } from "vitest"; import { dbflowRepo } from "./index.js";
it("d", async ()=>{ const r=dbflowRepo<{id:string},{id:string}>({
findMany: async (f) => (f.id ? [{ id: f.id }] : []),
findOne: async () => null, save: async (d) => d, remove: async () => 0 });
expect((await r.findMany({ id: "1" })).length).toBe(1); });
`,

  "metricpress-index": `import type { NextFunction, Request, Response } from "express";
const ms = new Map<string, { count: number; ms: number }>();
export function metricpress() {
return (req: Request, res: Response, next: NextFunction) => { const t=Date.now(); res.on("finish", ()=>{ const key=req.method+" "+req.path; const x=ms.get(key)??{count:0,ms:0}; x.count++; x.ms+=Date.now()-t; ms.set(key,x); }); next(); }; }
export function metricpressSnapshot(){ return Object.fromEntries(ms); }
export function metricpressReset(){ ms.clear(); }
`,
  "metricpress-test": `import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { metricpress, metricpressReset, metricpressSnapshot } from "./index.js";
it("m", async ()=>{ metricpressReset(); const app=express(); app.get("/", metricpress(), (_q,res)=>res.send("x"));
await request(app).get("/"); const s=metricpressSnapshot(); expect(Object.keys(s).length).toBeGreaterThan(0); });
`,
  "configforge-index": `import { z, type ZodTypeAny } from "zod";
export function configforgeLoad<S extends ZodTypeAny>(schema: S, layers: unknown[]) {
let acc: unknown = {};
for(const L of layers) acc = { ...(acc as object), ...(L as object) };
return schema.parse(acc) as z.infer<S>;
}
export { z };
`,
  "configforge-test": `import { describe, expect, it } from "vitest"; import { z } from "zod"; import { configforgeLoad } from "./index.js";
it("c", ()=>{ const r=configforgeLoad(z.object({port:z.number()}), [{},{port:3000}]); expect(r.port).toBe(3000); });
`,
  "docstack-index": `export const docstack = { version: "0.1.0" as const };
`,
  "docstack-cli": `import pc from "picocolors"; import { readFile, writeFile } from "node:fs/promises"; import { resolve } from "node:path";
async function main(){ const [,,cmd,out]=process.argv; if(cmd==="generate"){ const pj=JSON.parse(await readFile(resolve("package.json"),"utf8")) as {name?:string;description?:string};
const md="\\n## " + (pj.name??"package") + "\\n\\n" + (pj.description??"") + "\\n";
await writeFile(resolve(out??"ARCHITECTURE.generated.md"), md, "utf8"); console.log(pc.green("Wrote")); return; }
console.log(pc.cyan("docstack"), "generate [out.md]"); process.exit(cmd?1:0); }
void main().catch(e=>{console.error(e);process.exit(1);});
`,
  "docstack-test": `import { describe, expect, it } from "vitest"; import { docstack } from "./index.js"; it("d", ()=>expect(docstack.version).toBe("0.1.0"));
`,
  "lockmesh-index": `export class LockMesh { private locks = new Map<string, number>();
async withLock<T>(key: string, ttlMs: number, fn: ()=>Promise<T>): Promise<T> {
const now=Date.now(); const until=this.locks.get(key)??0; if(until>now) throw new Error("lockmesh: busy "+key);
this.locks.set(key, now+ttlMs); try { return await fn(); } finally { this.locks.delete(key); } } }
export const lockmesh = () => new LockMesh();
`,
  "lockmesh-test": `import { describe, expect, it } from "vitest"; import { lockmesh } from "./index.js";
it("l", async ()=>{ const x=lockmesh(); const hold=x.withLock("k",5000,async()=>{ await new Promise(r=>setTimeout(r,30)); return 1; }); await expect(x.withLock("k",5000,async()=>0)).rejects.toThrow(/busy/); expect(await hold).toBe(1); });
`, 
};

for (const p of defs) {
  mk(p.n);
  wf(join(root, p.n, "package.json"), pkg(p));
  wf(join(root, p.n, "tsconfig.json"), JSON.stringify(stdTsconfig, null, 2));
  wf(join(root, p.n, "tsup.config.ts"), p.bin ? tsupCli : tsupStd);
  const key = p.n + "-index";
  wf(join(root, p.n, "src", "index.ts"), src[key]);
  wf(join(root, p.n, "src", "index.test.ts"), src[p.n + "-test"]);
  wf(
    join(root, p.n, "README.md"),
    rd(
      p.n,
      p.d.replace(/^[^:]+:\s*/, "") + " See `src/index.ts` for the public API surface."
    )
  );
  if (p.bin) {
    wf(join(root, p.n, "src", "cli.ts"), src[p.n + "-cli"]);
    wf(join(root, p.n, `${p.n}.cjs`), "#!/usr/bin/env node\nrequire(\"./dist/cli.cjs\");\n");
  }
}

console.log("wave6 ok", defs.length);
