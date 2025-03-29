import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transfer_sessions", (table) => {
    table.decimal("amount", 14, 2).nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transfer_sessions", (table) => {
    table.decimal("amount", 14, 2).notNullable().alter();
  });
}
