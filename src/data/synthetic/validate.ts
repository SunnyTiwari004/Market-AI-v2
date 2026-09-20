import { D } from "../../domain/research/metrics";
import { addDays, CUTOFFS, cutoffSession, fullPeriod, sessions, START, END, timestamp } from "../../domain/research/calendar";
import { HORIZONS } from "../../domain/research/types";
import { DATASET, METHOD, GENERATOR, SEED, SECTOR } from "./spec";
import { digest, id } from "./identity";
import { buildResearch } from "./research";
import type { Slice } from "./build";
import { UNIVERSE } from "./universe-spec";
import { validateUniverse } from "./validate-universe";
export function validateSlice(s: Slice) {
    const errors: string[] = [], check = (valid: boolean, message: string) => { if (!valid)
        errors.push(message); };
    const { version, method, generator, seed, profile, digest: storedDigest, ...content } = s;
    check(!!version && !!method && !!generator && !!seed && profile === "full-release-1-universe", "Invalid dataset metadata");
    check(digest(content) === storedDigest, "Dataset content digest mismatch");
    const unique = (keys: string[], label: string) => check(new Set(keys).size === keys.length, `Duplicate ${label}`);
    check(s.version === DATASET && s.method === METHOD, "Version mismatch");
    check(generator === GENERATOR && seed === SEED, "Generator identity mismatch");
    check(s.sector.id === id("sector", SECTOR.key) && s.sector.slug === SECTOR.slug, "Sector identity mismatch");
    for (const b of UNIVERSE) {
        const issuer = s.issuers.find(i => i.key === b.key);
        check(!!issuer && issuer.id === id("issuer", b.key) && issuer.name === b.name && issuer.slug === b.slug, `Issuer identity mismatch ${b.symbol}`);
        if (!b.symbol) continue;
        const listing = s.listings.find(l => l.symbol === b.symbol);
        check(!!listing && listing.id === id("listing", `${b.key}/ordinary`) && listing.issuerId === issuer?.id && listing.listedAt === b.listedAt, `Listing identity mismatch ${b.symbol}`);
    }
    check(s.issuers.length === 15 && s.listings.length === 12, "Expected 15 issuers/12 listings");
    check(s.sector.name === "Digital Operations Services", "Sector mismatch");
    unique(s.issuers.map(i => i.id), "issuer ID");
    unique(s.issuers.map(i => i.slug), "slug");
    unique(s.listings.map(i => i.symbol), "symbol");
    check(s.listings.map(l => l.symbol).sort().join() === UNIVERSE.flatMap(b=>b.symbol?[b.symbol]:[]).sort().join(), "Unexpected symbols");
    for (const i of s.issuers)
        check(s.sectors.some(sector => sector.id === i.sectorId), `Invalid sector ${i.id}`);
    const sourceMap = new Map(s.evidence.map(e => [e.id, e])), periodMap = new Map(s.financials.map(p => [p.id, p])), priceMap = new Map(s.prices.map(p => [p.id, p]));
    unique(s.evidence.map(e => e.id), "evidence ID");
    unique(s.financials.map(p => p.id), "period ID");
    unique(s.prices.map(p => p.id), "price ID");
    unique(s.snapshots.map(p => p.id), "snapshot ID");
    check(s.financials.length === 165, "Expected 165 financial periods");
    check(s.evidence.length === 222, "Expected 222 evidence records");
    check(s.prices.length === 5842, "Expected 5842 closes");
    for (const l of s.listings) {
        check(s.issuers.some(i => i.id === l.issuerId), `Invalid listing issuer ${l.id}`);
        const dates = s.prices.filter(p => p.listingId === l.id).map(p => p.date).sort();
        check(dates.join() === sessions(l.listedAt > START ? l.listedAt : START, END).join(), `Price continuity ${l.symbol}`);
        const periods = s.financials.filter(p => p.issuerId === l.issuerId), annual = periods.filter(p => p.basis === "annual"), quarters = periods.filter(p => p.basis === "quarterly").sort((a, b) => a.start.localeCompare(b.start));
        check(annual.length === 3 && quarters.length === 8, `Financial period counts ${l.symbol}`);
        for (let i = 1; i < quarters.length; i++) {
            check(addDays(quarters[i - 1].end, 1) === quarters[i].start, `Quarter sequence ${l.symbol}`);
            check(new D(quarters[i - 1].closingCash).eq(quarters[i].openingCash), `Adjacent cash ${l.symbol}`);
        }
        for (const a of annual) {
            const qs = quarters.filter(q => q.start >= a.start && q.end <= a.end);
            if (qs.length === 4) {
                for (const field of ["revenue", "ebit", "income", "interest", "ocf", "investing", "financing", "capex"] as const)
                    check(qs.reduce((total, q) => total.plus(q[field]), new D(0)).eq(a[field]), `Annual overlap ${field} ${a.id}`);
                check(new D(qs[0].openingCash).eq(a.openingCash), `Annual opening cash ${a.id}`);
            }
            const ending = quarters.find(q => q.end === a.end);
            if (ending)
                for (const field of ["assets", "liabilities", "equity", "debt", "cash", "shares"] as const)
                    check(new D(ending[field]).eq(a[field]), `Annual ending ${field} ${a.id}`);
        }
        check(s.evidence.filter(e => e.issuerId === l.issuerId).length >= 14, `Evidence coverage ${l.symbol}`);
    }
    for (const p of s.financials) {
        check(fullPeriod(p.start, p.end, p.basis), `Invalid fiscal period ${p.id}`);
        check(p.currency === "INR" && p.scope === "standalone", "Financial basis mismatch");
        check(Date.parse(p.publishedAt) > Date.parse(`${p.end}T23:59:59+05:30`), `Publication chronology ${p.id}`);
        const source = sourceMap.get(p.sourceId);
        check(!!source && source.issuerId === p.issuerId && source.publishedAt === p.publishedAt && source.documentType === p.basis, `Period source mismatch ${p.id}`);
        for (const field of ["revenue", "ebit", "interest", "income", "assets", "liabilities", "equity", "debt", "cash", "ocf", "investing", "financing", "capex", "openingCash", "closingCash"] as const)
            check(/^-?\d{1,20}(\.\d{1,2})?$/.test(p[field]), `Invalid precision ${field} ${p.id}`);
        check(new D(p.weightedShares).gt(0) && new D(p.shares).gt(0), `Share history ${p.id}`);
        check(new D(p.assets).eq(new D(p.liabilities).plus(p.equity)), `Balance equation ${p.id}`);
        check(new D(p.debt).gte(0) && new D(p.debt).lte(p.liabilities) && new D(p.cash).gte(0) && new D(p.cash).lte(p.assets), `Balance bounds ${p.id}`);
        check(new D(p.capex).gte(0) && new D(p.revenue).gte(0) && new D(p.interest).gte(0), `Nonnegative inputs ${p.id}`);
        check(new D(p.openingCash).plus(p.ocf).plus(p.investing).plus(p.financing).eq(p.closingCash) && new D(p.closingCash).eq(p.cash), `Cash equation ${p.id}`);
    }
    for (const p of s.prices) {
        const listing = s.listings.find(l => l.id === p.listingId);
        check(!!listing && p.date >= listing.listedAt && p.date <= END && /^\d{1,20}\.\d{2}$/.test(p.close) && new D(p.close).gt(0), `Invalid price ${p.id}`);
    }
    for (const e of s.evidence)
        check((e.issuerId === null || s.issuers.some(i => i.id === e.issuerId)) && e.simulated === true && e.body.trim().length > 0 && e.body.includes("Simulated financial data") && !/https?:\/\/|\b(?:Reuters|Bloomberg|Moneycontrol|NSE|BSE|SEBI)\b/i.test(e.publisher + e.body), `Invalid source ${e.id}`);
    check(s.snapshots.length === 108 && s.assumptions.length === 36 && s.scenarioSets.length === 36, "Research counts");
    unique(s.snapshots.map(x => `${x.listingId}/${x.cutoff}/${x.horizon}`), "snapshot context");
    for (const x of s.snapshots) {
        check(x.dataset === s.version && x.method === s.method && HORIZONS.includes(x.horizon) && CUTOFFS.some(c => c === x.cutoff) && x.session === cutoffSession(x.cutoff), `Snapshot context ${x.id}`);
        check(s.scenarioSets.some(v => v.id === x.scenarioId && v.listingId === x.listingId && v.cutoff === x.cutoff), `Scenario relation ${x.id}`);
        for (const key of x.evidenceIds) {
            const e = sourceMap.get(key);
            check(!!e && Date.parse(e.publishedAt) <= Date.parse(timestamp(x.cutoff)), `Unknown/future evidence ${key}`);
        }
        for (const key of x.financialIds) {
            const p = periodMap.get(key);
            check(!!p && Date.parse(p.publishedAt) <= Date.parse(timestamp(x.cutoff)), `Unknown/future period ${key}`);
        }
        for (const key of x.priceIds) {
            const p = priceMap.get(key);
            check(!!p && p.date <= x.session, `Unknown/future price ${key}`);
        }
        for (const f of x.findings)
            check(f.evidenceIds.length > 0 && f.evidenceIds.every(key => x.evidenceIds.includes(key)), `Finding evidence ${x.id}`);
    }
    for (const a of s.assumptions)
        for (const c of a.cases)
            check(c.evidenceIds.every(key => { const e = sourceMap.get(key); return !!e && Date.parse(e.publishedAt) <= Date.parse(timestamp(a.cutoff)); }), `Assumption evidence ${a.id}`);
    if (errors.length)
        throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
    // Persisted output integrity, complementary to independent formula oracle tests.
    const expected = buildResearch(s);
    check(digest(expected) === digest({ assumptions: s.assumptions, scenarioSets: s.scenarioSets, snapshots: s.snapshots }), "Research output or assumption mismatch");
    check(s.scenarioSets.every(x => !x.result.reasons.some(r => ["INVALID_ASSUMPTIONS", "SCENARIO_ORDER_VIOLATION", "ASSUMPTION_CONTEXT_MISMATCH"].includes(r))), "Invalid scenario assumptions/order");
    validateUniverse(s);
    if (errors.length)
        throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
    return { issuers: 15, listings: 12, sectors: 4, annual: 45, quarterly: 120, prices: 5842, documents: 184, articles: 32, concepts: 6, snapshots: 108, scenarioSets: 36, ipoOffers: 4, ipoScenarios: 4 };
}
