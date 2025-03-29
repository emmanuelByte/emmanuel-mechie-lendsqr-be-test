import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.decimal("old_balance", 14, 2).nullable().after("amount");
    table.decimal("balance", 14, 2).nullable().after("old_balance");
    table.string("account_number").nullable().after("wallet_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("old_balance");
    table.dropColumn("balance");
    table.dropColumn("account_number");
  });
}
