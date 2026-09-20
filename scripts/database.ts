import { existsSync } from "node:fs";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connect } from "../src/server/db/connection";
import { seedDatabase } from "../src/server/db/seed";
import { buildSlice } from "../src/data/synthetic/build";
import { validateSlice } from "../src/data/synthetic/validate";
import { verifyDatabase } from "../src/server/db/verify";
import { verifyDevelopmentDatabase } from "../src/server/db/development";
import { closeDatabase } from "../src/server/db/connection";
import { coverageReport } from "../src/data/synthetic/validate-universe";
if (existsSync(".env.local"))
    process.loadEnvFile(".env.local");
else if (existsSync(".env"))
    process.loadEnvFile(".env");
async function main() {
    const command = process.argv[2];
    if (command === "validate") {
        if (process.argv.includes("--live")) { try { console.log(JSON.stringify(await verifyDatabase(), null, 2)); } finally { await closeDatabase(); } return; }
        const slice = buildSlice();
        console.log(validateSlice(slice));
        if(process.argv.includes("--coverage")){
            const report=coverageReport(slice);
            console.log(JSON.stringify({...report,
                groups:report.groups.map(g=>({...g,states:Object.fromEntries(Object.entries(g.states).map(([field,states])=>[field,Object.fromEntries(Object.entries(states).map(([state,examples])=>[state,{count:examples.length,examples:examples.slice(0,2)}]))]))})),
                changes:report.changes.map(c=>({...c,comparison:{availability:c.comparison.availability,categories:c.comparison.value?.categories,addedEvidence:c.comparison.value?.addedEvidence.length}})),
            },null,2));return;
        }
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
            await verifyDevelopmentDatabase(client);
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
