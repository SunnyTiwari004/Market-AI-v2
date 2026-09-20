import "server-only";
import { and, eq } from "drizzle-orm";
import { connect } from "./connection";
import * as t from "./schema";
import { buildSlice } from "../../data/synthetic/build";
import { validateSlice } from "../../data/synthetic/validate";
import { digest } from "../../data/synthetic/identity";
import { marketIndex } from "../../domain/research/market";
import { START, END, sessions } from "../../domain/research/calendar";
import { verifyDevelopmentDatabase } from "./development";
import { D, ttm } from "../../domain/research/metrics";
import { valuation } from "../../domain/research/assessments";
import type { Financial } from "../../domain/research/types";
import { getStockOverview } from "../stock-overview";

// Comparisons preserve exact decimal values and normalize PostgreSQL timestamp spelling.
function same(actual: unknown, expected: unknown): boolean {
    if (typeof actual === "string" && typeof expected === "string") {
        if (/^-?\d+(\.\d+)?$/.test(expected) && /^-?\d+(\.\d+)?$/.test(actual)) return new D(actual).eq(expected);
        if (/^\d{4}-\d{2}-\d{2}T/.test(expected)) return Date.parse(actual) === Date.parse(expected);
    }
    if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && expected.every((v, i) => same(actual[i], v));
    if (expected !== null && typeof expected === "object") return actual !== null && typeof actual === "object" && Object.entries(expected).every(([k,v]) => same((actual as Record<string, unknown>)[k], v));
    return actual === expected;
}
function requireMatch(actual: unknown, expected: unknown, label: string) {
    if (!same(actual, expected)) throw new Error(`LIVE_VALIDATION_FAILED: ${label}`);
}

