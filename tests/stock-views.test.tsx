import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { buildSlice } from "../src/data/synthetic/build";
import { stockState, stockUrl, VIEWS } from "../src/features/stock/state";
import { shareLink } from "../src/features/stock/share-link";
import { chartHistory, displayFinancial, financialChanges, financialValue, filterDocuments, peerMetric } from "../src/features/stock/read-models";
import { CloseChart, selectedIndex } from "../src/features/stock/chart";
import { StockView } from "../src/features/stock/views";
import { StockOverview } from "../src/features/stock/overview";
import { stockFixture } from "./stock-fixture";
import { whatChanged } from "../src/domain/research/changes";
import type { FinancialRecord, readSectorPeers } from "../src/server/stock-view-repository";
vi.mock("next/navigation", () => ({ usePathname: () => "/stocks/tavren", useSearchParams: () => new URLSearchParams() }));
const slice = buildSlice(), base = stockFixture();
const data = { ...base, status: "available" as const, context: { cutoff: "2026-09-30", horizon: "long" as const }, daily: null, changes: whatChanged(base.previous, base.snapshot) };
function records(issuerId = base.issuer.id): FinancialRecord[] {
    return slice.financials.filter(p => p.issuerId === issuerId).sort((a, b) => b.end.localeCompare(a.end)).map(p => {
        const row = { ...p, dataset: slice.version };
        return { period: row, income: row, balance: row, cashflow: row };
    });
}
describe("Stock URL ownership", () => {
    it("shares safe URLs with native cancellation, clipboard and manual fallbacks", async () => {
        const url = "https://example.invalid/stocks/tavren?view=chart", copy = vi.fn().mockResolvedValue(undefined);
        expect(await shareLink(url, { share: vi.fn().mockResolvedValue(undefined), copy })).toBe("shared");
        expect(copy).not.toHaveBeenCalled();
        const abort = new Error("cancelled"); abort.name = "AbortError";
        expect(await shareLink(url, { share: vi.fn().mockRejectedValue(abort), copy })).toBe("cancelled");
        expect(copy).not.toHaveBeenCalled();
        expect(await shareLink(url, { share: vi.fn().mockRejectedValue(new Error("unavailable")), copy })).toBe("copied");
        expect(copy).toHaveBeenCalledWith(url);
        expect(await shareLink(url, { copy: vi.fn().mockRejectedValue(new Error("denied")) })).toBe("manual");
        expect(await shareLink(url, {})).toBe("manual");
    });
    it("normalizes repeated/invalid input without retaining unrelated financial or transient state", () => {
        const s = stockState({ level: ["pro", "simple"], horizon: "bad", view: "bad", range: "bad", period: "bad", type: "bad", year: "oops" });
        expect(s).toEqual(stockState({}));
        expect(stockUrl("TAVREN", s)).toBe("/stocks/tavren");
    });
    it("round trips all six views with applicable state and discards other view filters", () => {
        for (const view of VIEWS) {
            const s = stockState({ view, level: "pro", horizon: "short", period: "quarterly", range: "2y", type: "annual", year: "2026" });
            const url = new URL(stockUrl("TAVREN", s), "https://example.invalid");
            const roundtrip = stockState(Object.fromEntries(url.searchParams));
            expect([roundtrip.view, roundtrip.level, roundtrip.horizon]).toEqual([view, "pro", "short"]);
            expect(url.searchParams.has("period")).toBe(view === "financials");
            expect(url.searchParams.has("range")).toBe(view === "chart");
            expect(url.searchParams.has("type")).toBe(view === "filings");
        }
    });
});
describe("Financials read models and rendering", () => {
    it("renders all annual and quarterly periods, statements, units and actual evidence", () => {
        for (const period of ["annual", "quarterly"] as const) {
            const view = { kind: "financials" as const, records: records(), sources: slice.evidence.filter(e => e.issuerId === base.issuer.id) };
            const html = renderToStaticMarkup(<StockView view={view} data={data} state={stockState({ view: "financials", period, level: "pro" })}/>);
            expect(view.records.filter(r => r.period.basis === period)).toHaveLength(period === "annual" ? 3 : 8);
            for (const label of ["Income Statement", "Balance Sheet", "Cash Flow", "standalone", "INR million", "Operating margin = EBIT", "Free cash flow = Operating cash flow", "scope=\"row\"", "tabindex=\"0\""]) expect(html).toContain(label);
            const ends = view.records.filter(r => r.period.basis === period).map(r => r.period.end);
            expect(ends).toEqual([...ends].sort().reverse());
            expect(html).toContain(view.sources.find(s => s.id === view.records.find(r => r.period.basis === period)!.period.sourceId)!.body.split("\n")[1]);
        }
    });
    it("keeps missing different from zero and negative amounts signed", () => {
        const record = records()[0];
        expect(financialValue({ ...record, cashflow: null }, "fcf")).toBeNull();
        expect(financialValue({ ...record, income: null }, "margin")).toBeNull();
        expect(displayFinancial(null, "INR million")).toBeNull();
        expect(displayFinancial("0", "INR million")).toBe("0.00");
        expect(displayFinancial("-2500000", "INR million")).toBe("-2.50");
        const html = renderToStaticMarkup(<StockView view={{ kind: "financials", records: [{ ...record, cashflow: null }], sources: [] }} data={data} state={stockState({ view: "financials", period: record.period.basis })}/>);
        expect(html).toContain('class="sr-only">Unavailable');
    });
    it("uses same-period prior-year changes and never invents missing comparisons", () => {
        const change = financialChanges(records(), "quarterly")!;
        expect(change.current.period.end).toBe("2026-06-30");
        expect(change.prior.period.end).toBe("2025-06-30");
        expect(financialChanges([records()[0]], "quarterly")).toBeNull();
        expect(change.changes.find(c => c.key === "revenue")!.direction).toBe("higher");
    });
    it("keeps conclusions, negative findings and canonical values consistent across explanation levels", () => {
        for (const level of ["simple", "normal", "pro"] as const) {
            const overview = renderToStaticMarkup(<StockOverview data={data} level={level}/>);
            for (const label of ["Quick View", "Needs Attention", "What Changed?", base.snapshot.picture.value!, base.snapshot.risk.value!]) expect(overview).toContain(label);
            const html = renderToStaticMarkup(<StockView view={{ kind: "financials", records: records(), sources: [] }} data={data} state={stockState({ view: "financials", level })}/>);
            expect(html).toContain("Revenue was higher"); expect(html).toContain("510.00"); expect(html).toContain("-15.30");
        }
    });
});
describe("stored closing chart", () => {
    const prices = slice.prices.filter(p => p.listingId === base.listing.id);
    it("selects stored points only, clamps calendar month ends and excludes pre-listing history", () => {
        const recent = slice.listings.find(l => l.symbol === "MERUVAN")!;
        const chart = chartHistory(slice.prices.filter(p => p.listingId === recent.id), "2026-09-30", "2y");
        expect(chart.points).toHaveLength(89); expect(chart.points[0].date).toBe(recent.listedAt);
        expect(chartHistory(prices, "2026-03-31", "1m").start).toBe("2026-02-28");
        expect(chartHistory(prices, "2026-09-30", "1m").points.every(p => prices.includes(p))).toBe(true);
    });
    it("does not fill gaps or manufacture an empty history, with missing-return handling", () => {
        expect(chartHistory([], "2026-09-30", "2y").points).toEqual([]);
        const gap = chartHistory(prices.filter(p => p.date !== "2026-09-15"), "2026-09-30", "1m");
        expect(gap.points.some(p => p.date === "2026-09-15")).toBe(false); expect(gap.change).toBeNull();
    });
    it("exposes exactly the chart points in its semantic table and allows keyboard selection", () => {
        const points = chartHistory(prices, "2026-09-30", "1m").points;
        const html = renderToStaticMarkup(<CloseChart points={points}/>);
        expect((html.match(/<tr>/g) ?? []).length).toBe(points.length + 1);
        for (const p of points) expect(html).toContain(p.date);
        expect(html).toContain('type="range"'); expect(html).not.toMatch(/candlestick|OHLC|canvas/);
        expect(selectedIndex(0, "ArrowLeft", points.length)).toBe(0);
        expect(selectedIndex(3, "ArrowRight", points.length)).toBe(4);
        expect(selectedIndex(3, "Home", points.length)).toBe(0);
        expect(selectedIndex(3, "End", points.length)).toBe(points.length - 1);
    });
});
describe("source and peer behavior", () => {
    it("filters issuer documents without articles or fabricated downloads, including zero matches", () => {
        const sources = slice.evidence.filter(e => e.issuerId === base.issuer.id);
        expect(filterDocuments(sources, stockState({ type: "annual" }))).toHaveLength(3);
        expect(filterDocuments(sources, stockState({ type: "quarterly" }))).toHaveLength(8);
        expect(filterDocuments(sources, stockState({ type: "announcement", year: "2024" }))).toEqual([]);
        const html = renderToStaticMarkup(<StockView view={{ kind: "filings", sources: sources.filter(s => s.kind === "document") }} data={data} state={stockState({ view: "filings" })}/>);
        expect(html).toContain("Apply filters"); expect(html).toContain("Read document"); expect(html).not.toMatch(/Download|href="#"/);
    });
    it("preserves actual article bodies and simulated publishers at every level", () => {
        const sources = slice.evidence.filter(e => e.issuerId === base.issuer.id && e.kind === "article").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        expect(sources).toHaveLength(2);
        for (const level of ["simple", "normal", "pro"] as const) {
            const html = renderToStaticMarkup(<StockView view={{ kind: "news", sources }} data={data} state={stockState({ view: "news", level })}/>);
            expect(html.indexOf(sources[0].title)).toBeLessThan(html.indexOf(sources[1].title));
            for (const source of sources) { expect(html).toContain(source.publisher); expect(html).toContain(source.body.split("\n")[1]); }
            expect(html).not.toMatch(/Reuters|Bloomberg|Moneycontrol|https?:\/\//);
        }
    });
    it("requires compatible research and keeps unavailable peer metrics explicit", () => {
        const snap = base.snapshot;
        const peer: Awaited<ReturnType<typeof readSectorPeers>>[number] = { issuer: base.issuer, listing: base.listing, research: { dataset: slice.version, id: snap.id, listingId: snap.listingId, cutoff: snap.cutoff, session: snap.session, horizon: snap.horizon, method: snap.method, scenarioId: snap.scenarioId, digest: "test", output: snap } };
        expect(peerMetric(peer, peer, "margin").value).toBe(snap.metrics.margin.value);
        expect(peerMetric({ ...peer, research: null }, peer, "margin").value).toBeNull();
        expect(peerMetric({ ...peer, research: { ...peer.research!, output: { ...snap, annualEnd: "2025-03-31" } } }, peer, "margin").value).toBeNull();
        expect(peerMetric({ ...peer, research: { ...peer.research!, output: { ...snap, ttmEnd: null } } }, peer, "pe").value).toBeNull();
    });
});
