import type { Knex } from "knex";


export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  return knex.schema.createTable('user_searchs', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index('idx_user_searchs_user_id');
    table.text('query').notNullable();
    table.text('result').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('user_searchs');
}

