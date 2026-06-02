import { describe, expect, it } from "vitest"; import { cacheforgex } from "./index.js";
it("c", ()=>{ const c=cacheforgex(); c.set("a",1,10000,["t"]); expect(c.get("a")).toBe(1); c.invalidateTag("t"); expect(c.get("a")).toBeUndefined(); });
