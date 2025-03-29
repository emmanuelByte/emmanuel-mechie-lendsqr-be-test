// tests/integration/auth.integration.test.ts
import request from "supertest";
import db from "../../src/config/db";
import app from "../../src/app";

describe("Auth Integration Tests", () => {
  const testUser = {
    first_name: "Jane",
    last_name: "Doe",
    email: "janedoe@example.com",
    phone_number: "+2347012345678",
    password: "Password@123",
  };

  afterAll(async () => {
    // Clean up DB
    await db("users").where({ email: testUser.email }).del();
    await db.destroy(); // close DB connection
  });

  it("should sign up a new user successfully", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should not allow duplicate registration", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: "WrongPassword123!",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });
});
