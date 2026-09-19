// Test-only view-model fixture. Application routes always query PostgreSQL.
import { buildSlice } from "../src/data/synthetic/build";
import { id } from "../src/data/synthetic/identity";
import type { readStock } from "../src/server/stock-repository";
export function stockFixture(): Extract<NonNullable<Awaited<ReturnType<typeof readStock>>>, { snapshot: import("../src/domain/research/types").Snapshot }> {
    const slice = buildSlice(), dataset = slice.version;
    const listing = slice.listings[0], issuer = slice.issuers[0];
    const snapshot = slice.snapshots.find(s => s.listingId === listing.id && s.cutoff === "2026-09-30" && s.horizon === "long")!;
    const previous = slice.snapshots.find(s => s.listingId === listing.id && s.cutoff === "2026-08-31" && s.horizon === "long")!;
    const scenario = slice.scenarioSets.find(s => s.id === snapshot.scenarioId)!;
    const assumptions = slice.assumptions.find(a => a.id === scenario.assumptionId)!;
    const quotes = slice.prices.filter(p => p.listingId === listing.id && p.date <= snapshot.session).slice(-2);
    return {
        issuer: { dataset, ...issuer }, listing: { dataset, ...listing, currency: "INR", venue: "Market AI Simulated Market" }, snapshot, previous,
        evidence: slice.evidence.filter(e => snapshot.evidenceIds.includes(e.id)), scenario: scenario.result,
        assumptions: assumptions.cases.map(c => ({ dataset, id: id("case", `${assumptions.id}/${c.label}`), assumptionId: assumptions.id, ...c })),
        quote: { dataset, ...quotes[1] }, previousQuote: { dataset, ...quotes[0] },
    };
}
