import { describe, it, expect } from "vitest";
import { routeforgex } from "./index.js";

describe("routeforgex", () => {
  it("creates a resource scaffold", async () => {
    await expect(routeforgex.create("products")).resolves.toEqual({
      resource: "products",
      ok: true,
    });
  });
});
