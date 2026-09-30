import { buildSlice } from "../src/data/synthetic/build";
import { sessions, timestamp } from "../src/domain/research/calendar";
import type { DiscoveryRecords } from "../src/server/discovery-repository";
import type { Horizon } from "../src/domain/research/types";
export function discoveryFixture(horizon: Horizon = "long"): DiscoveryRecords {
    const slice = buildSlice(), dataset = slice.version;
    const listings = slice.listings.map(l => ({ ...l, dataset, currency: "INR", venue: "Market AI Simulated Market" }));
    const issuers = slice.issuers.map(i => ({ ...i, dataset })), sectors = slice.sectors.map(s => ({ ...s, dataset }));
    const themes = slice.groups.filter(g => g.kind === "theme").map(g => ({ dataset, id: g.id, name: g.name, slug: g.slug, rationale: g.rationale }));
    const collections = slice.groups.filter(g => g.kind === "collection").map(g => ({ dataset, id: g.id, name: g.name, slug: g.slug, rationale: g.rationale }));
    return { dataset, cutoff: "2026-09-30", referenceAt: timestamp("2026-09-30"), listings, issuers, sectors, themes, collections,
        themeMembers: slice.groups.filter(g => g.kind === "theme").flatMap(g => g.members.map(m => ({ ...m, dataset, themeId: g.id }))),
        collectionMembers: slice.groups.filter(g => g.kind === "collection").flatMap(g => g.members.map(m => ({ ...m, dataset, collectionId: g.id }))),
        offers: slice.offers.map(o => ({ ...o, dataset })), events: slice.events.map(e => ({ ...e, dataset })), prices: slice.prices.map(p => ({ ...p, dataset })),
        sessions: sessions("2024-09-30", "2026-09-30").map(date => ({ date, dataset, closeAt: `${date}T15:30:00+05:30` })), sources: slice.evidence,
        stocks: listings.map(listing => {
            const issuer = issuers.find(i => i.id === listing.issuerId)!;
            const snapshot = slice.snapshots.find(s => s.listingId === listing.id && s.cutoff === "2026-09-30" && s.horizon === horizon)!;
            const previous = slice.snapshots.find(s => s.listingId === listing.id && s.cutoff === "2026-08-31" && s.horizon === horizon)!;
            const quotes = slice.prices.filter(p => p.listingId === listing.id).slice(-2);
            return { issuer, listing, sector: sectors.find(s => s.id === issuer.sectorId)!, snapshot, previous, evidence: slice.evidence.filter(e => snapshot.evidenceIds.includes(e.id)), scenario: slice.scenarioSets.find(s => s.id === snapshot.scenarioId)!.result, assumptions: [], quote: { ...quotes[1], dataset }, previousQuote: { ...quotes[0], dataset } };
        }),
    };
}
