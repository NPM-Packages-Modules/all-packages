import { describe, it, expect } from "vitest";
import { querygenie } from "./index.js";

describe("querygenie", () => {
  it("exports scaffold API", () => {
    expect(querygenie()).toEqual({ ok: true, package: "querygenie" });
  });
});
