"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
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
exports.default = config;
