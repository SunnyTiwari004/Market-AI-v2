import type { IpoRecords } from "../../server/ipo-repository";
import { offerTerms } from "../../domain/ipo/terms";
import { annuals, D, decimal, ttm } from "../../domain/research/metrics";
import { cutoffSession } from "../../domain/research/calendar";
import { valuation } from "../../domain/research/assessments";
import { labels, meanings } from "../stock/format";

export const CATEGORY_LABELS: Record<string, string> = {
    professional: "Large Professional Investors (QIB)",
    "large-individual": "Large Individual Investors (NII)",
    "regular-individual": "Regular Individual Investors",
};
export const confidenceChecks = [
    ["FINDING_PROVENANCE", "Finding provenance"], ["FULL_REPORT_COVERAGE", "Financial-period coverage"],
    ["RECENCY", "Recency"], ["PRICE_COVERAGE", "Eligible price or IPO evidence coverage"],
    ["READABLE_SOURCES", "Source readability and reproducibility"],
] as const;
export function buildIpo(records: IpoRecords) {
    const { offer, snapshot } = records;
    const publications = new Map(records.sources.map(s => [s.id, s.publishedAt]));
    const eligible = (sourceId: string, at: string) => Date.parse(publications.get(sourceId) ?? "") <= Date.parse(at);
    const terms = eligible(offer.sourceId, records.referenceAt) ? offerTerms({ ...offer, listingId: records.listing?.id ?? null,
        holders: records.holders.filter(h => eligible(h.sourceId, records.referenceAt)),
        proceeds: records.proceeds.filter(p => eligible(p.sourceId, records.referenceAt)),
        reservations: records.reservations.filter(r => eligible(r.sourceId, records.referenceAt)), subscriptions: records.subscriptions,
    }, records.referenceAt, publications).value : null;
    const researchSources = snapshot ? records.sources.filter(s => records.researchEvidenceIds.includes(s.id) && eligible(s.id, snapshot.cutoff)) : [];
    const financials = snapshot ? records.financials.filter(p => Date.parse(p.publishedAt) <= Date.parse(snapshot.cutoff) && researchSources.some(s => s.id === p.sourceId)) : [];
    const own = financials.filter(p => p.issuerId === offer.issuerId);
    const cutoff = snapshot?.cutoff.slice(0, 10) ?? records.referenceAt.slice(0, 10);
    const annual = annuals(own, cutoff), trailing = ttm(own, cutoff), session = snapshot ? cutoffSession(snapshot.cutoff) : null;
    const annualSources = researchSources.filter(s => annual.slice(0, 3).some(p => p.sourceId === s.id));
    const findings = (["business", "growth", "financial"] as const).map(field => {
        const result = snapshot?.output[field];
        return { field, title: labels[field], result, positive: result?.value === "Strong", sources: annualSources,
            meaning: result?.value ? meanings[field][result.value] : "Required financial periods or inputs are unavailable. This check cannot establish a complete conclusion." };
    });
    const peerInputs = records.peers.map(({ listing, issuer }) => {
        const trailingPeer = ttm(financials.filter(p => p.issuerId === issuer.id), cutoff);
        const price = records.prices.find(p => p.listingId === listing.id && p.date === session);
        return { listing, issuer, trailing: trailingPeer, price, value: { id: listing.id, sectorId: issuer.sectorId, eps: trailingPeer.eps, close: decimal(price?.close), window: trailingPeer.key, session: session ?? "", listed: listing.listedAt <= (session ?? "") } };
    });
    const postShares = new D(offer.preShares).plus(offer.freshShares);
    const proForma = trailing.eps === null ? null : trailing.periods.reduce((sum, p) => sum.plus(p.income), new D(0)).div(postShares);
    const comparison = snapshot ? valuation({ id: offer.id, sectorId: records.issuer.sectorId, eps: proForma, close: decimal(snapshot.output.reference), window: trailing.key, session: session!, listed: true }, peerInputs.map(p => p.value)) : null;
    const peers = peerInputs.map(p => ({ id: p.listing.id, name: p.issuer.name, eligible: comparison?.eligible.includes(p.listing.id) ?? false,
        pe: p.value.eps?.gt(0) && p.value.close ? p.value.close.div(p.value.eps).toFixed(12) : null, window: p.trailing.periods.map(q => `${q.start}–${q.end}`), session: p.price?.date ?? null }));
    const assumption = records.assumption && snapshot && records.assumption.offerId === offer.id && records.assumption.method === snapshot.method && Date.parse(records.assumption.cutoff) === Date.parse(snapshot.cutoff) && records.assumption.window === "listing-day" && records.assumption.cases.every(c => c.evidenceIds.every(id => researchSources.some(s => s.id === id))) ? records.assumption : null;
    const offerMeaning = new D(offer.ofsShares).isZero()
        ? "The offer issues new shares to fund the company. No existing shares are being sold through an Offer for Sale. Examine the documented uses of the net proceeds."
        : "The offer combines new shares that fund the company with existing shares sold by holders. Examine the proceeds and ownership changes separately.";
    return { ...records, terms, offerMeaning, researchSources, annualSources, findings, peers, annualEnd: annual[0]?.end ?? null,
        ttmStart: trailing.key ? trailing.periods[0].start : null, ttmEnd: trailing.key ? trailing.periods.at(-1)!.end : null,
        assumption, scenarios: assumption ? snapshot?.scenarios ?? null : null,
        holders: records.holders.map(h => ({ ...h, computed: terms?.holders.find(t => t.key === h.key) ?? null })),
        proceeds: records.proceeds.map(p => ({ ...p, amount: terms?.proceeds.find(t => t.key === p.key)?.amount ?? null })),
        categories: Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label, multiple: terms?.subscriptions.find(s => s.category === key)?.multiple.value ?? null,
            reserved: records.reservations.find(r => r.category === key && eligible(r.sourceId, records.referenceAt))?.shares ?? null,
            observation: records.subscriptions.find(s => s.category === key && s.observedAt === terms?.demandObservedAt && eligible(s.sourceId, records.referenceAt)) ?? null })),
    };
}
export type IpoModel = ReturnType<typeof buildIpo>;
