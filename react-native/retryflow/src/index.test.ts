import { describe, it, expect } from "vitest";
import { retryflowkit } from "./index.js";

describe("retryflowkit", () => {
  it("exports scaffold API", () => {
    expect(retryflowkit()).toEqual({ ok: true, package: "retryflowkit" });
  });
});
