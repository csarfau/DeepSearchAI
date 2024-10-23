import { Knex } from "knex";
import path from "path";
import { config } from "dotenv";

config({ path: path.join(__dirname, "../../../.env") });

export const development: Knex.Config = {
  client: "pg",
  useNullAsDefault: true,
  connection: process.env.DB_URL,
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
  connection: process.env.PROD_DB_URL,
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};
