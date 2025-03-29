import knex from "knex";
import dotenv from "dotenv";
import knexConfig from "../../knexfile";

dotenv.config();

const db = knex(knexConfig.development);

export default db;
