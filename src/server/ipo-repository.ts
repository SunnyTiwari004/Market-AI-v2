import "server-only";
import { and, desc, eq, inArray, lte } from "drizzle-orm";
import { database } from "./db/connection";
import * as t from "./db/schema";
import { DATASET } from "../data/synthetic/spec";
import type { Evidence, Financial } from "../domain/research/types";

export async function readIpo(slug: string) {
    const db = database();
    const [dataset] = await db.select().from(t.datasets).where(and(eq(t.datasets.version, DATASET), eq(t.datasets.published, true)));
    if (!dataset) throw new Error("DATASET_UNAVAILABLE");
    const version = dataset.version;
    const [identity] = await db.select({ offer: t.offers, issuer: t.issuers, sector: t.sectors, listing: t.listings }).from(t.offers)
        .innerJoin(t.issuers, and(eq(t.issuers.dataset, t.offers.dataset), eq(t.issuers.id, t.offers.issuerId)))
        .innerJoin(t.sectors, and(eq(t.sectors.dataset, t.issuers.dataset), eq(t.sectors.id, t.issuers.sectorId)))
        .leftJoin(t.listings, and(eq(t.listings.dataset, t.offers.dataset), eq(t.listings.id, t.offers.listingId)))
        .where(and(eq(t.offers.dataset, version), eq(t.offers.slug, slug), lte(t.offers.termsPublishedAt, dataset.referenceAt)));
    if (!identity) return null;
    const { offer } = identity;
    if (identity.listing && identity.listing.issuerId !== offer.issuerId) throw new Error("IPO_IDENTITY_MISMATCH");
    const [holders, proceeds, reservations, subscriptions, snapshots, offerEvidence] = await Promise.all([
        db.select().from(t.offerHolders).where(and(eq(t.offerHolders.dataset, version), eq(t.offerHolders.offerId, offer.id))),
        db.select().from(t.offerProceeds).where(and(eq(t.offerProceeds.dataset, version), eq(t.offerProceeds.offerId, offer.id))),
        db.select().from(t.offerReservations).where(and(eq(t.offerReservations.dataset, version), eq(t.offerReservations.offerId, offer.id))),
        db.select().from(t.offerSubscriptions).where(and(eq(t.offerSubscriptions.dataset, version), eq(t.offerSubscriptions.offerId, offer.id), lte(t.offerSubscriptions.observedAt, dataset.referenceAt))),
        db.select().from(t.ipoSnapshots).where(and(eq(t.ipoSnapshots.dataset, version), eq(t.ipoSnapshots.offerId, offer.id), lte(t.ipoSnapshots.cutoff, offer.actualListing ?? dataset.referenceAt))).orderBy(desc(t.ipoSnapshots.cutoff)).limit(1),
        db.select().from(t.evidenceOffers).where(and(eq(t.evidenceOffers.dataset, version), eq(t.evidenceOffers.offerId, offer.id))),
    ]);
    const snapshot = snapshots.length ? snapshots[0] : null;
    const [researchEvidence, financialRows, prices, peers, assumptions] = snapshot ? await Promise.all([
        db.select().from(t.ipoEvidence).where(and(eq(t.ipoEvidence.dataset, version), eq(t.ipoEvidence.snapshotId, snapshot.id))),
        db.select({ period: t.periods, income: t.incomes, balance: t.balances, cash: t.cashflows }).from(t.ipoFinancial)
            .innerJoin(t.periods, and(eq(t.periods.dataset, t.ipoFinancial.dataset), eq(t.periods.id, t.ipoFinancial.periodId)))
            .innerJoin(t.incomes, and(eq(t.incomes.dataset, t.periods.dataset), eq(t.incomes.id, t.periods.id)))
            .innerJoin(t.balances, and(eq(t.balances.dataset, t.periods.dataset), eq(t.balances.id, t.periods.id)))
            .innerJoin(t.cashflows, and(eq(t.cashflows.dataset, t.periods.dataset), eq(t.cashflows.id, t.periods.id)))
            .where(and(eq(t.ipoFinancial.dataset, version), eq(t.ipoFinancial.snapshotId, snapshot.id), lte(t.periods.publishedAt, snapshot.cutoff))),
        db.select({ price: t.prices }).from(t.ipoPrices).innerJoin(t.prices, and(eq(t.prices.dataset, t.ipoPrices.dataset), eq(t.prices.id, t.ipoPrices.priceId))).where(and(eq(t.ipoPrices.dataset, version), eq(t.ipoPrices.snapshotId, snapshot.id))),
        db.select({ listing: t.listings, issuer: t.issuers }).from(t.ipoPeers)
            .innerJoin(t.listings, and(eq(t.listings.dataset, t.ipoPeers.dataset), eq(t.listings.id, t.ipoPeers.listingId)))
            .innerJoin(t.issuers, and(eq(t.issuers.dataset, t.listings.dataset), eq(t.issuers.id, t.listings.issuerId)))
            .where(and(eq(t.ipoPeers.dataset, version), eq(t.ipoPeers.snapshotId, snapshot.id))),
        db.select().from(t.ipoAssumptions).where(and(eq(t.ipoAssumptions.dataset, version), eq(t.ipoAssumptions.id, snapshot.assumptionId))),
    ]) : [[], [], [], [], []];
    const sourceIds = [...new Set([offer.sourceId, ...offerEvidence.map(e => e.evidenceId), ...researchEvidence.map(e => e.evidenceId), ...holders.map(h => h.sourceId), ...proceeds.map(p => p.sourceId), ...reservations.map(r => r.sourceId), ...subscriptions.map(s => s.sourceId)])];
    const rows = await db.select({ record: t.evidence, document: t.documents, article: t.articles, publisher: t.publishers.name }).from(t.evidence)
        .leftJoin(t.documents, and(eq(t.documents.dataset, t.evidence.dataset), eq(t.documents.id, t.evidence.id)))
        .leftJoin(t.articles, and(eq(t.articles.dataset, t.evidence.dataset), eq(t.articles.id, t.evidence.id)))
        .leftJoin(t.publishers, and(eq(t.publishers.dataset, t.articles.dataset), eq(t.publishers.id, t.articles.publisherId)))
        .where(and(eq(t.evidence.dataset, version), inArray(t.evidence.id, sourceIds), lte(t.evidence.publishedAt, dataset.referenceAt))).orderBy(desc(t.evidence.publishedAt), t.evidence.id);
    const sources: Evidence[] = rows.map(({ record, document, article, publisher }) => {
        if (!record.simulated) throw new Error("INVALID_PROVENANCE");
        return { id: record.id, issuerId: document?.issuerId ?? null, kind: record.kind, title: record.title, publishedAt: record.publishedAt, body: document?.body ?? article?.body ?? "", publisher: document?.publisher ?? publisher ?? "Attribution unavailable", simulated: true, documentType: document?.documentType as Evidence["documentType"] ?? null };
    });
    const financials: Financial[] = financialRows.map(r => ({ ...r.income, ...r.balance, ...r.cash, ...r.period }));
    return { ...identity, dataset: version, referenceAt: dataset.referenceAt, holders, proceeds, reservations, subscriptions, snapshot,
        assumption: assumptions.length ? assumptions[0] : null, financials, prices: prices.map(p => p.price), peers, sources, researchEvidenceIds: researchEvidence.map(e => e.evidenceId) };
}
export type IpoRecords = NonNullable<Awaited<ReturnType<typeof readIpo>>>;
