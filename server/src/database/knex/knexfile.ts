import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "../../../.env") });

const baseConfig = {
  client: "pg",
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "..", "seeds"),
  }
};

const knexConfig = {
  development: {
    ...baseConfig,
    connection: process.env.DB_URL,
  },
  production: {
    ...baseConfig,
    connection: process.env.PROD_DB_URL,
  }
};

module.exports = process.env.NODE_ENV === 'prod' 
  ? knexConfig.production 
  : knexConfig.development;