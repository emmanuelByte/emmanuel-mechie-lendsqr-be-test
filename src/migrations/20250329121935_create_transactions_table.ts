import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table
      .integer("wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table.decimal("amount", 14, 2).notNullable();
    table.enum("type", ["deposit", "withdrawal", "transfer"]).notNullable();
    table
      .enum("status", ["success", "failed", "pending"])
      .notNullable()
      .defaultTo("success");
    table.string("narration").nullable();
    table.string("reference", 36).unique().notNullable(); // UUID
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}
