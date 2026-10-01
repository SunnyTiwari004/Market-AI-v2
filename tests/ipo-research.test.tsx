import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("server-only", () => ({}));
vi.mock("../src/server/ipo-repository", () => ({ readIpo: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => "/ipos/example", useSearchParams: () => new URLSearchParams(), useRouter: () => ({ replace: vi.fn() }) }));
import { readIpo } from "../src/server/ipo-repository";
import { getIpoResearch } from "../src/server/ipo-research";
import { buildIpo } from "../src/features/ipo/model";
import { IpoResearch } from "../src/features/ipo/view";
import { ipoLevel, ipoUrl } from "../src/features/ipo/state";
import { buildSlice, type Slice } from "../src/data/synthetic/build";
import { ipoFixture } from "./ipo-fixture";
import { D } from "../src/domain/research/metrics";
import { unavailable } from "../src/domain/research/types";
import { ContextHelp } from "../src/components/context-help";
let slice: Slice;
beforeAll(() => { slice = buildSlice(); });
beforeEach(() => vi.clearAllMocks());
describe("IPO read model", () => {
    it.each([0, 1, 2, 3])("reads canonical offer %i with identical stored assessments, scenarios and dated terms", async index => {
        const record = ipoFixture(slice, index); vi.mocked(readIpo).mockResolvedValue(record);
        const result = await getIpoResearch(record.offer.slug);
        expect(result.status).toBe("available");
        if (result.status !== "available") throw new Error("Expected offer");
        expect(result.data.snapshot?.output).toEqual(record.snapshot!.output);
        expect(result.data.scenarios).toEqual(record.snapshot!.scenarios);
        expect(result.data.terms?.status).toBe(["Upcoming", "Open", "Closed", "Listed"][index]);
        expect(result.data.offer.opensAt).toBe(slice.offers[index].opensAt);
        expect(result.data.peers.filter(p => p.eligible).length).toBeGreaterThanOrEqual(2);
        expect(result.data.researchSources.every(s => Date.parse(s.publishedAt) <= Date.parse(record.snapshot!.cutoff))).toBe(true);
    });
    it("reconciles company funding, owner proceeds, expenses and allocation using one price basis", () => {
        for (let index = 0; index < 4; index++) {
            const m = buildIpo(ipoFixture(slice, index)), t = m.terms!;
            expect(new D(t.grossFresh).plus(t.ofsProceeds).eq(t.issueTotal)).toBe(true);
            expect(new D(t.grossFresh).minus(m.offer.expenses).eq(t.netFresh)).toBe(true);
            expect(m.proceeds.reduce((sum, p) => sum.plus(p.amount!), new D(0)).eq(t.netFresh)).toBe(true);
            expect(new D(t.reference).times(m.offer.lot).eq(t.minimumApplication)).toBe(true);
            expect(m.holders.reduce((sum, h) => sum.plus(h.computed!.afterShares), new D(0)).eq(t.postShares)).toBe(true);
            expect(m.holders.reduce((sum, h) => sum.plus(h.sold), new D(0)).eq(m.offer.ofsShares)).toBe(true);
        }
    });
    it("keeps Upcoming demand unavailable and resolves all categories at one published observation", () => {
        expect(buildIpo(ipoFixture(slice, 0)).categories.every(c => c.multiple === null)).toBe(true);
        const m = buildIpo(ipoFixture(slice, 1));
        expect(m.categories.map(c => c.multiple)).toEqual(["1.400000000000", "0.800000000000", "1.100000000000"]);
        expect(m.categories.every(c => c.observation?.observedAt === m.terms?.demandObservedAt)).toBe(true);
    });
    it("keeps Meruvan’s issuer and pre-listing evaluation separate from current Stock research", () => {
        const m = buildIpo(ipoFixture(slice, 3));
        expect(m.listing?.issuerId).toBe(m.issuer.id);
        expect(m.snapshot!.output.picture.value).toBeNull();
        expect(Date.parse(m.snapshot!.cutoff)).toBeLessThan(Date.parse(m.offer.actualListing!));
        expect(m.snapshot!.output.reference).toBe("120.00");
        expect(m.snapshot!.output.confidence.reasons).toContain("FULL_REPORT_COVERAGE");
    });
    it("does not fabricate missing ownership, proceeds, sources or snapshot output", () => {
        const r = ipoFixture(slice, 0), m = buildIpo({ ...r, holders: [], proceeds: [], sources: [], snapshot: null, assumption: null });
        expect(m.terms).toBeNull(); expect(m.holders).toEqual([]); expect(m.proceeds).toEqual([]);
        expect(m.scenarios).toBeNull(); expect(m.researchSources).toEqual([]);
        const html = renderToStaticMarkup(<IpoResearch data={m} level="pro"/>);
        expect(html).toContain("Ownership unavailable"); expect(html).toContain("Research snapshot unavailable"); expect(html).toContain("Scenarios unavailable");
    });
    it("filters future demand evidence and rejects mismatched scenario assumptions", () => {
        const r = ipoFixture(slice, 1), m = buildIpo({ ...r, sources: r.sources.map(s => s.id === r.offer.lifecycleId ? { ...s, publishedAt: "2027-01-01T00:00:00Z" } : s), assumption: { ...r.assumption!, method: "different-method" } });
        expect(m.categories.every(c => c.multiple === null)).toBe(true); expect(m.scenarios).toBeNull();
    });
    it("unknown and malformed slugs are not-found, while DB errors stay sanitized", async () => {
        vi.mocked(readIpo).mockResolvedValue(null); expect((await getIpoResearch("unknown-ipo")).status).toBe("not-found");
        vi.clearAllMocks(); expect((await getIpoResearch("'; select")).status).toBe("not-found"); expect(readIpo).not.toHaveBeenCalled();
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(readIpo).mockRejectedValue(new Error("private-credential"));
        expect(await getIpoResearch("elarven-workflow-ipo")).toEqual({ status: "data-unavailable" });
        expect(JSON.stringify(log.mock.calls)).not.toContain("private-credential"); log.mockRestore();
    });
});
describe("IPO presentation contract", () => {
    it("owns only canonical level state and strips ambiguous values", () => {
        expect(ipoLevel({ level: ["normal", "pro"] })).toBe("simple");
        expect(ipoLevel({ level: "other" })).toBe("simple");
        expect(ipoUrl("elarven-workflow-ipo", "pro")).toBe("/ipos/elarven-workflow-ipo?level=pro");
    });
    it("keeps findings, missingness and sources consistent across levels without forbidden actions", () => {
        const m = buildIpo(ipoFixture(slice, 0));
        for (const level of ["simple", "normal", "pro"] as const) {
            const html = renderToStaticMarkup(<IpoResearch data={m} level={level}/>);
            for (const marker of [m.issuer.name, "60-Second Overview", "Research Picture", "What Looks Good", "Needs Attention", "Fresh Issue", "Use of Proceeds", "Who is selling?", "Who wants shares?", "Price vs Value", "Listing Scenarios", "Demand observation unavailable", "Browse all IPO sources"]) expect(html).toContain(marker);
            for (const f of m.findings) expect(html).toContain(f.meaning);
            expect(html).not.toMatch(/href="#"|Apply Now|Invest Now|Subscribe Now|Watch IPO|Thinking of Applying|AI Score|Profit Probability/);
            expect(html).toContain(`href="/ipos${level === "simple" ? "" : `?level=${level}`}"`);
        }
    });
    it("retains unavailable valuation and scenario reasons rather than a favorable replacement", () => {
        const r = ipoFixture(slice, 0);
        r.snapshot = { ...r.snapshot!, output: { ...r.snapshot!.output, valuation: unavailable("NO_COMPATIBLE_PEERS"), pe: unavailable("NO_COMPATIBLE_PEERS"), peerMedian: unavailable("NO_COMPATIBLE_PEERS") }, scenarios: unavailable("VALUATION_PREREQUISITES_UNAVAILABLE") };
        const html = renderToStaticMarkup(<IpoResearch data={buildIpo(r)} level="pro"/>);
        expect(html).toContain("relative valuation conclusion is unavailable"); expect(html).toContain("Scenarios unavailable");
    });
    it("exposes named help, expanded state, a nonmodal popover and separate native mobile dialog", () => {
        const html = renderToStaticMarkup(<ContextHelp topic="confidence"/>);
        expect(html).toContain('aria-label="About Evidence Confidence"'); expect(html).toContain('aria-expanded="false"');
        expect(html).toContain('popover="manual"'); expect(html).toContain("<dialog"); expect(html).not.toContain('aria-modal="true"');
        expect(html).toContain("Source readability and reproducibility"); expect(html).toContain("Got it");
    });
});
