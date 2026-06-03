import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("store_knowledge", (table) => {
    table.increments("id").primary();
    table.string("key").notNullable().unique();
    table.text("value").notNullable();
    table.datetime("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("store_knowledge");
}
