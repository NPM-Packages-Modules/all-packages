import { describe, expect, it } from "vitest";
import { migrationPreview } from "./index.js";

it("run", () => {
  expect(migrationPreview.run({ collection: "users", affected: 50_000 }).affected).toBe(50_000);
});
