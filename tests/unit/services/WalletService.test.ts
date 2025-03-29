import WalletService from "../../../src/services/WalletService";
import WalletRepository from "../../../src/repositories/WalletRepository";
import TransactionRepository from "../../../src/repositories/TransactionRepository";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("../../../src/repositories/WalletRepository");
jest.mock("../../../src/repositories/TransactionRepository");

describe("WalletService", () => {
  const user_id = 1;
  const senderWallet = {
    id: 10,
    user_id,
    account_number: "1234567890",
    balance: 1000,
  };
  const recipientWallet = {
    id: 11,
    user_id: 2,
    account_number: "0987654321",
    balance: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------
  describe("fund", () => {
    it("should fund wallet and return updated balance", async () => {
      const amount = 500;
      (WalletRepository.findByUserIdWithTrx as jest.Mock).mockResolvedValue(
        senderWallet
      );
      (WalletRepository.updateBalance as jest.Mock).mockResolvedValue(
        undefined
      );
      (TransactionRepository.create as jest.Mock).mockResolvedValue(undefined);

      const result = await WalletService.fund(user_id, amount);

      expect(result.balance).toBe(senderWallet.balance + amount);
    });

    it("should throw error if wallet not found", async () => {
      (WalletRepository.findByUserIdWithTrx as jest.Mock).mockResolvedValue(
        null
      );
      await expect(WalletService.fund(user_id, 500)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  // ------------------------
  describe("withdraw", () => {
    it("should withdraw from wallet and return updated balance", async () => {
      const amount = 200;
      (WalletRepository.findByUserIdWithTrx as jest.Mock).mockResolvedValue(
        senderWallet
      );
      (WalletRepository.updateBalance as jest.Mock).mockResolvedValue(
        undefined
      );
      (TransactionRepository.create as jest.Mock).mockResolvedValue(undefined);

      const result = await WalletService.withdraw(user_id, amount);
      expect(result.balance).toBe(senderWallet.balance - amount);
    });

    it("should throw error if wallet not found", async () => {
      (WalletRepository.findByUserIdWithTrx as jest.Mock).mockResolvedValue(
        null
      );
      await expect(WalletService.withdraw(user_id, 100)).rejects.toThrow(
        BadRequestError
      );
    });

    it("should throw error if insufficient balance", async () => {
      const lowBalanceWallet = { ...senderWallet, balance: 100 };
      (WalletRepository.findByUserIdWithTrx as jest.Mock).mockResolvedValue(
        lowBalanceWallet
      );
      await expect(WalletService.withdraw(user_id, 500)).rejects.toThrow(
        /insufficient/i
      );
    });
  });
});
