import { describe, expect, it } from "vitest";
import { z } from "zod"; import { apiduo } from "./index.js";
it("apiduo", () => { const u = apiduo({ name: "User", schema: z.object({ email: z.string() }) });
expect(u.restBase).toBe("/api/users"); expect(u.graphqlSDL).toContain("type User"); });
