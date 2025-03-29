// tests/e2e/user.e2e.test.ts
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/db";
import crypto from "crypto";

function generateUniqueEmail() {
  return `e2e_${crypto.randomUUID()}@mail.com`;
}

function generateRandomPhoneNumber() {
  return `+234701${Math.floor(1000000 + Math.random() * 9000000)}`;
}

describe("E2E - User Registration & Wallet Creation", () => {
  let token: string;

  it("should register user and auto-create wallet", async () => {
    const email = generateUniqueEmail();
    const phone = generateRandomPhoneNumber();

    const res = await request(app).post("/api/v1/auth/signup").send({
      first_name: "E2E",
      last_name: "Tester",
      email,
      phone_number: phone,
      password: "Password@123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();

    token = res.body.data.token;

    // Check wallet created
    const walletRes = await request(app)
      .get("/api/v1/wallets")
      .set("Authorization", `Bearer ${token}`);

    expect(walletRes.statusCode).toBe(200);
    expect(walletRes.body.data.account_number).toBeDefined();
    expect(walletRes.body.data.balance).toBe("0.00");
    expect(walletRes.body.data.user_id).toBeDefined();
  });

  afterAll(async () => {
    await db.destroy();
  });
});
