import { decimal, freeCashFlow, margin, D, periodReturn } from "../../domain/research/metrics";
import type { FinancialRecord, readSectorPeers } from "../../server/stock-view-repository";
import type { Evidence, Price } from "../../domain/research/types";
import type { StockState } from "./state";

export const STATEMENTS = [
    { title: "Income Statement", rows: [
        ["revenue", "Revenue", "Money earned from operations", "INR million"],
        ["ebit", "Operating profit (EBIT)", "Profit before interest and tax", "INR million"],
        ["margin", "Operating margin", "Operating profit for each 100 of revenue", "%"],
        ["income", "Ordinary net income", "Profit or loss after costs", "INR million"],
        ["interest", "Interest expense", "Cost of borrowing", "INR million"],
        ["weightedShares", "Weighted ordinary shares", "Average shares during the period", "million shares"],
    ] },
    { title: "Balance Sheet", rows: [
        ["assets", "Assets", "Resources owned by the business", "INR million"],
        ["liabilities", "Liabilities", "Amounts the business owes", "INR million"],
        ["equity", "Ordinary equity", "Assets less liabilities", "INR million"],
        ["debt", "Interest-bearing debt", "Borrowings carrying interest", "INR million"],
        ["cash", "Cash", "Cash at the period end", "INR million"],
        ["shares", "Ordinary shares", "Shares at the period end", "million shares"],
    ] },
    { title: "Cash Flow", rows: [
        ["ocf", "Operating cash flow", "Cash generated or used by operations", "INR million"],
        ["capex", "Capital expenditure", "Cash spent on long-lived assets", "INR million"],
        ["fcf", "Free cash flow", "Operating cash remaining after capital expenditure", "INR million"],
        ["investing", "Investing cash flow", "Cash from or used in investments", "INR million"],
        ["financing", "Financing cash flow", "Cash from or returned to capital providers", "INR million"],
        ["openingCash", "Opening cash", "Cash at the start of the period", "INR million"],
        ["closingCash", "Closing cash", "Cash at the end of the period", "INR million"],
    ] },
] as const;
export type FinancialKey = typeof STATEMENTS[number]["rows"][number][0];
export function financialValue(record: FinancialRecord, key: FinancialKey): string | null {
    const values = { ...record.income, ...record.balance, ...record.cashflow };
    if (key === "margin") return margin(decimal(record.income?.ebit), decimal(record.income?.revenue))?.toFixed(12) ?? null;
    if (key === "fcf") return freeCashFlow(decimal(record.cashflow?.ocf), decimal(record.cashflow?.capex))?.toFixed(12) ?? null;
    return values[key] ?? null;
}
export function financialChanges(records: FinancialRecord[], basis: StockState["period"]) {
    const periods = records.filter(r => r.period.basis === basis).sort((a, b) => b.period.end.localeCompare(a.period.end));
    const current = periods[0];
    const prior = current && periods.find(r => Number(r.period.end.slice(0, 4)) === Number(current.period.end.slice(0, 4)) - 1 && r.period.end.slice(4) === current.period.end.slice(4));
    if (!current || !prior || current.period.scope !== prior.period.scope || current.period.currency !== prior.period.currency) return null;
    return { current, prior, changes: (["revenue", "margin", "ocf", "debt"] as const).map(key => {
        const a = decimal(financialValue(current, key)), b = decimal(financialValue(prior, key));
        return { key, direction: a === null || b === null ? "unavailable" : a.eq(b) ? "unchanged" : a.gt(b) ? "higher" : "lower", delta: a !== null && b !== null ? a.minus(b).toFixed(12) : null };
    }) };
}
export function displayFinancial(value: string | null, unit: string) {
    if (value === null) return null;
    const d = new D(value);
    return (unit.includes("million") ? d.div(1_000_000) : d).toFixed(2);
}
export function chartHistory(prices: Price[], cutoff: string, range: StockState["range"]) {
    const date = new Date(`${cutoff}T00:00:00Z`), months = { "1m": 1, "6m": 6, "1y": 12, "2y": 24 }[range];
    // Clamp month ends instead of overflowing February into March.
    const day = date.getUTCDate(); date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() - months);
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, last));
    const start = date.toISOString().slice(0, 10);
    const points = prices.filter(p => p.date >= start && p.date <= cutoff).sort((a, b) => a.date.localeCompare(b.date));
    return { start, points, change: points.length > 1 ? periodReturn(points, cutoff, points.length - 1)?.toFixed(12) ?? null : null };
}
export function filterDocuments(sources: Evidence[], state: StockState) {
    return sources.filter(s => s.kind === "document" && (state.type === "all" || s.documentType === state.type) && (state.year === "all" || s.publishedAt.startsWith(state.year)));
}
export type PeerRecord = Awaited<ReturnType<typeof readSectorPeers>>[number];
export const PEER_METRICS = ["revenueGrowth", "margin", "debtEquity", "fcf", "ttmEps", "pe"] as const;
export function peerMetric(peer: PeerRecord, subject: PeerRecord, key: typeof PEER_METRICS[number]) {
    const a = peer.research?.output, b = subject.research?.output;
    const trailing = key === "pe" || key === "ttmEps";
    if (!a || !b || !a.basis || a.basis !== b.basis || peer.research?.method !== subject.research?.method ||
        !(trailing ? a.ttmEnd && a.ttmEnd === b.ttmEnd : a.annualEnd && a.annualEnd === b.annualEnd))
        return { value: null, reason: "Comparable reporting period or research is unavailable." };
    const metric = a.metrics[key];
    return { value: metric.value, reason: metric.reasons.join(", ").replaceAll("_", " ").toLowerCase() };
}
