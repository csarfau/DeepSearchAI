import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  return knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 100)
      .unique()
      .notNullable()
      .index('idx_users_email');
    table.string('password', 255).nullable();
    table.string('google_id').nullable();
    table.boolean('defined_theme').defaultTo(false).notNullable();
    table.timestamps(true, true);
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}

