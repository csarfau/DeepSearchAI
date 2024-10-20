import knex from "knex";
import { development, production } from "./envirolment";

const getEnvirolment = () => {
  switch (process.env.NODE_ENV) {
    case "prod":
      return production;
    default:
      return development;
  }
};

export const db = knex(getEnvirolment());
