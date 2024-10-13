import knex from "knex";
import config from "./config";
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || "development";
const connectionConfig = config[environment];

export const db = knex(connectionConfig);