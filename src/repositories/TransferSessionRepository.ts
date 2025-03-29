import { Knex } from "knex";
import db from "../config/db";
import { ITransferSession } from "../models/TransferSessionModel";

class TransferSessionRepository {
  async create(
    session: Omit<ITransferSession, "id" | "created_at" | "amount">
  ): Promise<ITransferSession> {
    const [created] = await db("transfer_sessions").insert(session);

    return await db("transfer_sessions").where({ id: created }).first();
  }

  async findByTransferSessionId(
    id: string
  ): Promise<ITransferSession | undefined> {
    return db("transfer_sessions")
      .where({ id })
      .andWhere("expires_at", ">", new Date())
      .first();
  }

  async findBySessionId(
    session_id: string
  ): Promise<ITransferSession | undefined> {
    return db("transfer_sessions")
      .where({ session_id })
      .andWhere("expires_at", ">", new Date())
      .first();
  }

  async deleteBySessionId(
    session_id: string,
    trx?: Knex.Transaction
  ): Promise<void> {
    const executor = trx || db;
    await executor("transfer_sessions").where({ session_id }).del();
  }
}

export default new TransferSessionRepository();
