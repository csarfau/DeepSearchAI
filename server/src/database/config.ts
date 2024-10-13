import type { Knex } from "knex";
import dotenv from 'dotenv';
dotenv.config();

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "pg",
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PWD,
          database: process.env.DB_NAME,
        },
        migrations: {
          tableName: "knex_migrations",
          directory: "./migrations",
        }
    },
};

export default config