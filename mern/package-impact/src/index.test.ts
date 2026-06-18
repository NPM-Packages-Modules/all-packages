import { describe, expect, it } from "vitest";
import { packageImpact } from "./index.js";

it("analyze", () => {
  expect(packageImpact.analyze("axios").bundleKb).toBeGreaterThan(0);
});
