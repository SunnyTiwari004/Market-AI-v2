import "server-only";
import type postgres from "postgres";
import { databaseUrl } from "./connection";
// All mutation commands are deliberately limited to this project's isolated database.
export async function verifyDevelopmentDatabase(client: postgres.Sql) {
    const url=new URL(databaseUrl());
    if(url.hostname!=="localhost"||url.pathname!=="/market_ai_v2_dev")throw new Error("DEVELOPMENT_DATABASE_REQUIRED");
    const rows=await client`select current_database() as name, host(inet_server_addr()) as address`;
    if(rows[0]?.name!=="market_ai_v2_dev"||!["127.0.0.1","::1"].includes(rows[0]?.address))throw new Error("DEVELOPMENT_DATABASE_IDENTITY_MISMATCH");
}
