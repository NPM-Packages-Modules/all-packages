import { describe, expect, it } from "vitest";
import { deployTemplate } from "./index.js";

it("generate", () => {
  expect(deployTemplate.generate()).toContain("Dockerfile");
});
