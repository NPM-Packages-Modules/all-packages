import { describe, expect, it } from "vitest";
import { componentUsageScanner } from "./index.js";

it("scan", () => {
  const r = componentUsageScanner.scan(["UserModal", "App"]);
  expect(r.unused).toContain("UserModal");
});
