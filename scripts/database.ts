import { existsSync } from "node:fs";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connect } from "../src/server/db/connection";
import { seedDatabase } from "../src/server/db/seed";
import { buildSlice } from "../src/data/synthetic/build";
import { validateSlice } from "../src/data/synthetic/validate";
import { verifyDatabase } from "../src/server/db/verify";
if (existsSync(".env.local"))
    process.loadEnvFile(".env.local");
else if (existsSync(".env"))
    process.loadEnvFile(".env");
async function main() {
    const command = process.argv[2];
    if (command === "validate") {
        if (process.argv.includes("--live")) { console.log(JSON.stringify(await verifyDatabase(), null, 2)); return; }
        const slice = buildSlice();
        console.log(validateSlice(slice));
        console.table(slice.snapshots.filter(s => s.horizon === "long").map(s => ({ listing: s.listingId.slice(0, 18), cutoff: s.cutoff, picture: s.picture.value, risk: s.risk.value, confidence: s.confidence.value, valuation: s.valuation.value })));
        return;
    }
    if (command === "seed") {
        console.log(await seedDatabase());
        return;
    }
    if (command === "migrate") {
        const { db, client } = connect();
        try {
            await migrate(db, { migrationsFolder: "drizzle" });
            console.log("Migration applied");
        }
        finally {
            await client.end();
        }
        return;
    }
    throw new Error("UNKNOWN_DATABASE_COMMAND");
}
main().catch(error => { console.error(error instanceof Error && error.message.startsWith("Seed validation") ? error.message : "Database operation failed. Check private server configuration and PostgreSQL availability; no fallback data was used."); process.exitCode = 1; });
