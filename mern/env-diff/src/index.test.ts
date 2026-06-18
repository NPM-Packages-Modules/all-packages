import { describe, expect, it } from "vitest";
import { envDiff } from "./index.js";

it("compare", () => {
  const r = envDiff.compare({ local: ["JWT_SECRET"], staging: [] });
  expect(r.missing).toContain("JWT_SECRET");
});
