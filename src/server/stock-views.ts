import "server-only";
import { readCloses, readFinancials, readSectorPeers, readSources } from "./stock-view-repository";
import { chartHistory } from "../features/stock/read-models";
import type { StockState } from "../features/stock/state";

export async function getStockView(identity: { issuerId: string; listingId: string; sectorId: string }, state: StockState) {
    try {
        switch (state.view) {
            case "financials": {
                const [records, sources] = await Promise.all([readFinancials(identity.issuerId, state.cutoff), readSources(identity.issuerId, state.cutoff, "document")]);
                return { kind: "financials" as const, records, sources };
            }
            case "chart": return { kind: "chart" as const, ...chartHistory(await readCloses(identity.listingId, state.cutoff), state.cutoff, state.range) };
            case "news": return { kind: "news" as const, sources: await readSources(identity.issuerId, state.cutoff, "article") };
            case "filings": return { kind: "filings" as const, sources: await readSources(identity.issuerId, state.cutoff, "document") };
            case "peers": return { kind: "peers" as const, peers: await readSectorPeers(identity.sectorId, state.cutoff, state.horizon) };
            default: return { kind: "overview" as const };
        }
    } catch {
        console.error("Stock view read failed", { operation: state.view, code: "DATA_UNAVAILABLE" });
        return { kind: "unavailable" as const };
    }
}
export type StockViewData = Awaited<ReturnType<typeof getStockView>>;
