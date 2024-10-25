import { Knex } from "knex";
import path from "path";

import { config } from "dotenv";
config()
export const development: Knex.Config = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "deepsearchdb",
  },
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};

export const production: Knex.Config = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    host: process.env.PROD_DB_HOST,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PWD,
    database: process.env.PROD_DB_NAME,
  },
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};
