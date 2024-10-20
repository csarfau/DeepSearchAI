import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  
  return knex.schema.createTable('users_theme', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));;
    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index('idx_users_theme_user_id');
    table.uuid('theme_id')
      .notNullable()
      .references('id')
      .inTable('themes')
      .onDelete('CASCADE')
      .index('idx_users_theme_theme_id');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users_theme');
}

