import knex from "knex";
import dotenv from "dotenv";
import config from "../knexfile";

dotenv.config();

const db = knex(config.development);

export default db;
