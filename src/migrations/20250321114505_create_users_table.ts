import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary(); // ✅ Auto-incrementing INT ID
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("other_name");
    table.string("email").notNullable().unique();
    table.string("phone_number").notNullable().unique();
    table.string("password").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
