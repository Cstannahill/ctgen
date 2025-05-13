import { Client } from "pg";
export async function createDatabase({ dbName, dbUser, dbPassword, dbHost, dbPort, }) {
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
