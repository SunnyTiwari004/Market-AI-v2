import { describe, it, expect } from "vitest";
import { D, decimal as d, eps, growth, cagr, earnings, cashConversion, freeCashFlow, interestCoverage, ttm, periodReturn, priceRisk } from "../src/domain/research/metrics";
import { businessHealth, growthPotential, financialHealth, risk, valuation, direction, researchPicture, confidence, scenarios } from "../src/domain/research/assessments";
import { result, unavailable, type Price } from "../src/domain/research/types";
import { sessions, cutoffSession } from "../src/domain/research/calendar";
import { buildSlice } from "../src/data/synthetic/build";
import { validateSlice } from "../src/data/synthetic/validate";
import { whatChanged } from "../src/domain/research/changes";
import { digest } from "../src/data/synthetic/identity";
const slice = buildSlice();
const healthy = { debt: d("50"), equity: d("100"), ebit: d("40"), interest: d("10"), income: d("20"), ocf: d("25"), capex: d("10") };
const n = (value: string) => d(value)!;
describe("exact metrics and earnings", () => {
    it("preserves decimal EPS and ratios", () => { expect(eps(n("1"), n("3"))!.toFixed(12)).toBe("0.333333333333"); expect(growth(n("110"), n("100"))!.toString()).toBe("10"); expect(eps(n("-2"), n("4"))!.toString()).toBe("-0.5"); expect(eps(n("2"), n("0"))).toBeNull(); });
    it.each([['10', '12', 'Increased earnings', '20'], ['-2', '1', 'Turned profitable', null], ['2', '-1', 'Turned loss-making', null], ['-2', '-1', 'Loss narrowed', null], ['-1', '-2', 'Loss widened', null], ['-1', '-1', 'Loss unchanged', null], ['1', '0', 'Earnings fell to break-even', null], ['-1', '0', 'Loss moved to break-even', null], ['0', '0', 'Remained at break-even', null], ['0', '1', 'Turned profitable', null], ['0', '-1', 'Turned loss-making', null]])("EPS %s → %s", (prior, current, state, percent) => { const value = earnings(n(current), n(prior)); expect(value.state).toBe(state); expect(value.growth?.toString() ?? null).toBe(percent); });
    it("cash conversion never divides by loss/zero; missing capex is unavailable", () => { expect(cashConversion(n("-5"), n("10"))!.toString()).toBe("-0.5"); expect(cashConversion(n("5"), n("0"))).toBeNull(); expect(cashConversion(n("5"), n("-1"))).toBeNull(); expect(freeCashFlow(n("10"), null)).toBeNull(); });
    const annual = slice.financials.filter(p => p.issuerId === slice.issuers[0].id && p.basis === "annual");
    it("CAGR uses all three comparable annuals", () => { expect(cagr(annual)!.minus(new D(510).div(378).sqrt().minus(1).times(100)).abs().lte("1e-12")).toBe(true); });
    it.each(["0", "-1"])("CAGR rejects endpoint %s", value => { const rows = structuredClone(annual); rows[0].revenue = value; expect(cagr(rows)).toBeNull(); });
    it("CAGR rejects missing or short fiscal periods", () => { expect(cagr(annual.slice(1))).toBeNull(); expect(cagr(annual.map((p, i) => i ? p : { ...p, start: "2023-05-01" }))).toBeNull(); });
});
describe("pillar boundaries", () => {
    it.each([['10', '100', 'Strong'], ['9.99', '100', 'Mixed'], ['0', '100', 'Weak']])("Business EBIT %s", (ebit, revenue, want) => expect(businessHealth(n(revenue), n(ebit), n("5"), n("5")).value).toBe(want));
    it("known weakness with missing inputs is partial; missing nonweak is unavailable", () => { expect(businessHealth(null, n("0"), n("1"), n("2"))).toMatchObject({ value: "Weak", availability: "partial" }); expect(businessHealth(null, n("2"), n("1"), n("2")).availability).toBe("unavailable"); });
    it("Growth exact thresholds and recovery", () => { expect(growthPotential(n("10"), n("5"), { state: "Unchanged earnings", growth: n("0") }).value).toBe("Strong"); expect(growthPotential(n("9.99"), n("5"), { state: "Unchanged earnings", growth: n("0") }).value).toBe("Mixed"); expect(growthPotential(n("20"), n("10"), earnings(n("2"), n("-1"))).value).toBe("Mixed"); expect(growthPotential(n("-1"), null, { state: "Unavailable", growth: null })).toMatchObject({ value: "Weak", availability: "partial" }); });
    it.each([['50', 'Strong'], ['50.01', 'Mixed'], ['150', 'Mixed'], ['150.01', 'Weak']])("Financial debt %s", (debt, want) => expect(financialHealth({ ...healthy, debt: n(debt) }).value).toBe(want));
    it("zero-debt exception, missing capex, negative equity and OCF", () => { expect(interestCoverage(n("1"), n("0"), n("0")).availability).toBe("not-applicable"); expect(financialHealth({ ...healthy, debt: n("0"), interest: n("0") }).value).toBe("Strong"); expect(financialHealth({ ...healthy, capex: null }).availability).toBe("unavailable"); expect(financialHealth({ ...healthy, equity: n("0") }).value).toBe("Weak"); expect(financialHealth({ ...healthy, ocf: n("-1") }).value).toBe("Weak"); expect(financialHealth({ ...healthy, interest: n("0") }).availability).toBe("unavailable"); });
});
describe("Risk", () => {
    it.each([['1.499', '10', 'Low'], ['1.5', '10', 'Low'], ['1.501', '10', 'Medium'], ['3', '20', 'Medium'], ['3.001', '10', 'High'], ['1', '20.001', 'High'], ['1', '10.001', 'Medium']])("volatility %s / drawdown %s", (vol, dd, want) => expect(risk(healthy, n(vol), n(dd)).value).toBe(want));
    it("missing nonhigh and partial High are distinct", () => { expect(risk(healthy, null, null).availability).toBe("unavailable"); expect(risk({ ...healthy, income: n("0") }, null, null)).toMatchObject({ value: "High", availability: "partial" }); expect(risk({ ...healthy, ocf: n("0") }, n("1"), n("5")).value).toBe("Medium"); });
    it("uses 60 percent returns, sample divisor 59 and positive drawdown", () => { let value = new D(100); const dates = sessions("2026-01-01", "2026-05-01").slice(0, 61); const prices: Price[] = dates.map((date, i) => { if (i)
        value = value.times(i % 2 ? "1.01" : "0.99"); return { id: date, listingId: "x", date, close: value.toString() }; }); const calc = priceRisk(prices, dates[60]); expect(calc.volatility!.minus(new D(60).div(59).sqrt()).abs().lt("1e-12")).toBe(true); expect(calc.drawdown!.gt(0)).toBe(true); expect(priceRisk(prices.slice(1), dates[60]).volatility).toBeNull(); });
});
describe("Direction and calendar", () => {
    it.each([['5.001', 'Up'], ['5', 'Flat'], ['0', 'Flat'], ['-5', 'Flat'], ['-5.001', 'Down']])("return %s", (value, want) => expect(direction(n(value)).value).toBe(want));
    it("weekend/intraday cutoff mapping", () => { expect(cutoffSession("2026-08-01")).toBe("2026-07-31"); expect(cutoffSession("2026-08-31T10:00:00+05:30")).toBe("2026-08-28"); expect(cutoffSession("2026-08-31")).toBe("2026-08-31"); });
    it("requires n+1 scheduled closes without skipping gaps", () => { const dates = sessions("2026-07-01", "2026-07-31").slice(0, 21), prices = dates.map((date, i) => ({ id: date, listingId: "x", date, close: i === 20 ? "105" : "100" })); expect(periodReturn(prices, dates[20], 20)!.toString()).toBe("5"); expect(periodReturn(prices.slice(1), dates[20], 20)).toBeNull(); expect(periodReturn(prices.filter((_, i) => i !== 10), dates[20], 20)).toBeNull(); });
});
describe("TTM and relative valuation", () => {
    const periods = slice.financials.filter(p => p.issuerId === slice.issuers[0].id);
    it("selects published quarters only, with exact TTM EPS", () => { const t = ttm(periods, "2026-08-01"); expect(t.eps!.toString()).toBe("7.14"); expect(t.periods.at(-1)!.end).toBe("2026-03-31"); expect(ttm(periods, "2026-08-31").periods.at(-1)!.end).toBe("2026-06-30"); });
    it("rejects stale and nonconsecutive windows", () => { expect(ttm(periods, "2028-01-01").eps).toBeNull(); expect(ttm(periods.filter(p => p.end !== "2025-12-31"), "2026-08-01").eps).toBeNull(); });
    const base = { id: "subject", sectorId: "s", eps: n("1"), close: n("1"), window: "same", session: "2026-09-30", listed: true }, peers = [{ ...base, id: "p1", close: n("10") }, { ...base, id: "p2", close: n("30") }];
    it.each([['16.99', 'Attractive'], ['17', 'In line'], ['23', 'In line'], ['23.01', 'Expensive']])("price %s against median 20", (close, want) => { const v = valuation({ ...base, close: n(close) }, peers); expect(v.median!.toString()).toBe("20"); expect(v.assessment.value).toBe(want); });
    it.each(['0', '-1'])("nonpositive EPS %s", eps => expect(valuation({ ...base, eps: n(eps) }, peers).assessment.availability).toBe("unavailable"));
    it("one peer and mismatched TTM never fall back", () => { expect(valuation(base, [peers[0], peers[0]]).assessment.availability).toBe("unavailable"); expect(valuation(base, peers.slice(1)).assessment.availability).toBe("unavailable"); expect(valuation(base, [peers[0], { ...peers[1], window: "other" }]).assessment.availability).toBe("unavailable"); });
});
describe("Research Picture", () => {
    it("Strong then one/two weak pillars", () => { expect(researchPicture("long", result("Strong"), result("Strong"), result("Strong"), result("Low"), unavailable("short history"), result("In line")).value).toBe("Strong"); expect(researchPicture("long", result("Weak"), result("Strong"), result("Strong"), result("Low"), result("Up"), result("In line")).value).toBe("Mixed"); expect(researchPicture("long", result("Weak"), result("Weak"), result("Strong"), result("Low"), result("Up"), result("In line")).value).toBe("Weak"); });
    it("High risk, adverse modifier and incomplete precedence", () => { expect(researchPicture("short", result("Strong"), result("Strong"), result("Strong"), result("High"), result("Up"), unavailable("not required")).value).toBe("Weak"); expect(researchPicture("medium", result("Strong"), result("Strong"), result("Strong"), result("Low"), result("Down"), result("In line")).value).toBe("Mixed"); expect(researchPicture("long", result("Strong"), result("Strong"), result("Strong"), result("Low"), result("Up"), result("Expensive")).value).toBe("Mixed"); expect(researchPicture("short", result("Strong"), result("Strong"), result("Strong"), { value: "High", availability: "partial", reasons: ["missing"] }, result("Up"), result("In line")).availability).toBe("unavailable"); });
});
describe("confidence and scenarios", () => {
    it("calculates coverage independently of financial outcomes", () => { expect(confidence([true, true, true, true, true], true).value).toBe("High"); expect(confidence([true, false, true, true, true], true).value).toBe("Medium"); expect(confidence([true, false, false, true, true], true).value).toBe("Low"); expect(confidence([false, false, false, false, false], false).availability).toBe("unavailable"); });
    const assumption = structuredClone(slice.assumptions[0]), context = { listingId: assumption.listingId, cutoff: assumption.cutoff, dataset: assumption.dataset, method: assumption.method };
    it("uses exact common scenario formula", () => { const out = scenarios(assumption, context, n("2"), n("10"), n("25"), 2); expect(out.value![1]).toEqual({ label: "Base", price: "20.000000000000", change: "-20.000000000000" }); });
    it.each([['g', '-1'], ['m', '0']])("invalid %s", (field, value) => { const a = structuredClone(assumption); a.cases[0][field as "g" | "m"] = value; expect(scenarios(a, context, n("2"), n("10"), n("25"), 2).availability).toBe("unavailable"); });
    it("rejects missing peers, mismatched versions and reversed cases", () => { expect(scenarios(assumption, context, n("2"), null, n("25"), 1).availability).toBe("unavailable"); expect(scenarios(assumption, { ...context, method: "other" }, n("2"), n("10"), n("25"), 2).availability).toBe("unavailable"); const a = structuredClone(assumption); a.cases[0].m = "100"; expect(scenarios(a, context, n("2"), n("10"), n("25"), 2).reasons).toContain("SCENARIO_ORDER_VIOLATION"); });
});
describe("seed integrity and What Changed", () => {
    it("rejects a changed content digest",()=>{expect(()=>validateSlice({...slice,digest:"invalid"})).toThrow("digest mismatch");});
    it("validates full slice and reproduces exact digest", () => { expect(validateSlice(slice).snapshots).toBe(108); expect(buildSlice().digest).toBe(slice.digest); });
    it.each(["snapshot", "price", "version", "source", "cash"])("rejects corrupted %s", kind => { const s = structuredClone(slice); if (kind === "snapshot")
        s.snapshots.pop(); if (kind === "price")
        s.prices.splice(20, 1); if (kind === "version")
        s.snapshots[0].method = "wrong"; if (kind === "source")
        s.snapshots[0].evidenceIds.push("unknown"); if (kind === "cash")
        s.financials[0].closingCash = "1"; const {version,method,generator,seed,profile,digest:oldDigest,...content}=s;
        void [version,method,generator,seed,profile,oldDigest]; s.digest=digest(content);
        expect(() => validateSlice(s)).toThrow(); });
    it("compares compatible snapshots and rejects changed method", () => { const first = slice.snapshots[0], next = slice.snapshots.find(s => s.listingId === first.listingId && s.horizon === first.horizon && s.cutoff === "2026-08-31")!; expect(whatChanged(first, next).availability).toBe("available"); expect(whatChanged({ ...first, method: "other" }, next).availability).toBe("unavailable"); expect(whatChanged(null, first).reasons).toContain("NO_PRIOR_SNAPSHOT"); });
    it("all horizons share one scenario owner per cutoff", () => { for (const listing of slice.listings)
        for (const cutoff of ["2026-08-01", "2026-08-31", "2026-09-30"]) {
            const snapshots = slice.snapshots.filter(s => s.listingId === listing.id && s.cutoff === cutoff);
            expect(snapshots).toHaveLength(3);
            expect(new Set(snapshots.map(s => s.scenarioId)).size).toBe(1);
        } });
});
