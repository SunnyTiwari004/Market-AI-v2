import "server-only";
import { and, desc, eq, lte } from "drizzle-orm";
import { database } from "./db/connection";
import * as t from "./db/schema";
import { DATASET } from "../data/synthetic/spec";
import type { Evidence, Horizon, Snapshot } from "../domain/research/types";
import { previousSession, timestamp } from "../domain/research/calendar";
export async function readStock(symbol: string, cutoff: string, horizon: Horizon) {
    const db = database(), version = DATASET;
    const published = await db.select().from(t.datasets).where(and(eq(t.datasets.version, version), eq(t.datasets.published, true))).limit(1);
    if (!published.length)
        throw new Error("DATASET_UNAVAILABLE");
    const found = await db.select({ listing: t.listings, issuer: t.issuers, sector: t.sectors }).from(t.listings).innerJoin(t.issuers, and(eq(t.issuers.dataset, t.listings.dataset), eq(t.issuers.id, t.listings.issuerId))).innerJoin(t.sectors, and(eq(t.sectors.dataset, t.issuers.dataset), eq(t.sectors.id, t.issuers.sectorId))).where(and(eq(t.listings.dataset, version), eq(t.listings.symbol, symbol.toUpperCase()))).limit(1);
    if (!found.length)
        return null;
    const { listing, issuer, sector } = found[0];
    const rows = await db.select().from(t.snapshots).where(and(eq(t.snapshots.dataset, version), eq(t.snapshots.listingId, listing.id), eq(t.snapshots.horizon, horizon), lte(t.snapshots.cutoff, cutoff))).orderBy(desc(t.snapshots.cutoff)).limit(2);
    // A prior row must never masquerade as missing selected research.
    if (!rows.length || rows[0].cutoff !== cutoff)
        return { issuer, listing, sector, snapshot: null, previous: null, evidence: [], scenario: null, assumptions: [], quote: null, previousQuote: null };
    async function hydrate(row: typeof rows[number]): Promise<Snapshot> {
        const [financial, prices, peers, evidence, findings] = await Promise.all([
            db.select().from(t.snapshotFinancial).where(and(eq(t.snapshotFinancial.dataset, version), eq(t.snapshotFinancial.snapshotId, row.id))),
            db.select().from(t.snapshotPrices).where(and(eq(t.snapshotPrices.dataset, version), eq(t.snapshotPrices.snapshotId, row.id))),
            db.select().from(t.snapshotPeers).where(and(eq(t.snapshotPeers.dataset, version), eq(t.snapshotPeers.snapshotId, row.id))),
            db.select().from(t.snapshotEvidence).where(and(eq(t.snapshotEvidence.dataset, version), eq(t.snapshotEvidence.snapshotId, row.id))),
            db.select({ finding: t.findings, evidenceId: t.findingEvidence.evidenceId }).from(t.findings).innerJoin(t.findingEvidence, and(eq(t.findings.dataset, t.findingEvidence.dataset), eq(t.findings.id, t.findingEvidence.findingId))).where(and(eq(t.findings.dataset, version), eq(t.findings.snapshotId, row.id))),
        ]);
        if (!row.output?.metrics || !row.output.picture || !row.output.risk || !row.output.confidence)
            throw new Error("INVALID_RESEARCH_RECORD");
        const grouped = new Map<string, Snapshot["findings"][number]>();
        for (const { finding, evidenceId } of findings) {
            const f = grouped.get(finding.id) ?? { key: finding.key, field: finding.field, kind: finding.kind, evidenceIds: [] };
            f.evidenceIds.push(evidenceId);
            grouped.set(finding.id, f);
        }
        return { ...row.output, id: row.id, issuerId: issuer.id, listingId: listing.id, dataset: version, method: row.method, cutoff: row.cutoff, session: row.session, horizon: row.horizon, scenarioId: row.scenarioId, financialIds: financial.map(p => p.periodId), priceIds: prices.map(p => p.priceId), peerIds: peers.map(p => p.listingId), evidenceIds: evidence.map(p => p.evidenceId), findings: [...grouped.values()] };
    }
    const snapshot = await hydrate(rows[0]), previous = rows[1] ? await hydrate(rows[1]) : null;
    const sources = await db.select({ record: t.evidence, document: t.documents, article: t.articles, publisher: t.publishers.name }).from(t.snapshotEvidence).innerJoin(t.evidence, and(eq(t.snapshotEvidence.dataset, t.evidence.dataset), eq(t.snapshotEvidence.evidenceId, t.evidence.id))).leftJoin(t.documents, and(eq(t.documents.dataset, t.evidence.dataset), eq(t.documents.id, t.evidence.id))).leftJoin(t.articles, and(eq(t.articles.dataset, t.evidence.dataset), eq(t.articles.id, t.evidence.id))).leftJoin(t.publishers, and(eq(t.publishers.dataset, t.articles.dataset), eq(t.publishers.id, t.articles.publisherId))).where(and(eq(t.snapshotEvidence.dataset, version), eq(t.snapshotEvidence.snapshotId, snapshot.id), lte(t.evidence.publishedAt, timestamp(cutoff))));
    const evidence: Evidence[] = sources.map(({ record, document, article, publisher }) => {
        if (!record.simulated || !(document?.body || article?.body))
            throw new Error("EVIDENCE_UNAVAILABLE");
        return { id: record.id, issuerId: document?.issuerId ?? issuer.id, kind: record.kind, title: record.title, publishedAt: record.publishedAt, simulated: true, documentType: document?.documentType as Evidence["documentType"] ?? null, body: document?.body ?? article!.body, publisher: document?.publisher ?? publisher ?? "Fictional publisher" };
    });
    if (evidence.length !== snapshot.evidenceIds.length)
        throw new Error("EVIDENCE_COVERAGE_MISMATCH");
    const output = await db.select().from(t.scenarioSets).where(and(eq(t.scenarioSets.dataset, version), eq(t.scenarioSets.id, snapshot.scenarioId))).limit(1);
    if (!output.length)
        throw new Error("SCENARIO_RECORD_MISSING");
    const assumptions = await db.select().from(t.cases).where(and(eq(t.cases.dataset, version), eq(t.cases.assumptionId, output[0].assumptionId)));
    assumptions.sort((a, b) => ["Weak", "Base", "Strong"].indexOf(a.label) - ["Weak", "Base", "Strong"].indexOf(b.label));
    const quotes = await db.select().from(t.prices).where(and(eq(t.prices.dataset, version), eq(t.prices.listingId, listing.id), lte(t.prices.date, snapshot.session))).orderBy(desc(t.prices.date)).limit(2);
    return { issuer, listing, sector, snapshot, previous, evidence, scenario: output[0].output, assumptions, quote: quotes[0]?.date === snapshot.session ? quotes[0] : null, previousQuote: quotes[1]?.date === previousSession(snapshot.session) ? quotes[1] : null };
}
