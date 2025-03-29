// tests/e2e/withdraw.e2e.test.ts
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/db";
import crypto from "crypto";

function genEmail() {
  return `withdraw_${crypto.randomUUID()}@mail.com`;
}

function genPhone() {
  return `+234701${Math.floor(1000000 + Math.random() * 9000000)}`;
}

describe("E2E - Withdraw Funds", () => {
  let token: string;

  beforeAll(async () => {
    const signup = await request(app).post("/api/v1/auth/signup").send({
      first_name: "Withdraw",
      last_name: "Test",
      email: genEmail(),
      phone_number: genPhone(),
      password: "Password@123",
    });

    token = signup.body.data.token;

    // Fund wallet
    await request(app)
      .post("/api/v1/wallets/fund")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 500 });
  });

  it("should withdraw from wallet successfully", async () => {
    const res = await request(app)
      .post("/api/v1/wallets/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 200 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Withdrawal successful");
    expect(res.body.data.balance).toBeDefined();
  });

  afterAll(async () => {
    await db.destroy();
  });
});
