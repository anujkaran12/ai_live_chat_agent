import type { Knex } from "knex";

const config: Knex.Config = {
  client: "better-sqlite3",
  connection: {
    filename: "./src/db/shopspur.sqlite3",
  },
  migrations: {
    directory: "./src/db/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./src/db/seeds",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export default config;
