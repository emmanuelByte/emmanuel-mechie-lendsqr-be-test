// tests/e2e/fund.e2e.test.ts
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/db";
import crypto from "crypto";
import { ITransaction } from "../../src/models/TransactionModel";

function generateUniqueEmail() {
  return `e2e_fund_${crypto.randomUUID()}@mail.com`;
}

function generateRandomPhoneNumber() {
  return `+234701${Math.floor(1000000 + Math.random() * 9000000)}`;
}

describe("E2E - Fund Wallet & Check Transactions", () => {
  let token: string;
  let amount = 1000;

  beforeAll(async () => {
    const email = generateUniqueEmail();
    const phone = generateRandomPhoneNumber();

    const signupRes = await request(app).post("/api/v1/auth/signup").send({
      first_name: "E2E",
      last_name: "Funder",
      email,
      phone_number: phone,
      password: "Password@123",
    });

    token = signupRes.body.data.token;
  });

  it("should fund wallet", async () => {
    const res = await request(app)
      .post("/api/v1/wallets/fund")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount });

    expect(res.statusCode).toBe(200);
    expect(parseFloat(res.body.data.balance)).toBeGreaterThanOrEqual(amount);
  });

  it("should list funding transaction", async () => {
    const res = await request(app)
      .get("/api/v1/wallets/transactions?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    const data = res.body.data as ITransaction[];

    expect(res.body.meta).toBeDefined();
    expect(res?.body?.data?.length).toBeGreaterThan(0);

    const found = data.find(
      (txn) => txn.type === "deposit" && txn.amount == amount
    );

    expect(found).toBeDefined();
    expect(found?.narration).toContain(`Wallet funded with ₦${amount}`);
  });

  afterAll(async () => {
    await db.destroy();
  });
});
