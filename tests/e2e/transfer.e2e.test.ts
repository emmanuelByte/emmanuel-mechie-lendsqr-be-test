// tests/e2e/transfer.e2e.test.ts
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/db";
import crypto from "crypto";

function genEmail(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}@mail.com`;
}

function genPhone() {
  return `+234701${Math.floor(1000000 + Math.random() * 9000000)}`;
}

describe("E2E - Wallet Transfer Flow", () => {
  let tokenA: string;
  let tokenB: string;
  let accountB: string;
  const transferAmount = 200;

  beforeAll(async () => {
    // Register and fund User A
    const signupA = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        first_name: "User",
        last_name: "A",
        email: genEmail("userA"),
        phone_number: genPhone(),
        password: "Password@123",
      });
    tokenA = signupA.body.data.token;

    await request(app)
      .post("/api/v1/wallets/fund")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ amount: 1000 });

    // Register User B (Recipient)
    const signupB = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        first_name: "User",
        last_name: "B",
        email: genEmail("userB"),
        phone_number: genPhone(),
        password: "Password@123",
      });
    tokenB = signupB.body.data.token;

    // Get User B's wallet account number
    const resB = await request(app)
      .get("/api/v1/wallets")
      .set("Authorization", `Bearer ${tokenB}`);
    accountB = resB.body.data.account_number;
  });

  it("should initiate a transfer session", async () => {
    const res = await request(app)
      .post("/api/v1/wallets/transfer/initiate")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        recipient_account_number: accountB,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.session_id).toBeDefined();

    const sessionId = res.body.data.session_id;

    // complete transfer
    const complete = await request(app)
      .post("/api/v1/wallets/transfer/complete")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        session_id: sessionId,
        amount: transferAmount,
        narration: "E2E test transfer",
      });

    expect(complete.statusCode).toBe(200);
    expect(complete.body.message).toBe("Transfer completed successfully");
    expect(complete.body.data.from.balance).toBeDefined();
  });

  afterAll(async () => {
    await db.destroy();
  });
});
