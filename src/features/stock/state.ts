import { CUTOFFS } from "../../domain/research/calendar";
import { HORIZONS } from "../../domain/research/types";

export const VIEWS = ["overview", "financials", "chart", "news", "peers", "filings"] as const;
export const LEVELS = ["simple", "normal", "pro"] as const;
// Bounded calendar ranges within the contract's two-year stored history.
export const RANGES = ["1m", "6m", "1y", "2y"] as const;
export const DOCUMENT_TYPES = ["all", "annual", "quarterly", "announcement", "offer", "lifecycle"] as const;
type Query = Record<string, string | string[] | undefined>;
function option<T extends string>(value: unknown, values: readonly T[], fallback: T): T {
    return typeof value === "string" && values.includes(value as T) ? value as T : fallback;
}
export function stockState(query: Query) {
    return {
        view: option(query.view, VIEWS, "overview"),
        level: option(query.level, LEVELS, "simple"),
        horizon: option(query.horizon, HORIZONS, "long"),
        cutoff: option(query.cutoff, CUTOFFS, CUTOFFS[2]),
        period: option(query.period, ["annual", "quarterly"] as const, "annual"),
        range: option(query.range, RANGES, "1y"),
        type: option(query.type, DOCUMENT_TYPES, "all"),
        year: typeof query.year === "string" && /^20\d{2}$/.test(query.year) ? query.year : "all",
    };
}
export type StockState = ReturnType<typeof stockState>;
export function stockUrl(symbol: string, state: StockState, patch: Partial<StockState> = {}) {
    const s = { ...state, ...patch }, query = new URLSearchParams();
    if (s.level !== "simple") query.set("level", s.level);
    if (s.horizon !== "long") query.set("horizon", s.horizon);
    if (s.cutoff !== CUTOFFS[2]) query.set("cutoff", s.cutoff);
    if (s.view !== "overview") query.set("view", s.view);
    if (s.view === "financials" && s.period !== "annual") query.set("period", s.period);
    if (s.view === "chart" && s.range !== "1y") query.set("range", s.range);
    if (s.view === "filings") {
        if (s.type !== "all") query.set("type", s.type);
        if (s.year !== "all") query.set("year", s.year);
    }
    return `/stocks/${symbol.toLowerCase()}${query.size ? `?${query}` : ""}`;
}
