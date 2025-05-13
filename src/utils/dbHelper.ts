import { Client } from "pg";

export interface CreateDatabaseOptions {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbPort: string | number;
}

export async function createDatabase({
  dbName,
  dbUser,
  dbPassword,
  dbHost,
  dbPort,
}: CreateDatabaseOptions) {
  const adminClient = new Client({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: typeof dbPort === "string" ? parseInt(dbPort, 10) : dbPort,
  });
  await adminClient.connect();
  console.log(`Connected to PostgreSQL server at ${dbHost}:${dbPort}`);
  await adminClient.query(`CREATE DATABASE "${dbName}"`);
  await adminClient.end();
}

// createDatabase("my_new_db").catch(console.error);
