import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  
  return knex.schema.createTable('themes', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('themes');
}

