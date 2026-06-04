import { describe, it, expect } from "vitest";
import { stacktracekit } from "./index.js";

describe("stacktracekit", () => {
  it("exports scaffold API", () => {
    expect(stacktracekit()).toEqual({ ok: true, package: "stacktracekit" });
  });
});
