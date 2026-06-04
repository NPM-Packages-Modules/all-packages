import { describe, expect, it } from "vitest"; import { queueflowkit } from "./index.js";
it("q", async ()=>{ const q=queueflowkit(); const l:number[]=[]; q.register("orders",async (p)=>l.push(p as number)); await q.push("orders",7); expect(l).toEqual([7]); });
