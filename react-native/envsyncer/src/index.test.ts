import { describe, it, expect } from "vitest";
import { envsyncerx } from "./index.js";

describe("envsyncerx", () => {
  it("exports scaffold API", () => {
    expect(envsyncerx()).toEqual({ ok: true, package: "envsyncerx" });
  });
});
