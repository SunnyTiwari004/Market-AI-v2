import type Decimal from "decimal.js";
import { D, decimal, type Numeric, margin, cashConversion, freeCashFlow, debtEquity, interestCoverage } from "./metrics";
import { result, unavailable, type Result, type Pillar, type Risk, type Direction, type ValuePosition, type Horizon, type Assumption, type ScenarioOutput } from "./types";
function assessment<T>(weak: boolean, incomplete: boolean, strong: boolean, labels: [
    T,
    T,
    T
]): Result<T> {
    if (weak)
        return { value: labels[2], availability: incomplete ? "partial" : "available", reasons: incomplete ? ["INCOMPLETE_COVERAGE"] : [] };
    return incomplete ? unavailable("MISSING_REQUIRED_INPUT") : result(strong ? labels[0] : labels[1]);
}
const pillars: [
    Pillar,
    Pillar,
    Pillar
] = ["Strong", "Mixed", "Weak"];
export function businessHealth(revenue: Numeric, ebit: Numeric, income: Numeric, ocf: Numeric): Result<Pillar> {
    const om = margin(ebit, revenue), cc = cashConversion(ocf, income);
    const weak = !!(ebit?.lte(0) || income?.lte(0) || ocf?.lt(0));
    return assessment(weak, [revenue, ebit, income, ocf].some(x => x === null) || (!weak && (om === null || cc === null)), !!(om?.gte(10) && income?.gt(0) && cc?.gte(1)), pillars);
}
export function growthPotential(revenueGrowth: Numeric, cagr: Numeric, progression: {
    state: string;
    growth: Numeric;
}): Result<Pillar> {
    const weak = !!(revenueGrowth?.lt(0) || cagr?.lt(0) || progression.growth?.lt(0) || ["Turned loss-making", "Loss widened", "Earnings fell to break-even"].includes(progression.state));
    return assessment(weak, revenueGrowth === null || cagr === null || progression.state === "Unavailable", !!(revenueGrowth?.gte(10) && cagr?.gte(5) && progression.growth?.gte(0)), pillars);
}
export interface FinancialInputs {
    debt: Numeric;
    equity: Numeric;
    ebit: Numeric;
    interest: Numeric;
    income: Numeric;
    ocf: Numeric;
    capex: Numeric;
}
export function financialHealth(x: FinancialInputs): Result<Pillar> {
    const de = debtEquity(x.debt, x.equity), ic = interestCoverage(x.ebit, x.interest, x.debt), fcf = freeCashFlow(x.ocf, x.capex);
    return assessment(!!(x.equity?.lte(0) || de?.gt("1.5") || ic.value?.lt(1) || x.ocf?.lt(0)), [x.debt, x.equity, x.ebit, x.interest, x.ocf, x.capex].some(v => v === null) || ic.availability === "unavailable", !!(de?.lte("0.5") && (ic.value?.gte(4) || ic.availability === "not-applicable") && x.ocf?.gt(0) && fcf?.gte(0)), pillars);
}
export function risk(x: FinancialInputs, volatility: Numeric, drawdown: Numeric): Result<Risk> {
    const de = debtEquity(x.debt, x.equity), ic = interestCoverage(x.ebit, x.interest, x.debt);
    const high = !!(x.equity?.lte(0) || de?.gt("1.5") || ic.value?.lt(1) || x.income?.lte(0) || x.ocf?.lt(0) || volatility?.gt(3) || drawdown?.gt(20));
    const missing = [x.debt, x.equity, x.ebit, x.interest, x.income, x.ocf, volatility, drawdown].some(v => v === null) || ic.availability === "unavailable";
    return assessment(high, missing, !!(de?.lte("0.5") && (ic.value?.gte(4) || ic.availability === "not-applicable") && x.income?.gt(0) && x.ocf?.gt(0) && volatility?.lte("1.5") && drawdown?.lte(10)), ["Low", "Medium", "High"]);
}
export function direction(change: Numeric): Result<Direction> { return change === null ? unavailable("INSUFFICIENT_OR_GAPPED_PRICE_WINDOW") : result(change.gt(5) ? "Up" : change.lt(-5) ? "Down" : "Flat"); }
export interface ValuationInput {
    id: string;
    sectorId: string;
    eps: Numeric;
    close: Numeric;
    window: string | null;
    session: string;
    listed: boolean;
}
export function valuation(subject: ValuationInput, peers: ValuationInput[]) {
    const candidates = [...new Map(peers.filter(p => p.id !== subject.id && p.sectorId === subject.sectorId && p.listed).map(p => [p.id, p])).values()];
    const eligible = candidates.filter(p => p.eps?.gt(0) && p.close?.gt(0) && p.window !== null && p.window === subject.window && p.session === subject.session);
    const exclusions = candidates.filter(p => !eligible.includes(p)).map(p => ({ id: p.id, reason: "NONPOSITIVE_STALE_OR_INCOMPARABLE" }));
    if (!subject.listed || !subject.eps?.gt(0) || !subject.close?.gt(0) || !subject.window || eligible.length < 2)
        return { assessment: unavailable<ValuePosition>("NONPOSITIVE_EPS_OR_INSUFFICIENT_COMPATIBLE_PEERS"), pe: null, median: null, ratio: null, eligible: eligible.map(p => p.id), exclusions };
    const values = eligible.map(p => p.close!.div(p.eps!)).sort((a, b) => a.cmp(b)), middle = Math.floor(values.length / 2);
    const median = values.length % 2 ? values[middle] : values[middle - 1].plus(values[middle]).div(2), pe = subject.close.div(subject.eps), relative = pe.div(median);
    return { assessment: result<ValuePosition>(relative.lt("0.85") ? "Attractive" : relative.gt("1.15") ? "Expensive" : "In line"), pe, median, ratio: relative, eligible: eligible.map(p => p.id), exclusions };
}
export function researchPicture(horizon: Horizon, business: Result<Pillar>, growth: Result<Pillar>, financial: Result<Pillar>, risk: Result<Risk>, direction: Result<Direction>, valuation: Result<ValuePosition>): Result<Pillar> {
    const required = [business, growth, financial, risk, ...(horizon !== "long" ? [direction] : []), ...(horizon !== "short" ? [valuation] : [])];
    if (required.some(r => r.availability !== "available" || r.value === null))
        return unavailable("REQUIRED_COMPONENT_INCOMPLETE");
    const ps = [business.value, growth.value, financial.value];
    if (risk.value === "High" || ps.filter(v => v === "Weak").length >= 2)
        return result("Weak");
    return result(ps.every(v => v === "Strong") && risk.value === "Low" && (horizon === "long" || direction.value !== "Down") && (horizon === "short" || valuation.value !== "Expensive") ? "Strong" : "Mixed");
}
export function confidence(checks: [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
], nonempty: boolean): Result<Risk> {
    if (!nonempty)
        return unavailable("NO_EVIDENCE");
    const labels = ["FINDING_PROVENANCE", "FULL_REPORT_COVERAGE", "RECENCY", "PRICE_COVERAGE", "READABLE_SOURCES"];
    return { value: checks.every(Boolean) ? "High" : checks[0] && checks[2] && [checks[1], checks[3], checks[4]].filter(Boolean).length >= 2 ? "Medium" : "Low", availability: "available", reasons: labels.filter((_, i) => !checks[i]) };
}
export function scenarios(a: Assumption, context: {
    listingId: string;
    cutoff: string;
    dataset: string;
    method: string;
}, eps: Numeric, median: Numeric, close: Numeric, peerCount: number): Result<ScenarioOutput[]> {
    if (a.listingId !== context.listingId || a.cutoff !== context.cutoff || a.dataset !== context.dataset || a.method !== context.method || a.days !== 30)
        return unavailable("ASSUMPTION_CONTEXT_MISMATCH");
    return scenarioValues(a.cases, eps, median, close, peerCount);
}
// Common formula, with Stock/IPO identity and window checked by their callers.
export function scenarioValues(cases: Assumption["cases"], eps: Numeric, median: Numeric, close: Numeric, peerCount: number): Result<ScenarioOutput[]> {
    if (cases.length !== 3 || cases.some((c, i) => c.label !== ["Weak", "Base", "Strong"][i] || !c.rationale.trim() || !decimal(c.g)?.gt(-1) || !decimal(c.m)?.gt(0)))
        return unavailable("INVALID_ASSUMPTIONS");
    if (!eps?.gt(0) || !median?.gt(0) || !close?.gt(0) || peerCount < 2)
        return unavailable("VALUATION_PREREQUISITES_UNAVAILABLE");
    const values = cases.map(c => eps.times(new D(1).plus(c.g)).times(median).times(c.m));
    if (values[0].gt(values[1]) || values[1].gt(values[2]))
        return unavailable("SCENARIO_ORDER_VIOLATION");
    return result(values.map((v, i) => ({ label: cases[i].label, price: v.toFixed(12), change: v.div(close).minus(1).times(100).toFixed(12) })));
}
export function serializedCoverage(r: Result<Decimal>): Result<string> { return { ...r, value: r.value?.toFixed(12) ?? null }; }
