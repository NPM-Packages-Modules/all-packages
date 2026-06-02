import { describe, expect, it } from "vitest"; import express from "express"; import request from "supertest"; import { ctrlflowx } from "./index.js";
it("cf", async () => { const app=express(); const r=ctrlflowx().use((_q,_r,n)=>n()).toRouter(x=>{x.get("/",(_q,res)=>res.json({ok:1}))}); app.use(r);
expect((await request(app).get("/")).body.ok).toBe(1); });
