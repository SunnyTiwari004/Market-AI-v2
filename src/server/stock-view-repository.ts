import "server-only";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { database } from "./db/connection";
import * as t from "./db/schema";
import { DATASET } from "../data/synthetic/spec";
import { timestamp } from "../domain/research/calendar";
import type { Evidence, Horizon } from "../domain/research/types";

export async function readFinancials(issuerId: string, cutoff: string) {
    return database().select({ period: t.periods, income: t.incomes, balance: t.balances, cashflow: t.cashflows })
        .from(t.periods)
        .leftJoin(t.incomes, and(eq(t.incomes.dataset, t.periods.dataset), eq(t.incomes.id, t.periods.id)))
        .leftJoin(t.balances, and(eq(t.balances.dataset, t.periods.dataset), eq(t.balances.id, t.periods.id)))
        .leftJoin(t.cashflows, and(eq(t.cashflows.dataset, t.periods.dataset), eq(t.cashflows.id, t.periods.id)))
        .where(and(eq(t.periods.dataset, DATASET), eq(t.periods.issuerId, issuerId), lte(t.periods.end, cutoff), lte(t.periods.publishedAt, timestamp(cutoff))))
        .orderBy(desc(t.periods.end), asc(t.periods.id));
}
export type FinancialRecord = Awaited<ReturnType<typeof readFinancials>>[number];

export async function readCloses(listingId: string, cutoff: string) {
    return database().select({ id: t.prices.id, listingId: t.prices.listingId, date: t.prices.date, close: t.prices.close })
        .from(t.prices).where(and(eq(t.prices.dataset, DATASET), eq(t.prices.listingId, listingId), lte(t.prices.date, cutoff))).orderBy(asc(t.prices.date));
}

export async function readSources(issuerId: string, cutoff: string, kind: "article" | "document"): Promise<Evidence[]> {
    const rows = await database().select({ record: t.evidence, document: t.documents, article: t.articles, publisher: t.publishers.name })
        .from(t.evidenceIssuers)
        .innerJoin(t.evidence, and(eq(t.evidence.dataset, t.evidenceIssuers.dataset), eq(t.evidence.id, t.evidenceIssuers.evidenceId)))
        .leftJoin(t.documents, and(eq(t.documents.dataset, t.evidence.dataset), eq(t.documents.id, t.evidence.id)))
        .leftJoin(t.articles, and(eq(t.articles.dataset, t.evidence.dataset), eq(t.articles.id, t.evidence.id)))
        .leftJoin(t.publishers, and(eq(t.publishers.dataset, t.articles.dataset), eq(t.publishers.id, t.articles.publisherId)))
        .where(and(eq(t.evidenceIssuers.dataset, DATASET), eq(t.evidenceIssuers.issuerId, issuerId), eq(t.evidence.kind, kind), lte(t.evidence.publishedAt, timestamp(cutoff))))
        .orderBy(desc(t.evidence.publishedAt), asc(t.evidence.id));
    return rows.map(({ record, document, article, publisher }) => {
        const body = document?.body ?? article?.body, name = document?.publisher ?? publisher;
        if (!record.simulated || !body || !name) throw new Error("SOURCE_UNAVAILABLE");
        return { id: record.id, issuerId, kind: record.kind, title: record.title, publishedAt: record.publishedAt, body, publisher: name, simulated: true,
            documentType: document?.documentType as Evidence["documentType"] ?? null };
    });
}

export async function readSectorPeers(sectorId: string, cutoff: string, horizon: Horizon) {
    return database().select({ listing: t.listings, issuer: t.issuers, research: t.snapshots })
        .from(t.listings).innerJoin(t.issuers, and(eq(t.issuers.dataset, t.listings.dataset), eq(t.issuers.id, t.listings.issuerId)))
        .leftJoin(t.snapshots, and(eq(t.snapshots.dataset, t.listings.dataset), eq(t.snapshots.listingId, t.listings.id), eq(t.snapshots.cutoff, cutoff), eq(t.snapshots.horizon, horizon)))
        .where(and(eq(t.listings.dataset, DATASET), eq(t.issuers.sectorId, sectorId), lte(t.listings.listedAt, cutoff)))
        .orderBy(asc(t.issuers.name));
}
