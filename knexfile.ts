import { Knex } from "knex";
import * as dotenv from "dotenv";
import config from "./src/config/config";

dotenv.config();

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: config.database.host,
      port: Number(config.database.port),
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
    },
    migrations: {
      directory: "./src/migrations",
      extension: "ts",
    },
    useNullAsDefault: true,
  },
};

export default knexConfig;
