import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
export function databaseUrl() {
    const value = process.env.DATABASE_URL;
    if (!value)
        throw new Error("DATABASE_NOT_CONFIGURED");
    try {
        const parsed = new URL(value);
        if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !parsed.hostname || parsed.pathname.length < 2)
            throw new Error();
    }
    catch {
        throw new Error("DATABASE_CONFIGURATION_INVALID");
    }
    return value;
}
export function connect() {
    const client = postgres(databaseUrl(), { max: 3, connect_timeout: 5, idle_timeout: 20, connection: { statement_timeout: 10000 }, onnotice: () => { } });
    return { client, db: drizzle(client) };
}
let singleton: ReturnType<typeof connect> | undefined;
export function database() { return (singleton ??= connect()).db; }
export async function closeDatabase() { if (singleton) { await singleton.client.end(); singleton = undefined; } }
