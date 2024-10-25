import { config } from "dotenv";
import path from "path";
import knex from 'knex';

config({ path: path.join(__dirname, "../../../.env") });

const knexConfig = require("./knexfile");

export const db = knex(knexConfig);