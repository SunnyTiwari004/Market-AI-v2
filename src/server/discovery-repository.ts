import "server-only";
import { and, asc, eq, lte } from "drizzle-orm";
import { database } from "./db/connection";
import * as t from "./db/schema";
import { DATASET } from "../data/synthetic/spec";
import { readStock } from "./stock-repository";
import type { Evidence, Horizon } from "../domain/research/types";

export async function readDiscovery(horizon: Horizon) {
    const db = database();
    const [dataset] = await db.select().from(t.datasets).where(and(eq(t.datasets.version, DATASET), eq(t.datasets.published, true)));
    if (!dataset) throw new Error("DATASET_UNAVAILABLE");
    // The reference instant belongs to the published simulation, never the host clock.
    const cutoff = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(dataset.referenceAt));
    const [listings, issuers, sectors, themes, collections, themeMembers, collectionMembers, offers, events, prices, sessions, sourceRows] = await Promise.all([
        db.select().from(t.listings).where(and(eq(t.listings.dataset, dataset.version), lte(t.listings.listedAt, cutoff))),
        db.select().from(t.issuers).where(eq(t.issuers.dataset, dataset.version)),
        db.select().from(t.sectors).where(eq(t.sectors.dataset, dataset.version)),
        db.select().from(t.themes).where(eq(t.themes.dataset, dataset.version)),
        db.select().from(t.collections).where(eq(t.collections.dataset, dataset.version)),
        db.select().from(t.themeMembers).where(eq(t.themeMembers.dataset, dataset.version)),
        db.select().from(t.collectionMembers).where(eq(t.collectionMembers.dataset, dataset.version)),
        db.select().from(t.offers).where(and(eq(t.offers.dataset, dataset.version), lte(t.offers.termsPublishedAt, dataset.referenceAt))),
        db.select().from(t.events).where(and(eq(t.events.dataset, dataset.version), lte(t.events.publishedAt, dataset.referenceAt))),
        db.select().from(t.prices).where(and(eq(t.prices.dataset, dataset.version), lte(t.prices.date, cutoff))).orderBy(asc(t.prices.date)),
        db.select().from(t.tradingSessions).where(and(eq(t.tradingSessions.dataset, dataset.version), lte(t.tradingSessions.closeAt, dataset.referenceAt))).orderBy(asc(t.tradingSessions.date)),
        db.select({ record: t.evidence, document: t.documents, article: t.articles, publisher: t.publishers.name }).from(t.evidence)
            .leftJoin(t.documents, and(eq(t.documents.dataset, t.evidence.dataset), eq(t.documents.id, t.evidence.id)))
            .leftJoin(t.articles, and(eq(t.articles.dataset, t.evidence.dataset), eq(t.articles.id, t.evidence.id)))
            .leftJoin(t.publishers, and(eq(t.publishers.dataset, t.articles.dataset), eq(t.publishers.id, t.articles.publisherId)))
            .where(and(eq(t.evidence.dataset, dataset.version), lte(t.evidence.publishedAt, dataset.referenceAt))),
    ]);
    const stocks = await Promise.all(listings.map(l => readStock(l.symbol, cutoff, horizon)));
    const sources: Evidence[] = sourceRows.filter(r => r.document || r.article).map(({ record, document, article, publisher }) => {
        if (!record.simulated) throw new Error("INVALID_PROVENANCE");
        return { id: record.id, issuerId: document?.issuerId ?? null, kind: record.kind, title: record.title, publishedAt: record.publishedAt, body: document?.body ?? article!.body, publisher: document?.publisher ?? publisher ?? "Fictional publisher", simulated: true, documentType: document?.documentType as Evidence["documentType"] ?? null };
    });
    return { dataset: dataset.version, cutoff, referenceAt: dataset.referenceAt, listings, issuers, sectors, themes, collections, themeMembers, collectionMembers, offers, events, prices, sessions, sources, stocks };
}
export type DiscoveryRecords = Awaited<ReturnType<typeof readDiscovery>>;
