import TransferService from "../../../src/services/TransferService";
import WalletRepository from "../../../src/repositories/WalletRepository";
import TransferSessionRepository from "../../../src/repositories/TransferSessionRepository";
import WalletService from "../../../src/services/WalletService";
import { BadRequestError } from "../../../src/utils/error";

jest.mock("../../../src/repositories/WalletRepository");
jest.mock("../../../src/repositories/TransferSessionRepository");
jest.mock("../../../src/services/WalletService");

describe("TransferService", () => {
  const user_id = 1;
  const recipient_id = 2;
  const recipient_account_number = "1234567890";
  const session_id = "test-session-id";

  const recipientWallet = {
    id: 99,
    user_id: recipient_id,
    account_number: recipient_account_number,
    balance: 500,
  };

  const session = {
    user_id,
    account_number: recipient_account_number,
    session_id,
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------
  describe("initiateTransfer", () => {
    it("should create a new transfer session", async () => {
      (
        WalletRepository.getWalletByAccountNumber as jest.Mock
      ).mockResolvedValue(recipientWallet);
      (TransferSessionRepository.create as jest.Mock).mockResolvedValue({
        ...session,
        id: 1,
        created_at: new Date(),
      });

      const result = await TransferService.initiateTransfer(
        user_id,
        recipient_account_number
      );

      expect(WalletRepository.getWalletByAccountNumber).toHaveBeenCalledWith(
        recipient_account_number
      );
      expect(TransferSessionRepository.create).toHaveBeenCalled();
      expect(result.session_id).toBeDefined();
      expect(result.recipient.account_number).toBe(recipient_account_number);
    });

    it("should throw if transferring to self", async () => {
      const selfWallet = { ...recipientWallet, user_id };

      (
        WalletRepository.getWalletByAccountNumber as jest.Mock
      ).mockResolvedValue(selfWallet);

      await expect(
        TransferService.initiateTransfer(user_id, recipient_account_number)
      ).rejects.toThrow(/cannot transfer to yourself/i);
    });

    it("should throw if recipient wallet not found", async () => {
      (
        WalletRepository.getWalletByAccountNumber as jest.Mock
      ).mockResolvedValue(null);

      await expect(
        TransferService.initiateTransfer(user_id, recipient_account_number)
      ).rejects.toThrow(/recipient wallet not found/i);
    });
  });

  // ---------------------------
  describe("completeTransfer", () => {
    const amount = 300;
    const narration = "For lunch";

    it("should complete transfer and delete session", async () => {
      (
        TransferSessionRepository.findBySessionId as jest.Mock
      ).mockResolvedValue(session);
      (
        WalletRepository.getWalletByAccountNumber as jest.Mock
      ).mockResolvedValue(recipientWallet);
      (WalletService.transfer as jest.Mock).mockResolvedValue({
        from: { account_number: "1234567890", balance: 700 },
        to: { account_number: "0987654321", balance: 500 },
      });
      (
        TransferSessionRepository.deleteBySessionId as jest.Mock
      ).mockResolvedValue(undefined);

      const result = await TransferService.completeTransfer(
        user_id,
        session_id,
        amount,
        narration
      );

      expect(TransferSessionRepository.findBySessionId).toHaveBeenCalledWith(
        session_id
      );
      expect(WalletService.transfer).toHaveBeenCalledWith(
        user_id,
        recipient_account_number,
        amount,
        narration,
        expect.anything()
      );
      expect(TransferSessionRepository.deleteBySessionId).toHaveBeenCalledWith(
        session_id,
        expect.anything()
      );
      expect(result).toHaveProperty("from");
      expect(result).toHaveProperty("to");
    });

    it("should throw if session not found or expired", async () => {
      (
        TransferSessionRepository.findBySessionId as jest.Mock
      ).mockResolvedValue(null);

      await expect(
        TransferService.completeTransfer(user_id, session_id, amount, narration)
      ).rejects.toThrow(/invalid or expired session/i);
    });

    it("should throw if session is for another user", async () => {
      (
        TransferSessionRepository.findBySessionId as jest.Mock
      ).mockResolvedValue({
        ...session,
        user_id: 999,
      });

      await expect(
        TransferService.completeTransfer(user_id, session_id, amount, narration)
      ).rejects.toThrow(/unauthorized/i);
    });

    it("should throw if recipient wallet not found", async () => {
      (
        TransferSessionRepository.findBySessionId as jest.Mock
      ).mockResolvedValue(session);
      (
        WalletRepository.getWalletByAccountNumber as jest.Mock
      ).mockResolvedValue(null);

      await expect(
        TransferService.completeTransfer(user_id, session_id, amount, narration)
      ).rejects.toThrow(/recipient wallet not found/i);
    });
  });
});