export async function verifyDatabase() {
    const expected = buildSlice();
    const counts = validateSlice(expected);
    const { db, client } = connect();
    try {
        await verifyDevelopmentDatabase(client);
        const dataset = expected.version;
        const versions = await db.select().from(t.datasets).where(eq(t.datasets.version, dataset));
        requireMatch(versions.length, 1, "dataset count");
        requireMatch(versions[0], { method: expected.method, generator: expected.generator, seed: expected.seed, profile: expected.profile, digest: expected.digest, published: true }, "dataset metadata");
        const matchRows = (actual: {id:string}[], wanted: {id:string}[], label: string) => {
            requireMatch(actual.length, wanted.length, `${label} count`);
            const map = new Map(actual.map(r => [r.id, r]));
            for (const row of wanted) requireMatch(map.get(row.id), row, `${label} ${row.id}`);
        };
        matchRows(await db.select().from(t.sectors).where(eq(t.sectors.dataset,dataset)), expected.sectors, "sector");
        matchRows(await db.select().from(t.issuers).where(eq(t.issuers.dataset,dataset)), expected.issuers, "issuer");
        matchRows(await db.select().from(t.listings).where(eq(t.listings.dataset,dataset)), expected.listings, "listing");
        const prices = await db.select().from(t.prices).where(eq(t.prices.dataset,dataset));
        matchRows(prices, expected.prices, "price");
        const periods = await db.select().from(t.periods).where(eq(t.periods.dataset,dataset));
        const incomes = await db.select().from(t.incomes).where(eq(t.incomes.dataset,dataset));
        const balances = await db.select().from(t.balances).where(eq(t.balances.dataset,dataset));
        const cash = await db.select().from(t.cashflows).where(eq(t.cashflows.dataset,dataset));
        for (const rows of [incomes,balances,cash]) requireMatch(rows.length, 165, "typed financial count");
        const financials=periods.map(p=>({...p,...incomes.find(r=>r.id===p.id),...balances.find(r=>r.id===p.id),...cash.find(r=>r.id===p.id)}));
        matchRows(financials,expected.financials,"financial");
        const evidence = await db.select().from(t.evidence).where(eq(t.evidence.dataset,dataset));
        const documents = await db.select().from(t.documents).where(eq(t.documents.dataset,dataset));
        const articles = await db.select().from(t.articles).where(eq(t.articles.dataset,dataset));
        const publishers = await db.select().from(t.publishers).where(eq(t.publishers.dataset,dataset));
        const concepts = await db.select().from(t.concepts).where(eq(t.concepts.dataset,dataset));
        const links = await db.select().from(t.evidenceIssuers).where(eq(t.evidenceIssuers.dataset,dataset));
        requireMatch(links.length,212,"evidence ownership count");
        matchRows(evidence.map(e=>{
            const doc=documents.find(d=>d.id===e.id), article=articles.find(a=>a.id===e.id);
            const body=doc?.body??article?.body??concepts.find(c=>c.id===e.id)?.body;
            requireMatch(e.digest,digest(body),"source digest");
            return {...e,body,issuerId:links.find(l=>l.evidenceId===e.id)?.issuerId??null,documentType:doc?.documentType??null,publisher:doc?.publisher??publishers.find(p=>p.id===article?.publisherId)?.name??"MARKET AI educational editorial desk"};
        }),expected.evidence,"evidence");
        const scenarios = await db.select().from(t.scenarioSets).where(eq(t.scenarioSets.dataset,dataset));
        matchRows(scenarios.map(s=>({...s,result:s.output})),expected.scenarioSets,"scenario");
        const assumptions=await db.select().from(t.assumptions).where(eq(t.assumptions.dataset,dataset));
        const cases=await db.select().from(t.cases).where(eq(t.cases.dataset,dataset));
        const assumptionEvidence=await db.select().from(t.assumptionEvidence).where(eq(t.assumptionEvidence.dataset,dataset));
        requireMatch(cases.length,108,"scenario case count");
        matchRows(assumptions.map(a=>({...a,cases:["Weak","Base","Strong"].map(label=>{
            const c=cases.find(c=>c.assumptionId===a.id&&c.label===label);
            return {...c,evidenceIds:assumptionEvidence.filter(e=>e.caseId===c?.id).map(e=>e.evidenceId).sort()};
        })})),expected.assumptions,"assumptions");
        const snapshots = await db.select().from(t.snapshots).where(eq(t.snapshots.dataset,dataset));
        requireMatch(snapshots.length,108,"snapshot count");
        for (const snapshot of expected.snapshots) {
            const listing=expected.listings.find(l=>l.id===snapshot.listingId)!;
            const view=await getStockOverview(listing.symbol,snapshot.cutoff,snapshot.horizon);
            if(view.status!=="available")throw new Error("LIVE_VALIDATION_FAILED: repository unavailable");
            const actual=view.snapshot;
            const normalized={...actual,financialIds:[...actual.financialIds].sort(),priceIds:[...actual.priceIds].sort(),peerIds:[...actual.peerIds].sort(),evidenceIds:[...actual.evidenceIds].sort(),findings:snapshot.findings.map(f=>actual.findings.find(a=>a.key===f.key))};
            // Finding source order is not SQL-defined; compare these as sets.
            normalized.findings=normalized.findings.map((f,i)=>f?{...f,evidenceIds:snapshot.findings[i].evidenceIds.filter(id=>f.evidenceIds.includes(id))}:f);
            requireMatch(normalized,snapshot,"repository snapshot");
            requireMatch(snapshots.find(s=>s.id===snapshot.id)?.digest,digest(snapshot),"snapshot digest");
            requireMatch(view.quote,expected.prices.find(p=>p.listingId===listing.id&&p.date===snapshot.session),"quote");
            const ownPrices=expected.prices.filter(p=>p.listingId===listing.id&&p.date<snapshot.session);
            requireMatch(view.previousQuote,ownPrices.at(-1),"previous quote");
            requireMatch(view.evidence.length,snapshot.evidenceIds.length,"source count");
            requireMatch(view.scenario,expected.scenarioSets.find(s=>s.id===snapshot.scenarioId)?.result,"scenario result");
            if(snapshot.cutoff!=="2026-08-01" && view.changes.availability!=="available")throw new Error("LIVE_VALIDATION_FAILED: comparison");
        }
        // A real query of the ordinary Tuesday session complements snapshot-cutoff checks.
        for(const listing of expected.listings){
            const rows=await db.select().from(t.prices).where(and(eq(t.prices.dataset,dataset),eq(t.prices.listingId,listing.id)));
            requireMatch(rows.some(p=>p.date==="2026-09-29")&&rows.some(p=>p.date==="2026-09-28"),true,"Tuesday/Monday quotes");
        }
        const inputs=expected.listings.map(listing=>{
            const trailing=ttm(financials.filter(p=>p.issuerId===listing.issuerId) as Financial[],"2026-09-30");
            const close=new D(prices.find(p=>p.listingId===listing.id&&p.date==="2026-09-30")!.close);
            return {id:listing.id,sectorId:expected.issuers.find(i=>i.id===listing.issuerId)!.sectorId,eps:trailing.eps,close,window:trailing.key,session:"2026-09-30",listed:true};
        });
        const v=valuation(inputs[0],inputs);
        const stored=snapshots.find(s=>s.listingId===inputs[0].id&&s.cutoff==="2026-09-30"&&s.horizon==="long")!;
        requireMatch(stored.output.metrics.pe.value,v.pe?.toFixed(12),"persisted valuation P/E");
        requireMatch(stored.output.metrics.peerMedian.value,v.median?.toFixed(12),"persisted peer median");
        requireMatch(stored.output.metrics.valuationRatio.value,v.ratio?.toFixed(12),"persisted valuation ratio");
        requireMatch(stored.output.valuation,v.assessment,"persisted valuation category");
        const valuationTrace={companies:inputs.map((i,n)=>({symbol:expected.listings[n].symbol,ttmEps:i.eps?.toString(),close:i.close.toString(),pe:i.close.div(i.eps!).toString()})),peerMedian:v.median?.toString(),ratio:v.ratio?.toString(),category:v.assessment.value};
        const matchSet=(actual:object[],wanted:object[],label:string)=>{
            requireMatch(actual.length,wanted.length,`${label} count`);
            for(const row of wanted)requireMatch(actual.some(a=>same(a,row)),true,`${label} row`);
        };
        matchRows(concepts,expected.concepts,"concepts");
        matchRows(publishers,expected.publishers,"publishers");
        matchRows(await db.select().from(t.events).where(eq(t.events.dataset,dataset)),expected.events,"events");
        const offers=await db.select().from(t.offers).where(eq(t.offers.dataset,dataset));
        matchRows(offers,expected.offers.map(({holders,proceeds,reservations,subscriptions,...row})=>{void [holders,proceeds,reservations,subscriptions];return row;}),"offers");
        matchSet(await db.select().from(t.offerHolders).where(eq(t.offerHolders.dataset,dataset)),expected.offers.flatMap(o=>o.holders),"holders");
        matchSet(await db.select().from(t.offerProceeds).where(eq(t.offerProceeds.dataset,dataset)),expected.offers.flatMap(o=>o.proceeds),"proceeds");
        matchSet(await db.select().from(t.offerReservations).where(eq(t.offerReservations.dataset,dataset)),expected.offers.flatMap(o=>o.reservations),"reservations");
        matchSet(await db.select().from(t.offerSubscriptions).where(eq(t.offerSubscriptions.dataset,dataset)),expected.offers.flatMap(o=>o.subscriptions),"subscriptions");
        const groups=expected.groups.map(({members,key,kind,...row})=>{void [members,key,kind];return row;});
        matchRows(await db.select().from(t.themes).where(eq(t.themes.dataset,dataset)),groups.filter(g=>expected.groups.find(x=>x.id===g.id)!.kind==="theme"),"themes");
        matchRows(await db.select().from(t.collections).where(eq(t.collections.dataset,dataset)),groups.filter(g=>expected.groups.find(x=>x.id===g.id)!.kind==="collection"),"collections");
        matchSet(await db.select().from(t.themeMembers).where(eq(t.themeMembers.dataset,dataset)),expected.groups.filter(g=>g.kind==="theme").flatMap(g=>g.members.map(m=>({themeId:g.id,...m}))),"theme memberships");
        matchSet(await db.select().from(t.collectionMembers).where(eq(t.collectionMembers.dataset,dataset)),expected.groups.filter(g=>g.kind==="collection").flatMap(g=>g.members.map(m=>({collectionId:g.id,...m}))),"collection memberships");
        matchSet(await db.select().from(t.evidenceOffers).where(eq(t.evidenceOffers.dataset,dataset)),expected.offers.flatMap(o=>expected.evidence.filter(e=>e.issuerId===o.issuerId).map(e=>({offerId:o.id,evidenceId:e.id}))),"offer evidence");
        matchSet(await db.select().from(t.evidenceSectors).where(eq(t.evidenceSectors.dataset,dataset)),expected.events.filter(e=>e.kind==="market-sector").map(e=>({evidenceId:e.evidenceId,sectorId:e.sectorId,rationale:e.summary})),"sector evidence");
        matchRows(await db.select().from(t.ipoAssumptions).where(eq(t.ipoAssumptions.dataset,dataset)),expected.ipoResearch.map(r=>({...r.assumptions,digest:r.assumptionDigest})),"IPO assumptions");
        matchRows(await db.select().from(t.ipoSnapshots).where(eq(t.ipoSnapshots.dataset,dataset)),expected.ipoResearch.map(r=>({id:r.id,offerId:r.offerId,cutoff:r.cutoff,method:r.method,assumptionId:r.assumptions.id,output:r.output,scenarios:r.scenarios,digest:digest(r)})),"IPO research");
        matchSet(await db.select().from(t.ipoFinancial).where(eq(t.ipoFinancial.dataset,dataset)),expected.ipoResearch.flatMap(r=>r.financialIds.map(periodId=>({snapshotId:r.id,periodId}))),"IPO financial provenance");
        matchSet(await db.select().from(t.ipoPrices).where(eq(t.ipoPrices.dataset,dataset)),expected.ipoResearch.flatMap(r=>r.priceIds.map(priceId=>({snapshotId:r.id,priceId}))),"IPO price provenance");
        matchSet(await db.select().from(t.ipoPeers).where(eq(t.ipoPeers.dataset,dataset)),expected.ipoResearch.flatMap(r=>r.peerIds.map(listingId=>({snapshotId:r.id,listingId}))),"IPO peer provenance");
        matchSet(await db.select().from(t.ipoEvidence).where(eq(t.ipoEvidence.dataset,dataset)),expected.ipoResearch.flatMap(r=>r.evidenceIds.map(evidenceId=>({snapshotId:r.id,evidenceId}))),"IPO evidence provenance");
        const liveListings=await db.select().from(t.listings).where(eq(t.listings.dataset,dataset));
        const liveIssuers=await db.select().from(t.issuers).where(eq(t.issuers.dataset,dataset));
        const liveSectors=await db.select().from(t.sectors).where(eq(t.sectors.dataset,dataset));
        const broad=marketIndex(liveListings,prices,sessions(START,END));
        const sectorIndexes=liveSectors.map(sector=>({name:sector.name,points:marketIndex(liveListings.filter(l=>liveIssuers.find(i=>i.id===l.issuerId)?.sectorId===sector.id),prices,sessions(START,END))}));
        requireMatch(broad.every(p=>p.level.availability==="available")&&sectorIndexes.every(s=>s.points.every(p=>p.level.availability==="available")),true,"live derived index coverage");
        for(const symbol of ["elarven","nivora","kavreth"])requireMatch((await getStockOverview(symbol)).status,"not-found","IPO-only not a Stock");
        const migrations=await client`select count(*)::int as count from drizzle.__drizzle_migrations`;
        requireMatch(migrations[0].count>=2,true,"migrations applied");
        return {...counts,datasetDigest:expected.digest,repositoryContexts:108,valuationTrace,liveCounts:{issuers:liveIssuers.length,listings:liveListings.length,sectors:liveSectors.length,offers:offers.length,annual:periods.filter(p=>p.basis==="annual").length,quarterly:periods.filter(p=>p.basis==="quarterly").length,prices:prices.length,documents:documents.length,articles:articles.length,concepts:concepts.length,snapshots:snapshots.length,scenarioSets:scenarios.length},priceCoverage:liveListings.map(l=>({symbol:l.symbol,closes:prices.filter(p=>p.listingId===l.id).length})),indexes:{ownership:"Derived from live PostgreSQL closes; no index observation table",broad:broad.length,sectors:sectorIndexes.map(s=>({name:s.name,observations:s.points.length}))}};
    } finally { await client.end(); }
}
