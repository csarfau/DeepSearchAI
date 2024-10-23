import { Knex } from "knex";
import path from "path";

export const development: Knex.Config = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    host: "localhost",
    user: "postgres",
    password: "admin",
    database: "DeepSearchAI",
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
    host: "postgres",
    user: "postgres",
    password: "admin",
    database: "deepsearchdb",
  },
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  },
};
