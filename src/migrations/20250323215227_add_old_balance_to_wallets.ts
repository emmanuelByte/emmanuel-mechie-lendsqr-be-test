import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("wallets", (table) => {
    table.decimal("old_balance", 14, 2).nullable().after("balance");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("wallets", (table) => {
    table.dropColumn("old_balance");
  });
}
