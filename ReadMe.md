# LendSQR Wallet Service 💸

This is a **Wallet System** built for the LendSQR Assessment. It enables users to:

- Create an account
- Fund their wallet
- Transfer funds to another user
- Withdraw funds
- View transaction history
- Enforce blacklist checks via Lendsqr Adjutor Karma API

---

## 🚀 Tech Stack

- **Node.js (v18+)**
- **TypeScript**
- **Express**
- **Knex.js** (ORM)
- **MySQL**
- **Jest** (unit, integration, e2e tests)
- **Supertest** (API testing)
- **JWT** (faux auth)

---

## 🧠 Architecture

The system follows a layered architecture:

- `controllers/` – Handles HTTP layer
- `services/` – Business logic
- `repositories/` – DB access via Knex
- `models/` – DB schema abstraction
- `middlewares/` – Error/auth handling
- `utils/` – Helpers (JWT, hashing, etc.)

---

## 🧾 Project Setup

1. Clone repo

2. Install deps: npm install

3. Setup .env with your config (see .env.example)

4. Run migrations: npx knex migrate:latest

5. Start server: npm run dev

## 📁 Folder Structure

```bash
src/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── validate/
├── migrations/
└── server.ts
```

## 🔐 Authentication

This system uses **faux JWT-based authentication**. Upon login, users receive a token which must be sent in the `Authorization: Bearer <token>` header for secured endpoints.

---

## 🔗 API Endpoints

### Auth

- `POST /api/v1/auth/signup` – Register new user
- `POST /api/v1/auth/login` – Login and receive JWT

### Wallet

- `POST /api/v1/wallets/fund` – Fund wallet
- `POST /api/v1/wallets/withdraw` – Withdraw funds
- `GET /api/v1/wallets` – Get wallet for current user
- `GET /api/v1/wallets/:account_number` – Get wallet by account number

### Transfer

- `POST /api/v1/wallets/transfer/initiate` – Start transfer session
- `POST /api/v1/wallets/transfer/complete` – Complete a transfer

### Transactions

- `GET /api/v1/wallets/transactions?page=1&limit=10` – Paginated transactions

---

## ❌ Karma Blacklist Enforcement

Before account creation, the system checks the [Lendsqr Adjutor Karma API](https://karma.lendsqr.com) to ensure the user is not blacklisted.

---

## 🧪 Testing Strategy

All layers are thoroughly tested:

- ✅ Unit tests for services/utils
- ✅ Integration tests for routes & logic
- ✅ E2E tests simulating user flows

### Run all tests

```bash
npm test
```

### Run a specific suite

```bash
npm test -- tests/integration/wallet.integration.test.ts
```

### ER Diagram

You can view the full DB structure [here](https://diagram.com)

### 🌐 Deployment

Live URL: https://<your-name>-lendsqr-be-test.<your-platform>.app
