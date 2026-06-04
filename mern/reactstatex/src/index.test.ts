import { describe, it, expect } from "vitest";
import { reactstatemesh } from "./index.js";

describe("reactstatemesh", () => {
  it("exports scaffold API", () => {
    expect(reactstatemesh()).toEqual({ ok: true, package: "reactstatemesh" });
  });
});
