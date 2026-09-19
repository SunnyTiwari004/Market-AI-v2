import { test, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import postgres from "postgres";
import { verifyDatabase } from "../../src/server/db/verify";
import { closeDatabase } from "../../src/server/db/connection";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = new URL(process.env.DATABASE_URL ?? "http://unconfigured");
if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.port !== "5432" || url.pathname !== "/market_ai_v2_dev" || decodeURIComponent(url.username) !== "market_ai_dev") throw new Error("Integration requires the designated local development database");
const sql = postgres(process.env.DATABASE_URL!, { max:1, onnotice:()=>{} });
after(async()=>{await closeDatabase(); await sql.end();});
test("persisted slice and all repository contexts match canonical generation",async()=>{
    const result=await verifyDatabase();
    assert.equal(result.snapshots,27);assert.equal(result.repositoryContexts,27);assert.equal(result.pricesPerCompany,523);
});
test("PostgreSQL enforces required uniqueness, foreign keys and nullability",async()=>{
    const probes:[string,string][]=[
        ["insert into issuers select dataset,id || '-probe',sector_id,registry_key || '-probe',slug,name,description from issuers limit 1","23505"],
        ["update listings set symbol=(select symbol from listings order by symbol limit 1) where symbol=(select symbol from listings order by symbol desc limit 1)","23505"],
        ["insert into price_closes select dataset,id || '-probe',listing_id,date,close from price_closes limit 1","23505"],
        ["insert into stock_snapshots select dataset,id || '-probe',listing_id,cutoff,session,horizon,method,scenario_id,output,digest from stock_snapshots limit 1","23505"],
        ["update listings set issuer_id='nonexistent-issuer' where symbol='TAVREN'","23503"],
        ["update price_closes set close=null where id=(select id from price_closes limit 1)","23502"],
    ];
    for(const [query,code] of probes){
        let observed:string|undefined;
        try{await sql.begin(async tx=>{await tx.unsafe(query);throw new Error("PROBE_DID_NOT_FAIL");});}
        catch(e){observed=(e as {code?:string}).code;}
        assert.equal(observed,code,"Expected PostgreSQL constraint rejection; transaction rolled back");
    }
    const columns=await sql`select numeric_precision,numeric_scale from information_schema.columns where table_schema='public' and table_name='price_closes' and column_name='close'`;
    assert.equal(columns[0].numeric_precision,22);assert.equal(columns[0].numeric_scale,2);
});
