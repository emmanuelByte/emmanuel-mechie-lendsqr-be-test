import { Knex } from "knex";
import db from "../config/db";
import { IWallet } from "../models/WalletModel";

class WalletRepository {
  async createWallet(
    user_id: number,
    account_number: string
  ): Promise<IWallet> {
    const [wallet] = await db("wallets").insert(
      { user_id, balance: "0.00", account_number },
      ["id", "user_id", "balance", "account_number"]
    );
    return (await this.getWalletById(wallet)) as IWallet;
  }

  async findByUserId(user_id: number): Promise<IWallet | undefined> {
    return db("wallets").where({ user_id }).first();
  }

  async findByUserIdWithTrx(
    user_id: number,
    trx: Knex.Transaction
  ): Promise<IWallet | undefined> {
    return trx("wallets").where({ user_id }).first();
  }

  async getWalletById(wallet_id: number): Promise<IWallet | undefined> {
    return db("wallets").where({ id: wallet_id }).first();
  }

  async getWalletByAccountNumber(
    account_number: string
  ): Promise<IWallet | undefined> {
    return db("wallets").where({ account_number }).first();
  }

  async getWalletByAccountNumberWithTrx(
    account_number: string,
    trx: Knex.Transaction
  ): Promise<IWallet | undefined> {
    return trx("wallets").where({ account_number }).first();
  }

  async updateBalance(
    wallet_id: number,
    old_balance: number,
    balance: number,
    trx: Knex.Transaction
  ): Promise<void> {
    await trx("wallets")
      .where({ id: wallet_id })
      .update({ old_balance, balance });
  }

  async getWalletsByUserId(user_id: number): Promise<IWallet[]> {
    return db("wallets").where({ user_id }).orderBy("created_at", "desc");
  }
}

export default new WalletRepository();
