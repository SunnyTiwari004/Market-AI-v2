import "server-only";
import { eq } from "drizzle-orm";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { connect } from "./connection";
import { assertIdenticalPublishedDataset, assertKnownDevelopmentTransition, LEGACY_DATASET } from "./seed-policy";
import { verifyDevelopmentDatabase } from "./development";
import * as t from "./schema";
import { buildSlice, type Slice } from "../../data/synthetic/build";
import { validateSlice } from "../../data/synthetic/validate";
import { digest, id, hash } from "../../data/synthetic/identity";
import { END, START, sessions, timestamp } from "../../domain/research/calendar";
export function manifests() {
    const files = [...readdirSync("src/domain/research").filter(n => n.endsWith(".ts")).map(n => join("src/domain/research", n)), ...readdirSync("src/data/synthetic").filter(n => n.endsWith(".ts")).map(n => join("src/data/synthetic", n))].sort();
    return { specificationDigest: hash(readFileSync("docs/research/RESEARCH_METHODOLOGY.md", "utf8").replace(/\r\n/g, "\n")), implementationDigest: hash(files.map(f => `${f.replaceAll("\\", "/")}\0${readFileSync(f, "utf8").replace(/\r\n/g, "\n")}`).join("\0")) };
}
export async function seedDatabase(slice: Slice = buildSlice()) {
    validateSlice(slice);
    const { db, client } = connect();
    const version = slice.version, withDataset = <T extends object>(value: T) => ({ dataset: version, ...value });
    try {
        await verifyDevelopmentDatabase(client);
        return await db.transaction(async (tx) => {
            const m = manifests(), existingMethod = await tx.select().from(t.methods).where(eq(t.methods.version, slice.method));
            const versions=await tx.select().from(t.datasets);
            if(versions.some(v=>v.version===LEGACY_DATASET)){
                assertKnownDevelopmentTransition(versions,existingMethod[0],m.specificationDigest);
                // Exact known development profile only; never TRUNCATE or cascade.
                const dependents=[t.findingEvidence,t.findings,t.snapshotEvidence,t.snapshotPeers,t.snapshotPrices,t.snapshotFinancial,t.snapshots,t.scenarioSets,t.assumptionEvidence,t.cases,t.assumptions,t.incomes,t.balances,t.cashflows,t.periods,t.evidenceIssuers,t.articles,t.documents,t.evidence,t.publishers,t.prices,t.tradingSessions,t.listings,t.issuers,t.sectors];
                for(const table of dependents)await tx.delete(table).where(eq(table.dataset,LEGACY_DATASET));
                await tx.delete(t.datasets).where(eq(t.datasets.version,LEGACY_DATASET));
                // The old digest included seed authoring, not only method code. The
                // documented, fingerprint-guarded development transition rebinds it.
                await tx.update(t.methods).set(m).where(eq(t.methods.version,slice.method));
            } else if (existingMethod.length && (existingMethod[0].specificationDigest !== m.specificationDigest || existingMethod[0].implementationDigest !== m.implementationDigest))
                throw new Error("IMMUTABLE_METHOD_CONFLICT");
            if (!existingMethod.length)
                await tx.insert(t.methods).values({ version: slice.method, ...m });
            const existing = await tx.select().from(t.datasets).where(eq(t.datasets.version, version));
            if (existing.length) {
                assertIdenticalPublishedDataset(existing[0], slice.digest);
                return "identical version already published";
            }
            await tx.insert(t.datasets).values({ version, method: slice.method, generator: slice.generator, seed: slice.seed, referenceAt: timestamp(END), calendar: "weekday-calendar-v1", fiscal: "April-March", digest: slice.digest, profile: slice.profile });
            await tx.insert(t.sectors).values(slice.sectors.map(withDataset));
            await tx.insert(t.issuers).values(slice.issuers.map(withDataset));
            await tx.insert(t.listings).values(slice.listings.map(withDataset));
            await tx.insert(t.tradingSessions).values(sessions(START, END).map(date => ({ dataset: version, date, closeAt: `${date}T15:30:00+05:30` })));
            for (let i = 0; i < slice.prices.length; i += 250)
                await tx.insert(t.prices).values(slice.prices.slice(i, i + 250).map(withDataset));
            await tx.insert(t.evidence).values(slice.evidence.map(e => ({ dataset: version, id: e.id, kind: e.kind, title: e.title, publishedAt: e.publishedAt, simulated: e.simulated, digest: digest(e.body) })));
            await tx.insert(t.documents).values(slice.evidence.filter(e => e.kind === "document").map(e => ({ dataset: version, id: e.id, issuerId: e.issuerId!, documentType: e.documentType!, body: e.body, publisher: e.publisher })));
            await tx.insert(t.publishers).values(slice.publishers.map(withDataset));
            await tx.insert(t.articles).values(slice.evidence.filter(e => e.kind === "article").map(e => ({ dataset: version, id: e.id, publisherId:slice.publishers.find(p=>p.name===e.publisher)!.id, body: e.body })));
            await tx.insert(t.evidenceIssuers).values(slice.evidence.filter(e=>e.issuerId!==null).map(e => ({ dataset: version, evidenceId: e.id, issuerId: e.issuerId! })));
            await tx.insert(t.concepts).values(slice.concepts.map(c=>withDataset({...c,body:slice.evidence.find(e=>e.id===c.id)!.body})));
            await tx.insert(t.events).values(slice.events.map(withDataset));
            await tx.insert(t.evidenceSectors).values(slice.events.filter(e=>e.kind==="market-sector").map(e=>withDataset({evidenceId:e.evidenceId,sectorId:e.sectorId,rationale:e.summary})));
            for(const group of slice.groups){
                const row=withDataset({id:group.id,slug:group.slug,name:group.name,rationale:group.rationale});
                if(group.kind==="theme"){
                    await tx.insert(t.themes).values(row);
                    await tx.insert(t.themeMembers).values(group.members.map(m=>withDataset({themeId:group.id,...m})));
                }else{
                    await tx.insert(t.collections).values(row);
                    await tx.insert(t.collectionMembers).values(group.members.map(m=>withDataset({collectionId:group.id,...m})));
                }
            }
            for(const offer of slice.offers){
                const {holders,proceeds,reservations,subscriptions,...row}=offer;
                await tx.insert(t.offers).values(withDataset(row));
                await tx.insert(t.offerHolders).values(holders.map(withDataset));
                await tx.insert(t.offerProceeds).values(proceeds.map(withDataset));
                await tx.insert(t.offerReservations).values(reservations.map(withDataset));
                if(subscriptions.length)await tx.insert(t.offerSubscriptions).values(subscriptions.map(withDataset));
                await tx.insert(t.evidenceOffers).values(slice.evidence.filter(e=>e.issuerId===offer.issuerId).map(e=>withDataset({offerId:offer.id,evidenceId:e.id,rationale:"Issuer financial and offer context; publication cutoff applies independently."})));
            }
            await tx.insert(t.periods).values(slice.financials.map(p => ({ dataset: version, id: p.id, issuerId: p.issuerId, sourceId: p.sourceId, basis: p.basis, start: p.start, end: p.end, publishedAt: p.publishedAt, currency: p.currency, scope: p.scope })));
            await tx.insert(t.incomes).values(slice.financials.map(p => ({ dataset: version, id: p.id, revenue: p.revenue, ebit: p.ebit, interest: p.interest, income: p.income, weightedShares: p.weightedShares })));
            await tx.insert(t.balances).values(slice.financials.map(p => ({ dataset: version, id: p.id, assets: p.assets, liabilities: p.liabilities, equity: p.equity, debt: p.debt, cash: p.cash, shares: p.shares })));
            await tx.insert(t.cashflows).values(slice.financials.map(p => ({ dataset: version, id: p.id, ocf: p.ocf, investing: p.investing, financing: p.financing, capex: p.capex, openingCash: p.openingCash, closingCash: p.closingCash })));
            for(const ipo of slice.ipoResearch){
                await tx.insert(t.ipoAssumptions).values({...ipo.assumptions,digest:ipo.assumptionDigest});
                await tx.insert(t.ipoSnapshots).values(withDataset({id:ipo.id,offerId:ipo.offerId,cutoff:ipo.cutoff,method:ipo.method,assumptionId:ipo.assumptions.id,output:ipo.output,scenarios:ipo.scenarios,digest:digest(ipo)}));
                await tx.insert(t.ipoFinancial).values(ipo.financialIds.map(periodId=>withDataset({snapshotId:ipo.id,periodId})));
                await tx.insert(t.ipoPrices).values(ipo.priceIds.map(priceId=>withDataset({snapshotId:ipo.id,priceId})));
                await tx.insert(t.ipoPeers).values(ipo.peerIds.map(listingId=>withDataset({snapshotId:ipo.id,listingId})));
                await tx.insert(t.ipoEvidence).values(ipo.evidenceIds.map(evidenceId=>withDataset({snapshotId:ipo.id,evidenceId})));
            }
            await tx.insert(t.assumptions).values(slice.assumptions.map(a => ({ dataset: version, id: a.id, listingId: a.listingId, cutoff: a.cutoff, method: a.method, days: a.days })));
            for (const a of slice.assumptions) {
                await tx.insert(t.cases).values(a.cases.map(c => ({ dataset: version, id: id("case", `${a.id}/${c.label}`), assumptionId: a.id, label: c.label, g: c.g, m: c.m, rationale: c.rationale })));
                await tx.insert(t.assumptionEvidence).values(a.cases.flatMap(c => c.evidenceIds.map(evidenceId => ({ dataset: version, caseId: id("case", `${a.id}/${c.label}`), evidenceId }))));
            }
            await tx.insert(t.scenarioSets).values(slice.scenarioSets.map(s => ({ dataset: version, id: s.id, assumptionId: s.assumptionId, listingId: s.listingId, cutoff: s.cutoff, output: s.result })));
            for (const s of slice.snapshots) {
                const output: t.SnapshotOutput = { basis: s.basis, annualEnd: s.annualEnd, ttmEnd: s.ttmEnd, metrics: s.metrics, business: s.business, growth: s.growth, financial: s.financial, risk: s.risk, valuation: s.valuation, direction: s.direction, picture: s.picture, confidence: s.confidence, earningsState: s.earningsState };
                await tx.insert(t.snapshots).values({ dataset: version, id: s.id, listingId: s.listingId, cutoff: s.cutoff, session: s.session, horizon: s.horizon, method: s.method, scenarioId: s.scenarioId, output, digest: digest(s) });
                await tx.insert(t.snapshotFinancial).values(s.financialIds.map(periodId => ({ dataset: version, snapshotId: s.id, periodId })));
                for (let i = 0; i < s.priceIds.length; i += 250)
                    await tx.insert(t.snapshotPrices).values(s.priceIds.slice(i, i + 250).map(priceId => ({ dataset: version, snapshotId: s.id, priceId })));
                await tx.insert(t.snapshotPeers).values(s.peerIds.map(listingId => ({ dataset: version, snapshotId: s.id, listingId })));
                await tx.insert(t.snapshotEvidence).values(s.evidenceIds.map(evidenceId => ({ dataset: version, snapshotId: s.id, evidenceId })));
                for (const f of s.findings) {
                    const findingId = id("finding", `${s.id}/${f.key}`);
                    await tx.insert(t.findings).values({ dataset: version, id: findingId, snapshotId: s.id, key: f.key, field: f.field, kind: f.kind });
                    await tx.insert(t.findingEvidence).values(f.evidenceIds.map(evidenceId => ({ dataset: version, findingId, evidenceId })));
                }
            }
            // No active pointer is changed until every insert and application validation succeeds.
            await tx.update(t.datasets).set({ published: true }).where(eq(t.datasets.version, version));
            return "published full Release-1 synthetic universe";
        });
    }
    finally {
        await client.end();
    }
}
