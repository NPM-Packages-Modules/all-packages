import { describe, expect, it } from "vitest";
import { policyflowx } from "./index.js";

describe("policyflowx", () => {
  it("honors inheritance and wildcards", () => {
    const p = policyflowx()
      .inherits("editor", "viewer")
      .allowAction("viewer", "posts.read")
      .allowAction("editor", "posts.update")
      .allowAction("admin", "*");
    expect(p.can("viewer", "posts.read")).toBe(true);
    expect(p.can("viewer", "posts.delete")).toBe(false);
    expect(p.can("editor", "posts.read")).toBe(true);
    expect(p.can("admin", "anything")).toBe(true);
  });
});
