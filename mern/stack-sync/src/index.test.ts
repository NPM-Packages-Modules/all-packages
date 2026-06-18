import { describe, expect, it } from "vitest";
import { stackSync } from "./index.js";

it("check", () => {
  const r = stackSync.check({ client: ["/gone"], server: ["/users"] });
  expect(r.brokenEndpoints).toContain("/gone");
});
