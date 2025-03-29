import knex from "knex";
import dotenv from "dotenv";
const knexConfig = require("../../knexfile");

dotenv.config();

const db = knex(knexConfig.development);

export default db;
