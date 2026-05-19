import { describe, it, expect } from "vitest";
import { routeforge } from "./index.js";

describe("routeforge", () => {
  it("exports scaffold API", () => {
    expect(routeforge()).toEqual({ ok: true, package: "routeforge" });
  });
});
