import { describe, it, expect } from "vitest";
import { secureflowkit } from "./index.js";

describe("secureflowkit", () => {
  it("exports scaffold API", () => {
    expect(secureflowkit()).toEqual({ ok: true, package: "secureflowkit" });
  });
});
