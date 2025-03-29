// tests/integration/transaction.integration.test.ts
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/db";
import crypto from "crypto";

let token: string;

function generateUniqueEmail() {
  return `txn_${crypto.randomUUID()}@mail.com`;
}

function generateRandomPhoneNumber() {
  return `+234701${Math.floor(1000000 + Math.random() * 9000000)}`;
}

beforeAll(async () => {
  const email = generateUniqueEmail();

  await request(app).post("/api/v1/auth/signup").send({
    first_name: "Transaction",
    last_name: "User",
    email,
    phone_number: generateRandomPhoneNumber(),
    password: "Password@123",
  });

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email,
    password: "Password@123",
  });

  token = loginRes.body.data?.token;

  if (!token) throw new Error("Login failed. Token not returned.");

  // Fund wallet to generate a transaction
  await request(app)
    .post("/api/v1/wallets/fund")
    .set("Authorization", `Bearer ${token}`)
    .send({ amount: 250 });
});

describe("Transaction API Integration", () => {
  it("should return paginated transactions", async () => {
    const res = await request(app)
      .get("/api/v1/wallets/transactions?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("total_items");
    expect(res.body.meta).toHaveProperty("current_page", 1);
  });

  it("should return empty result if no transactions found (with high page number)", async () => {
    const res = await request(app)
      .get("/api/v1/wallets/transactions?page=99&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });
});

afterAll(async () => {
  await db.destroy();
});
