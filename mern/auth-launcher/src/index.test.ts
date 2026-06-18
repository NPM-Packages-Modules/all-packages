import { describe, expect, it } from "vitest";
import { authLauncher } from "./index.js";

it("install", () => {
  expect(authLauncher.install().features).toContain("JWT");
});
