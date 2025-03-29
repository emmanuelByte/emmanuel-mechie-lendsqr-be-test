import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/db";
import crypto from "crypto";

let token: string;
let accountNumber: string;

function generateUniqueEmail() {
  return `wallet_${crypto.randomUUID()}@mail.com`;
}

function generateRandomPhoneNumber() {
  return `+234701${Math.floor(1000000 + Math.random() * 9000000)}`; // unique number
}

beforeAll(async () => {
  const email = generateUniqueEmail();

  await request(app).post("/api/v1/auth/signup").send({
    first_name: "Test",
    last_name: "Wallet",
    email,
    phone_number: generateRandomPhoneNumber(), // unique number
    password: "Password@123",
  });

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email,
    password: "Password@123",
  });

  token = loginRes.body.data?.token;

  if (!token) {
    throw new Error("Login failed. Token not returned.");
  }
});

describe("Wallet API Integration", () => {
  it("should fund wallet", async () => {
    const res = await request(app)
      .post("/api/v1/wallets/fund")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 500 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.balance).toBeDefined();
  });

  it("should fetch wallet by user", async () => {
    const res = await request(app)
      .get("/api/v1/wallets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.account_number).toBeDefined();
    accountNumber = res.body.data.account_number;
  });

  it("should fetch wallet by account number", async () => {
    const res = await request(app)
      .get(`/api/v1/wallets/${accountNumber}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.account_number).toBe(accountNumber);
  });

  it("should initiate and complete transfer", async () => {
    // Fund sender wallet
    await request(app)
      .post("/api/v1/wallets/fund")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 1000 }); // Ensure it's more than transfer amount

    const secondEmail = generateUniqueEmail();
    const password = "Password@123";
    const registerRes = await request(app).post("/api/v1/auth/signup").send({
      first_name: "Second",
      last_name: "User",
      email: secondEmail,
      phone_number: generateRandomPhoneNumber(), // unique number
      password,
    });

    expect(registerRes?.body?.message).toBeDefined();
    expect(registerRes?.body?.message).toBe("User registered successfully");
    expect(registerRes.statusCode).toBe(200);

    expect(registerRes.body.data).toBeDefined();
    // token is inside the registration response
    expect(registerRes.body.data.token).toBeDefined();

    const token2 = registerRes.body.data.token;

    const res2 = await request(app)
      .get("/api/v1/wallets")
      .set("Authorization", `Bearer ${token2}`);
    const recipientAccount = res2.body.data.account_number;

    const initiateRes = await request(app)
      .post("/api/v1/wallets/transfer/initiate")
      .set("Authorization", `Bearer ${token}`)
      .send({ recipient_account_number: recipientAccount });

    expect(initiateRes.statusCode).toBe(200);
    const sessionId = initiateRes.body.data.session_id;

    const completeRes = await request(app)
      .post("/api/v1/wallets/transfer/complete")
      .set("Authorization", `Bearer ${token}`)
      .send({
        session_id: sessionId,
        amount: 100,
        narration: "Test transfer",
      });

    expect(completeRes?.body?.message).toBeDefined();
    expect(completeRes?.body?.message).toBe("Transfer completed successfully");
    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.body.data.from.balance).toBeDefined();
  });

  it("should withdraw from wallet", async () => {
    const res = await request(app)
      .post("/api/v1/wallets/withdraw")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 100 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.balance).toBeDefined();
  });
});

afterAll(async () => {
  await db.destroy();
});
