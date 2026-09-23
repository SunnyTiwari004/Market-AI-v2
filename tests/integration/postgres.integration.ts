import { test, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import postgres from "postgres";
import { verifyDatabase } from "../../src/server/db/verify";
import { closeDatabase } from "../../src/server/db/connection";
import { seedDatabase } from "../../src/server/db/seed";
import { digest } from "../../src/data/synthetic/identity";
import { readFinancials, readCloses, readSources, readSectorPeers } from "../../src/server/stock-view-repository";
import { readStock } from "../../src/server/stock-repository";
import { UNIVERSE } from "../../src/data/synthetic/universe-spec";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = new URL(process.env.DATABASE_URL ?? "http://unconfigured");
if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.port !== "5432" || url.pathname !== "/market_ai_v2_dev" || decodeURIComponent(url.username) !== "market_ai_dev") throw new Error("Integration requires the designated local development database");
const sql = postgres(process.env.DATABASE_URL!, { max:1, onnotice:()=>{} });
after(async()=>{await closeDatabase(); await sql.end();});

test("all Stock view reads resolve canonical periods, closes, issuer sources and same-sector peers", async () => {
    for (const company of UNIVERSE.filter(c => c.symbol)) {
        const stock = await readStock(company.symbol!, "2026-09-30", "long");
        assert.ok(stock?.snapshot);
        const [financials, closes, articles, documents, peers] = await Promise.all([
            readFinancials(stock.issuer.id, "2026-09-30"), readCloses(stock.listing.id, "2026-09-30"),
            readSources(stock.issuer.id, "2026-09-30", "article"), readSources(stock.issuer.id, "2026-09-30", "document"),
            readSectorPeers(stock.sector.id, "2026-09-30", "long"),
        ]);
        assert.equal(financials.filter(r => r.period.basis === "annual").length, 3);
        assert.equal(financials.filter(r => r.period.basis === "quarterly").length, 8);
        for (const row of financials) {
            assert.ok(row.income && row.balance && row.cashflow);
            assert.ok(documents.some(s => s.id === row.period.sourceId && s.body.includes(row.income!.revenue)));
        }
        assert.equal(closes.length, company.symbol === "MERUVAN" ? 89 : 523);
        assert.ok(closes.every(p => p.date >= stock.listing.listedAt));
        assert.equal(closes.at(-1)!.close, stock.quote!.close);
        assert.ok(articles.length >= 2);
        assert.ok(articles.every(s => s.kind === "article" && s.body.length > 0 && s.simulated));
        assert.deepEqual(articles.map(s => s.publishedAt), articles.map(s => s.publishedAt).sort().reverse());
        assert.ok(documents.every(s => s.kind === "document" && s.issuerId === stock.issuer.id));
        assert.equal(peers.length, 3); assert.equal(new Set(peers.map(p => p.listing.id)).size, 3);
        assert.ok(peers.every(p => p.issuer.sectorId === stock.sector.id));
        assert.equal(peers.filter(p => p.listing.id !== stock.listing.id).length, 2);
    }
});

test("historical Stock view reads exclude later publications and preserve unavailable peer earnings", async () => {
    const stock = await readStock("MERUVAN", "2026-08-01", "long"); assert.ok(stock);
    const records = await readFinancials(stock.issuer.id, "2026-08-01");
    assert.ok(records.every(r => r.period.publishedAt.slice(0, 10) <= "2026-08-01"));
    assert.ok(!records.some(r => r.period.end === "2026-06-30"));
    const articles = await readSources(stock.issuer.id, "2026-08-01", "article");
    assert.ok(articles.every(s => s.publishedAt.slice(0, 10) <= "2026-08-01"));
    const peers = await readSectorPeers(stock.sector.id, "2026-08-01", "long");
    assert.equal(peers.length, 3);
    assert.equal(peers.find(p => p.listing.id === stock.listing.id)!.research!.output.metrics.pe.value, null);
});
test("persisted slice and all repository contexts match canonical generation",async()=>{
    const result=await verifyDatabase();
    assert.equal(result.snapshots,108);assert.equal(result.repositoryContexts,108);assert.equal(result.prices,5842);
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
test("full seed replay preserves every table row and the published digest",async()=>{
    async function fingerprint(){
        const tables=await sql`select tablename from pg_tables where schemaname='public' order by tablename`;
        const result:Record<string,{count:number;digest:string}>={};
        for(const table of tables){
            const rows=await sql`select * from ${sql(table.tablename)}`;
            result[table.tablename]={count:rows.length,digest:digest(rows.map(r=>JSON.stringify(r)).sort())};
        }
        return result;
    }
    const before=await fingerprint();
    assert.equal(await seedDatabase(),"identical version already published");
    assert.deepEqual(await fingerprint(),before);
    assert.equal(before.stock_snapshots.count,108);
    assert.equal(before.ipo_offers.count,4);
    assert.equal(before.theme_memberships.count,8);
    assert.equal(before.collection_memberships.count,6);
    assert.equal(before.recorded_events.count,16);
});
test("Meruvan shares one offer/listing identity and historical IPO excludes later prices",async()=>{
    const rows=await sql`select o.issuer_id as offer_issuer,l.issuer_id as listing_issuer,s.cutoff,o.actual_listing from ipo_offers o join listings l on l.dataset=o.dataset and l.id=o.listing_id join ipo_snapshots s on s.dataset=o.dataset and s.offer_id=o.id where l.symbol='MERUVAN'`;
    assert.equal(rows.length,1);assert.equal(rows[0].offer_issuer,rows[0].listing_issuer);
    assert.ok(new Date(rows[0].cutoff)<new Date(rows[0].actual_listing));
    const leaked=await sql`select p.id from ipo_price_inputs i join ipo_snapshots s on s.dataset=i.dataset and s.id=i.snapshot_id join price_closes p on p.dataset=i.dataset and p.id=i.price_id join ipo_offers o on o.dataset=s.dataset and o.id=s.offer_id where o.listing_id=p.listing_id`;
    assert.equal(leaked.length,0);
    const migrations=await sql`select count(*)::int as count from drizzle.__drizzle_migrations`;
    assert.equal(migrations[0].count,2);
});
