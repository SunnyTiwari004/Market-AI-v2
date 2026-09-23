import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("../src/server/stock-view-repository", () => ({ readFinancials: vi.fn(), readSources: vi.fn(), readCloses: vi.fn(), readSectorPeers: vi.fn() }));
import { readFinancials, readSources, readCloses, readSectorPeers } from "../src/server/stock-view-repository";
import { getStockView } from "../src/server/stock-views";
import { stockState } from "../src/features/stock/state";
const identity = { issuerId: "issuer", listingId: "listing", sectorId: "sector" };
beforeEach(() => vi.resetAllMocks());
it("requests only the selected view's scoped records and preserves empty states", async () => {
    vi.mocked(readFinancials).mockResolvedValue([]); vi.mocked(readSources).mockResolvedValue([]);
    expect(await getStockView(identity, stockState({ view: "financials" }))).toEqual({ kind: "financials", records: [], sources: [] });
    expect(readFinancials).toHaveBeenCalledWith("issuer", "2026-09-30");
    expect(readSources).toHaveBeenCalledWith("issuer", "2026-09-30", "document");
    expect(readCloses).not.toHaveBeenCalled(); expect(readSectorPeers).not.toHaveBeenCalled();
    expect(await getStockView(identity, stockState({ view: "news" }))).toEqual({ kind: "news", sources: [] });
    expect(readSources).toHaveBeenLastCalledWith("issuer", "2026-09-30", "article");
});
it("reports DB failures separately from empty results without exposing private details", async () => {
    vi.mocked(readCloses).mockRejectedValue(new Error("private database credential"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await getStockView(identity, stockState({ view: "chart" }))).toEqual({ kind: "unavailable" });
    expect(JSON.stringify(log.mock.calls)).not.toContain("private");
    log.mockRestore();
});
