import Decimal from "decimal.js";
import { addDays, daysBetween, fullPeriod, sessions, cutoffSession, timestamp } from "./calendar";
import type { Financial, Price, Result } from "./types";
import { result, unavailable } from "./types";
export const D = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP });
export type Numeric = Decimal | null;
export const decimal = (value: string | null | undefined): Numeric => {
    if (value == null)
        return null;
    try {
        const d = new D(value);
        return d.isFinite() ? d : null;
    }
    catch {
        return null;
    }
};
export const serialize = (n: Numeric, reason = "MISSING_OR_INVALID_INPUT"): Result<string> => n === null ? unavailable(reason) : result(n.toFixed(12));
export const ratio = (a: Numeric, b: Numeric): Numeric => a !== null && b !== null && b.gt(0) ? a.div(b) : null;
export const growth = (current: Numeric, prior: Numeric): Numeric => current !== null && current.gte(0) && prior !== null && prior.gt(0) ? current.div(prior).minus(1).times(100) : null;
export const eps = (income: Numeric, shares: Numeric) => ratio(income, shares);
export const margin = (ebit: Numeric, revenue: Numeric) => ratio(ebit, revenue)?.times(100) ?? null;
export const cashConversion = (ocf: Numeric, income: Numeric) => ratio(ocf, income);
export const freeCashFlow = (ocf: Numeric, capex: Numeric): Numeric => ocf !== null && capex !== null && capex.gte(0) ? ocf.minus(capex) : null;
export const debtEquity = (debt: Numeric, equity: Numeric) => debt !== null && debt.gte(0) ? ratio(debt, equity) : null;
export function interestCoverage(ebit: Numeric, interest: Numeric, debt: Numeric): Result<Decimal> {
    if (interest?.eq(0) && debt?.eq(0))
        return { value: null, availability: "not-applicable", reasons: ["NO_INTEREST_BURDEN"] };
    const v = ratio(ebit, interest);
    return v === null ? unavailable("INTEREST_INPUT_UNAVAILABLE") : result(v);
}
export function earnings(current: Numeric, prior: Numeric) {
    if (current === null || prior === null)
        return { state: "Unavailable", growth: null };
    if (current.gt(0) && prior.gt(0))
        return { state: current.gt(prior) ? "Increased earnings" : current.lt(prior) ? "Decreased earnings" : "Unchanged earnings", growth: growth(current, prior) };
    const state = current.gt(0) ? "Turned profitable" : current.lt(0) && prior.gte(0) ? "Turned loss-making" : current.eq(0) ? (prior.gt(0) ? "Earnings fell to break-even" : prior.lt(0) ? "Loss moved to break-even" : "Remained at break-even") : current.gt(prior) ? "Loss narrowed" : current.lt(prior) ? "Loss widened" : "Loss unchanged";
    return { state, growth: null };
}
export function annuals(periods: Financial[], cutoff: string) {
    return periods.filter(p => p.basis === "annual" && Date.parse(p.publishedAt) <= Date.parse(timestamp(cutoff)) && p.end <= cutoff).sort((a, b) => b.end.localeCompare(a.end));
}
export function cagr(periods: Financial[]): Numeric {
    const p = [...periods].sort((a, b) => b.end.localeCompare(a.end)).slice(0, 3);
    if (p.length !== 3 || p.some(x => x.basis !== "annual" || !fullPeriod(x.start, x.end, "annual") || x.currency !== p[0].currency || x.scope !== p[0].scope || x.issuerId !== p[0].issuerId) || addDays(p[2].end, 1) !== p[1].start || addDays(p[1].end, 1) !== p[0].start)
        return null;
    const first = decimal(p[2].revenue), last = decimal(p[0].revenue);
    return first?.gt(0) && last?.gt(0) ? last.div(first).sqrt().minus(1).times(100) : null;
}
export function ttm(periods: Financial[], cutoff: string) {
    const p = periods.filter(x => x.basis === "quarterly" && x.end <= cutoff && Date.parse(x.publishedAt) <= Date.parse(timestamp(cutoff))).sort((a, b) => b.end.localeCompare(a.end)).slice(0, 4).reverse();
    const invalid = p.length !== 4 || p.some((x, i) => !fullPeriod(x.start, x.end, "quarterly") || x.currency !== p[0].currency || x.scope !== p[0].scope || x.issuerId !== p[0].issuerId || (i > 0 && addDays(p[i - 1].end, 1) !== x.start)) || daysBetween(p[3]?.end ?? cutoff, cutoff) > 200;
    if (invalid)
        return { eps: null, key: null, periods: p, reason: "STALE_OR_INCOMPATIBLE_TTM" };
    let income = new D(0), weighted = new D(0), days = 0;
    for (const x of p) {
        const shares = decimal(x.weightedShares), ni = decimal(x.income);
        if (!shares?.gt(0) || ni === null)
            return { eps: null, key: null, periods: p, reason: "INVALID_TTM_INPUT" };
        const n = daysBetween(x.start, x.end) + 1;
        days += n;
        weighted = weighted.plus(shares.times(n));
        income = income.plus(ni);
    }
    return { eps: income.div(weighted.div(days)), key: p.map(x => `${x.start}/${x.end}/${x.currency}/${x.scope}`).join("|"), periods: p, reason: null };
}
export function priceWindow(prices: Price[], cutoff: string, n: number): Price[] | null {
    const end = cutoffSession(cutoff);
    let start = end, count = 0;
    while (count < n) {
        start = addDays(start, -1);
        if (sessions(start, start).length)
            count++;
    }
    const dates = sessions(start, end), values = dates.map(date => prices.filter(p => p.date === date));
    if (values.some(p => p.length !== 1 || !decimal(p[0].close)?.gt(0)))
        return null;
    return values.map(p => p[0]);
}
export function periodReturn(prices: Price[], cutoff: string, n: number): Numeric {
    const window = priceWindow(prices, cutoff, n);
    return window ? new D(window[n].close).div(window[0].close).minus(1).times(100) : null;
}
export function priceRisk(prices: Price[], cutoff: string) {
    const window = priceWindow(prices, cutoff, 60);
    if (!window)
        return { volatility: null, drawdown: null };
    const values = window.map(p => new D(p.close)), returns = values.slice(1).map((p, i) => p.div(values[i]).minus(1).times(100));
    const mean = returns.reduce((s, x) => s.plus(x), new D(0)).div(60);
    const volatility = returns.reduce((s, x) => s.plus(x.minus(mean).pow(2)), new D(0)).div(59).sqrt();
    let peak = values[0], drawdown = new D(0);
    for (const price of values) {
        peak = D.max(peak, price);
        drawdown = D.max(drawdown, new D(1).minus(price.div(peak)).times(100));
    }
    return { volatility, drawdown };
}
