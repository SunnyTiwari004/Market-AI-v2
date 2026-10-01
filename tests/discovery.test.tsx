import { beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }), usePathname: () => "/explore", useSearchParams: () => new URLSearchParams() }));
vi.mock("../src/server/discovery-repository", () => ({ readDiscovery: vi.fn() }));
import { renderToStaticMarkup } from "react-dom/server";
import { readDiscovery } from "../src/server/discovery-repository";
import { getDiscovery } from "../src/server/discovery";
import { buildDiscovery, recentChange, selectDiscovery } from "../src/features/discovery/model";
import { appliedCount, DEFAULT_FILTERS, discoveryState, discoveryUrl, matchIdentities } from "../src/features/discovery/state";
import { DiscoveryPage } from "../src/features/discovery/page";
import { DiscoveryControls, HomeSearch } from "../src/features/discovery/controls";
import { ApplicationNavigation } from "../src/components/application-navigation";
import { discoveryFixture } from "./discovery-fixture";
import { offerTerms } from "../src/domain/ipo/terms";
let records: ReturnType<typeof discoveryFixture>;
const scopes = { sectors: ["digital-operations-services"], themes: ["connected-operations"], collections: ["capacity-and-cash"] };
const state = discoveryState("/explore", {}, scopes);
beforeAll(() => { records = discoveryFixture(); });
describe("discovery state and matching", () => {
    it("defaults Research Picture to Any and strips incompatible/repeated/unknown state", () => {
        expect(state.picture).toBe("Any");
        const invalid = discoveryState("/explore", { type: ["stocks", "ipos"], picture: "Strong", risk: "Low", horizon: "forever", sector: "unknown", q: ["a", "b"] }, scopes);
        expect(discoveryUrl("/explore", invalid)).toBe("/explore");
        for (const type of ["all", "sectors", "themes", "ipos"]) expect(discoveryState("/explore", { type, picture: "Strong" }, scopes).picture).toBe("Any");
    });
    it("round-trips submitted state, preserves Unicode and excludes transient state", () => {
        const value = discoveryState("/explore", { type: "stocks", q: "  Café & tools  ", horizon: "short", picture: "Strong", valuation: "In line", theme: "connected-operations" }, scopes);
        const url = discoveryUrl("/explore", value);
        expect(discoveryState("/explore", Object.fromEntries(new URL(url, "https://example.invalid").searchParams), scopes)).toEqual(value);
        expect(appliedCount(value)).toBe(2);
        const draft = { ...value, risk: "High" as const };
        expect(appliedCount(value)).toBe(2); expect(appliedCount(draft)).toBe(3);
        expect(discoveryUrl("/explore", value, DEFAULT_FILTERS)).toContain("q=Caf");
        expect(discoveryUrl("/ipos", value)).not.toMatch(/horizon|picture|theme/);
    });
    it("ranks exact names/symbols/aliases before prefix and partial, retaining ambiguity", () => {
        const items = [{ id: "1", kind: "stocks" as const, name: "Prefix Tools", symbol: "ONE", aliases: ["Shared"], href: "/stocks/one" }, { id: "2", kind: "stocks" as const, name: "Tools", symbol: "TWO", aliases: ["Shared"], href: "/stocks/two" }, { id: "3", kind: "stocks" as const, name: "Tools Plus", aliases: [], href: "/stocks/three" }];
        expect(matchIdentities(items, "  TOOLS ").map(i => i.id)).toEqual(["2", "3", "1"]);
        expect(matchIdentities(items, "Shared")).toHaveLength(2);
        expect(matchIdentities(items, "one")[0].id).toBe("1");
        expect(matchIdentities(items, "unknown")).toEqual([]);
        expect(matchIdentities(items, "   ")).toHaveLength(3);
    });
});
describe("canonical read model", () => {
    it("contains precisely 12 listings, four offers, four sectors and canonical memberships", () => {
        const model = buildDiscovery(records, state);
        expect(model.stocks).toHaveLength(12); expect(model.ipos).toHaveLength(4); expect(model.sectors).toHaveLength(4);
        expect(model.themes.map(t => t.name)).toEqual(["Connected Operations", "Everyday Resource Use"]);
        expect(model.collections.map(t => t.name)).toEqual(["Recurring Service Models", "Capacity and Cash"]);
        expect(model.ipos.map(i => i.terms?.status).sort()).toEqual(["Closed", "Listed", "Open", "Upcoming"]);
        expect(model.stocks.some(s => s.name.includes("Elarven"))).toBe(false);
        expect(model.market?.date).toBe("2026-09-30"); expect(model.market?.memberIds).toHaveLength(12);
        for (const stock of model.stocks) expect(stock.snapshot).toEqual(records.stocks.find(s => s?.listing.id === stock.id)!.snapshot);
        expect(model.stocks.filter(s => s.worthy).every(s => s.reason && s.caution && s.snapshot?.risk.value !== "High")).toBe(true);
    });
    it("applies company filters with AND and never to other categories", () => {
        const model = buildDiscovery(records, state);
        const filters = discoveryState("/explore", { type: "stocks", picture: "Strong", risk: "Low", valuation: "Attractive" }, scopes);
        const results = selectDiscovery(model, filters);
        expect(results.stocks.length).toBeGreaterThan(0);
        expect(results.stocks.every(s => s.snapshot?.picture.value === "Strong" && s.snapshot.risk.value === "Low" && s.snapshot.valuation.value === "Attractive")).toBe(true);
        expect(selectDiscovery(model, { ...filters, type: "ipos" }).ipos).toHaveLength(4);
        expect(selectDiscovery(model, { ...filters, picture: "Weak", risk: "Low" }).stocks).toHaveLength(0);
        expect(selectDiscovery(model, { ...state, q: " meRUvan " }).stocks[0].symbol).toBe("MERUVAN");
        expect(selectDiscovery(model, { ...state, q: "no such issuer" }).stocks).toEqual([]);
        expect(selectDiscovery(model, { ...state, theme: "connected-operations" }).stocks).toHaveLength(4);
        expect(selectDiscovery(model, { ...state, collection: "capacity-and-cash" }).stocks).toHaveLength(3);
    });
    it("uses picture direction then risk direction and distinguishes missing comparisons", () => {
        const changes = buildDiscovery(records, state).stocks[0].changes!;
        const base = { ...changes, categories: [{ field: "picture", before: "Mixed", after: "Strong", state: "Improved" }, { field: "risk", before: "Low", after: "High", state: "Changed" }] };
        expect(recentChange(base)).toBe("Improving");
        expect(recentChange({ ...base, categories: base.categories.map(c => c.field === "picture" ? { ...c, before: "Strong", state: "Unchanged" } : c) })).toBe("Weakening");
        expect(recentChange(null)).toBe("Newly available/Unavailable");
        expect(recentChange({ ...base, categories: [{ field: "picture", before: null, after: "Strong", state: "Newly available" }] })).toBe("Newly available/Unavailable");
    });
    it("derives IPO lifecycle on exact simulation boundaries, not expected listing plans", () => {
        const offer = records.offers.find(o => o.actualListing)!;
        const read = (cutoff: string) => offerTerms({ ...offer, holders: [], proceeds: [], reservations: [], subscriptions: [] }, cutoff, new Map()).value;
        expect(read(offer.opensAt)?.status).toBe("Open"); expect(read(offer.closesAt)?.status).toBe("Open");
        expect(read(offer.actualListing!)?.status).toBe("Listed");
        expect(offerTerms({ ...offer, actualListing: null, listingId: null, holders: [], proceeds: [], reservations: [], subscriptions: [] }, records.referenceAt, new Map()).value?.status).toBe("Closed");
    });
});
describe("service and rendered discovery", () => {
    it("shows populated Home backed by market read model and real source controls", async () => {
        vi.mocked(readDiscovery).mockResolvedValue(records);
        const html = renderToStaticMarkup(await DiscoveryPage({ route: "/", query: {} }));
        for (const text of ["Market in Simple Words", "What Matters Today", "Sector Picture", "Worth Researching", "Recent Research Changes", "IPO Watch", records.events.find(e => e.kind === "market-sector")!.summary]) expect(html).toContain(text);
        expect(readDiscovery).toHaveBeenCalledWith("long");
        expect(html).not.toMatch(/href="#"|href="\/ask/); expect(html).toContain('href="/ipos/');
    });
    it("renders complete directories and distinct no-match and empty-dataset recovery", async () => {
        vi.mocked(readDiscovery).mockResolvedValue(records);
        const stocks = renderToStaticMarkup(await DiscoveryPage({ route: "/stocks", query: {} }));
        for (const listing of records.listings) expect(stocks).toContain(`href="/stocks/${listing.symbol.toLowerCase()}"`);
        expect(stocks).toContain("12 results");
        const offers = renderToStaticMarkup(await DiscoveryPage({ route: "/ipos", query: {} }));
        expect(offers).toContain("4 results"); for (const offer of records.offers) expect(offers).toContain(`href="/ipos/${offer.slug}"`);
        expect(renderToStaticMarkup(await DiscoveryPage({ route: "/stocks", query: { q: "no matching business" } }))).toContain("No matching results");
        vi.mocked(readDiscovery).mockResolvedValue({ ...records, listings: [], stocks: [] });
        expect(renderToStaticMarkup(await DiscoveryPage({ route: "/stocks", query: {} }))).toContain("No canonical records available");
    });
    it("keeps failures distinct from zero results and sanitizes driver details", async () => {
        vi.mocked(readDiscovery).mockRejectedValue(new Error("private-credential-example"));
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(await getDiscovery("/explore", {})).toEqual({ status: "data-unavailable" });
        const html = renderToStaticMarkup(await DiscoveryPage({ route: "/stocks", query: { q: "Tavren" } }));
        expect(html).toContain("Retry data connection"); expect(html).not.toContain("private-credential-example");
        expect(JSON.stringify(log.mock.calls)).not.toContain("private-credential-example"); log.mockRestore();
    });
    it("exposes only working navigation and accessible modal/search controls", () => {
        const nav = renderToStaticMarkup(<ApplicationNavigation/>);
        for (const route of ["/", "/explore", "/stocks", "/ipos"]) expect(nav).toContain(`href="${route}"`);
        expect(nav).not.toContain("Ask AI"); expect(nav).toContain('aria-current="page"');
        const controls = renderToStaticMarkup(<DiscoveryControls route="/explore" state={state} canonicalUrl="/explore" sectors={[]} count={12}/>);
        expect(controls).toContain("<dialog"); expect(controls).toContain("aria-labelledby"); expect(controls).toContain("Close filters without applying"); expect(controls).toContain("5. Research Horizon");
        const home = renderToStaticMarkup(<HomeSearch identities={buildDiscovery(records, state).identities}/>);
        expect(home).toContain('role="combobox"'); expect(home).toContain('role="listbox"');
    });
});
