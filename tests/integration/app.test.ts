import request from "supertest";
import app from "../../src/app";

describe("App Smoke Tests", () => {
  it("should respond on root route", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Lendsqr Wallet Service is running 🚀");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/unknown");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should have helmet headers set", async () => {
    const res = await request(app).get("/");

    expect(res.headers["x-dns-prefetch-control"]).toBe("off");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("should parse JSON requests", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({}) // intentionally invalid
      .set("Content-Type", "application/json");

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
