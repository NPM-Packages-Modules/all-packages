import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { mockpressx } from "../src/index.js";

describe("mockpressx", () => {
  it("mirrors routes from source app", async () => {
    const real = express();
    real.get("/api/x", (_q, res) => res.send("real"));
    real.post("/api/y", (_q, res) => res.send("real"));
    const m = mockpressx(real);
    const g = await request(m).get("/api/x");
    expect(g.status).toBe(200);
    expect(g.body._mock).toBe(true);
    expect(g.body.path).toBe("/api/x");
    const p = await request(m).post("/api/y");
    expect(p.body.method).toBe("POST");
  });
});
