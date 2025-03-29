import { v4 as uuidv4 } from "uuid";
import TransferSessionRepository from "../repositories/TransferSessionRepository";
import WalletRepository from "../repositories/WalletRepository";
import WalletService from "./WalletService";
import { BadRequestError } from "../utils/error";
import db from "../config/db";

class TransferService {
  async initiateTransfer(user_id: number, recipient_account_number: string) {
    const recipientWallet = await WalletRepository.getWalletByAccountNumber(
      recipient_account_number
    );
    if (!recipientWallet)
      throw new BadRequestError("Recipient wallet not found");

    if (recipientWallet.user_id === user_id) {
      throw new BadRequestError("You cannot transfer to yourself");
    }

    const session_id = uuidv4();
    const expires_at = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    const session = await TransferSessionRepository.create({
      user_id,
      account_number: recipientWallet?.account_number,

      session_id,
      expires_at,
    });

    return {
      session_id: session.session_id,
      recipient: {
        account_number: recipientWallet.account_number,
        user_id: recipientWallet.user_id,
      },
      expires_at,
    };
  }

  async completeTransfer(
    user_id: number,
    session_id: string,
    amount: number,
    narration: string
  ) {
    return db.transaction(async (trx) => {
      const session = await TransferSessionRepository.findBySessionId(
        session_id
      );
      if (!session) throw new BadRequestError("Invalid or expired session");

      if (session.user_id !== user_id) {
        throw new BadRequestError("Unauthorized transfer session");
      }

      const recipientWallet = await WalletRepository.getWalletByAccountNumber(
        session.account_number
      );
      if (!recipientWallet)
        throw new BadRequestError("Recipient wallet not found");

      // 🔁 Pass transaction context into WalletService.transfer
      const result = await WalletService.transfer(
        session.user_id,
        recipientWallet.account_number,
        amount,
        narration,
        trx // pass trx into WalletService
      );

      // 🧹 Only delete the session after successful transfer
      await TransferSessionRepository.deleteBySessionId(session_id, trx);

      return result;
    });
  }
}

export default new TransferService();
