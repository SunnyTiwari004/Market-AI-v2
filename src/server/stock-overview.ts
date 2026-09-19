import "server-only";
import { readStock } from "./stock-repository";
import { whatChanged } from "../domain/research/changes";
import { D } from "../domain/research/metrics";
import { CUTOFFS } from "../domain/research/calendar";
import { HORIZONS, type Horizon } from "../domain/research/types";
export function stockContext(cutoff: unknown, horizon: unknown) {
    return { cutoff: typeof cutoff === "string" && CUTOFFS.some(c => c === cutoff) ? cutoff : CUTOFFS[2], horizon: typeof horizon === "string" && HORIZONS.some(h => h === horizon) ? horizon as Horizon : "long" as Horizon };
}
export async function getStockOverview(symbol: string, cutoff?: unknown, horizon?: unknown) {
    if (!/^[a-zA-Z]{3,8}$/.test(symbol))
        return { status: "not-found" as const };
    const context = stockContext(cutoff, horizon);
    try {
        const data = await readStock(symbol, ...[context.cutoff, context.horizon] as const);
        if (!data)
            return { status: "not-found" as const };
        if (!data.snapshot)
            return { status: "research-unavailable" as const, issuer: data.issuer, context };
        const daily = data.quote && data.previousQuote ? new D(data.quote.close).div(data.previousQuote.close).minus(1).times(100).toFixed(12) : null;
        return { status: "available" as const, ...data, context, daily, changes: whatChanged(data.previous, data.snapshot) };
    }
    catch {
        // Driver errors can contain credentials, hostnames and SQL: do not log them.
        console.error("Stock overview read failed", { operation: "stock-overview", code: "DATA_UNAVAILABLE" });
        return { status: "data-unavailable" as const, context };
    }
}
