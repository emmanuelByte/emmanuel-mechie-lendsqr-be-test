// tests/unit/services/TransactionService.test.ts

import TransactionService from "../../../src/services/TransactionService";
import WalletRepository from "../../../src/repositories/WalletRepository";
import TransactionRepository from "../../../src/repositories/TransactionRepository";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("../../../src/repositories/WalletRepository");
jest.mock("../../../src/repositories/TransactionRepository");

describe("TransactionService", () => {
  const user_id = 1;
  const wallet = { id: 1, user_id, balance: 500 };

  const transactions = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    wallet_id: wallet.id,
    amount: 100 + i,
    type: "deposit",
    status: "success",
    reference: `ref-${i}`,
    created_at: new Date(),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return paginated transactions", async () => {
    (WalletRepository.findByUserId as jest.Mock).mockResolvedValue(wallet);
    (
      TransactionRepository.getWalletTransactionsPaginated as jest.Mock
    ).mockResolvedValue({
      transactions: transactions.slice(5, 10), // Page 2, limit 5
      total: transactions.length,
    });

    const page = 2;
    const limit = 5;

    const result = await TransactionService.getUserTransactions(
      user_id,
      page,
      limit
    );

    expect(result.data.length).toBe(limit);
    expect(result.meta.total_items).toBe(transactions.length);
    expect(result.meta.current_page).toBe(page);
    expect(result.meta.total_pages).toBe(
      Math.ceil(transactions.length / limit)
    );
  });

  it("should throw if wallet not found", async () => {
    (WalletRepository.findByUserId as jest.Mock).mockResolvedValue(null);

    await expect(
      TransactionService.getUserTransactions(user_id)
    ).rejects.toThrow(BadRequestError);
  });

  it("should return empty data if no transactions found", async () => {
    (WalletRepository.findByUserId as jest.Mock).mockResolvedValue(wallet);
    (
      TransactionRepository.getWalletTransactionsPaginated as jest.Mock
    ).mockResolvedValue({
      transactions: [],
      total: 0,
    });

    const { data, meta } = await TransactionService.getUserTransactions(
      user_id
    );

    expect(data).toEqual([]);
    expect(meta.total_items).toBe(0);
    expect(meta.total_pages).toBe(0);
  });
});
