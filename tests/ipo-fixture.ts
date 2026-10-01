import type { Slice } from "../src/data/synthetic/build";
import type { IpoRecords } from "../src/server/ipo-repository";
import { timestamp } from "../src/domain/research/calendar";
export function ipoFixture(slice: Slice, index: number): IpoRecords {
    const offer = slice.offers[index], dataset = slice.version, issuer = slice.issuers.find(i => i.id === offer.issuerId)!;
    const research = slice.ipoResearch.find(r => r.offerId === offer.id)!;
    const listing = slice.listings.find(l => l.id === offer.listingId);
    return { dataset, referenceAt: timestamp("2026-09-30"), offer: { ...offer, dataset }, issuer: { ...issuer, dataset },
        sector: { ...slice.sectors.find(s => s.id === issuer.sectorId)!, dataset },
        listing: listing ? { ...listing, dataset, venue: "Market AI Simulated Market", currency: "INR" } : null,
        holders: offer.holders.map(h => ({ ...h, dataset })), proceeds: offer.proceeds.map(p => ({ ...p, dataset })),
        reservations: offer.reservations.map(r => ({ ...r, dataset })), subscriptions: offer.subscriptions.map(s => ({ ...s, dataset })),
        snapshot: { ...research, dataset, assumptionId: research.assumptions.id, digest: "test" },
        assumption: { ...research.assumptions, digest: research.assumptionDigest },
        financials: slice.financials.filter(p => research.financialIds.includes(p.id)), prices: slice.prices.filter(p => research.priceIds.includes(p.id)).map(p => ({ ...p, dataset })),
        peers: slice.listings.filter(l => research.peerIds.includes(l.id)).map(l => ({ listing: { ...l, dataset, venue: "Market AI Simulated Market", currency: "INR" }, issuer: { ...slice.issuers.find(i => i.id === l.issuerId)!, dataset } })),
        sources: slice.evidence.filter(e => research.evidenceIds.includes(e.id) || e.id === offer.sourceId || e.id === offer.lifecycleId), researchEvidenceIds: research.evidenceIds,
    };
}
