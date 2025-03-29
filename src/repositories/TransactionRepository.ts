import { Knex } from "knex";
import db from "../config/db";
import { ITransaction } from "../models/TransactionModel";

class TransactionRepository {
  async create(
    tx: Omit<ITransaction, "id" | "created_at">,
    trx?: Knex.Transaction
  ): Promise<ITransaction> {
    const executor = trx || db;
    const [created] = await executor("transactions").insert(tx);
    return {
      ...tx,
      id: created,
      created_at: new Date(),
    };
  }

  async findByReference(reference: string): Promise<ITransaction | undefined> {
    return db("transactions").where({ reference }).first();
  }

  async getWalletTransactions(wallet_id: number): Promise<ITransaction[]> {
    return db("transactions")
      .where({ wallet_id })
      .orderBy("created_at", "desc");
  }
  async getWalletTransactionsPaginated(
    wallet_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    transactions: ITransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const [transactions, [{ count }]] = await Promise.all([
      db("transactions")
        .where({ wallet_id })
        .orderBy("created_at", "desc")
        .limit(limit)
        .offset(offset),
      db("transactions").where({ wallet_id }).count("id as count"),
    ]);

    const total = parseInt(count as string, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      transactions,
      total,
      page,
      totalPages,
    };
  }
}

export default new TransactionRepository();
