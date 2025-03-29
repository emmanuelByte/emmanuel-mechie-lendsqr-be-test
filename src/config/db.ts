import knex from "knex";
import dotenv from "dotenv";

dotenv.config();
const environment = process.env.NODE_ENV || "development";
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: "./src/migrations",
  },
});

export default db;
