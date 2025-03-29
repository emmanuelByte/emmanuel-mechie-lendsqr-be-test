// src/services/WalletService.ts
import db from "../config/db";
import WalletRepository from "../repositories/WalletRepository";
import TransactionRepository from "../repositories/TransactionRepository";
import { BadRequestError } from "../utils/error";
import { generateAccountNumber } from "../utils/account";
import { generateReference } from "../utils/reference";
import { Knex } from "knex";

class WalletService {
  async createWallet(user_id: number) {
    const existing = await WalletRepository.findByUserId(user_id);
    if (existing) return existing;
    let account_number: string;

    do {
      account_number = generateAccountNumber();
    } while (await WalletRepository.getWalletByAccountNumber(account_number));

    return await WalletRepository.createWallet(user_id, account_number);
  }

  async getWalletByUserId(user_id: number) {
    const wallet = await WalletRepository.findByUserId(user_id);
    if (!wallet) throw new BadRequestError("Wallet not found");
    return wallet;
  }

  async getWalletByAccountNumber(account_number: string) {
    const wallet = await WalletRepository.getWalletByAccountNumber(
      account_number
    );
    if (!wallet) throw new BadRequestError("Wallet not found");
    return wallet;
  }

  async fund(user_id: number, amount: number) {
    return db.transaction(async (trx) => {
      const wallet = await WalletRepository.findByUserIdWithTrx(user_id, trx);
      if (!wallet) throw new BadRequestError("Wallet not found");

      const old_balance = parseFloat(wallet.balance?.toString());
      const new_balance = old_balance + parseFloat(amount.toString());

      await WalletRepository.updateBalance(
        wallet.id!,
        old_balance,
        new_balance,
        trx
      );

      const reference = generateReference();
      await TransactionRepository.create(
        {
          wallet_id: wallet.id!,
          account_number: wallet.account_number,
          amount,
          old_balance,
          balance: new_balance,
          type: "deposit",
          status: "success",
          reference,
          narration: `Wallet funded with ₦${amount}`,
        },
        trx
      );

      return { ...wallet, old_balance, balance: new_balance };
    });
  }

  async withdraw(user_id: number, amount: number) {
    return db.transaction(async (trx) => {
      const wallet = await WalletRepository.findByUserIdWithTrx(user_id, trx);
      if (!wallet) throw new BadRequestError("Wallet not found");

      const old_balance = parseFloat(wallet.balance?.toString());
      const amt = parseFloat(amount.toString());
      if (old_balance < amt) throw new BadRequestError("Insufficient balance");

      const new_balance = old_balance - amt;

      await WalletRepository.updateBalance(
        wallet.id!,
        old_balance,
        new_balance,
        trx
      );

      const reference = generateReference();
      await TransactionRepository.create(
        {
          wallet_id: wallet.id!,
          account_number: wallet.account_number,
          amount: amt,
          old_balance,
          balance: new_balance,
          type: "withdrawal",
          status: "success",
          reference,
          narration: `Wallet withdrawn ₦${amount}`,
        },
        trx
      );

      return { ...wallet, old_balance, balance: new_balance };
    });
  }

  async transfer(
    user_id: number,
    recipient_account_number: string,
    amount: number,
    narration: string,
    trx: Knex.Transaction
  ) {
    if (!amount || amount <= 0)
      throw new BadRequestError("Amount must be greater than zero");

    const senderWallet = await WalletRepository.findByUserIdWithTrx(
      user_id,
      trx
    );
    if (!senderWallet) throw new BadRequestError("Sender wallet not found");

    const recipientWallet =
      await WalletRepository.getWalletByAccountNumberWithTrx(
        recipient_account_number,
        trx
      );
    if (!recipientWallet)
      throw new BadRequestError("Recipient wallet not found");

    if (senderWallet.id === recipientWallet.id)
      throw new BadRequestError("Cannot transfer to the same wallet");

    const senderOld = parseFloat(senderWallet.balance?.toString());
    const recipientOld = parseFloat(recipientWallet.balance?.toString());
    if (senderOld < amount) throw new BadRequestError("Insufficient funds");

    const senderNew = senderOld - amount;
    const recipientNew = recipientOld + amount;

    await WalletRepository.updateBalance(
      senderWallet.id!,
      senderOld,
      senderNew,
      trx
    );
    await WalletRepository.updateBalance(
      recipientWallet.id!,
      recipientOld,
      recipientNew,
      trx
    );

    await TransactionRepository.create(
      {
        wallet_id: senderWallet.id!,
        account_number: senderWallet.account_number,
        amount,
        old_balance: senderOld,
        balance: senderNew,
        type: "transfer",
        status: "success",
        reference: generateReference(),
        narration: `Transfer to ${recipient_account_number}${
          narration ? " - " + narration : ""
        }`,
      },
      trx
    );

    await TransactionRepository.create(
      {
        wallet_id: recipientWallet.id!,
        account_number: recipientWallet.account_number,
        amount,
        old_balance: recipientOld,
        balance: recipientNew,
        type: "deposit",
        status: "success",
        reference: generateReference(),
        narration: `Transfer from ${senderWallet.account_number}${
          narration ? " - " + narration : ""
        }`,
      },
      trx
    );

    return {
      from: {
        account_number: senderWallet.account_number,
        balance: senderNew,
      },
      to: {
        account_number: recipientWallet.account_number,
        balance: recipientNew,
      },
    };
  }
}

export default new WalletService();
