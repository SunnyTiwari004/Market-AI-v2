import { notFound } from "next/navigation";
import { getStockOverview } from "../../../server/stock-overview";
import { StockOverview } from "../../../features/stock/overview";
import { StockShell } from "../../../features/stock/shell";
import { StockView } from "../../../features/stock/views";
import { stockState, stockUrl } from "../../../features/stock/state";
import { getStockView } from "../../../server/stock-views";
export const dynamic = "force-dynamic";
export default async function StockPage({ params, searchParams }: {
    params: Promise<{
        symbol: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { symbol } = await params, query = await searchParams;
    const state = stockState(query);
    const data = await getStockOverview(symbol, state.cutoff, state.horizon);
    if (data.status === "not-found")
        notFound();
    if (data.status === "data-unavailable")
        return <main id="main-content" className="page-container"><p className="brand">MARKET AI</p><p className="disclosure">College Project · Simulated financial data</p><section className="surface"><h1>Research is unavailable</h1><p>The research database could not be reached or is not ready. No replacement financial data is shown.</p><a className="button" href={stockUrl(symbol, state)}>Try again</a></section></main>;
    if (data.status === "research-unavailable")
        return <main id="main-content" className="page-container"><p className="disclosure">College Project · Simulated financial data</p><h1>{data.issuer.name}</h1><p>— Research is unavailable for this cutoff and horizon. No older result has been substituted.</p></main>;
    const view = await getStockView({ issuerId: data.issuer.id, listingId: data.listing.id, sectorId: data.sector.id }, state);
    if (view.kind === "filings") {
        if (state.type !== "all" && !view.sources.some(s => s.documentType === state.type)) state.type = "all";
        if (state.year !== "all" && !view.sources.some(s => s.publishedAt.startsWith(state.year))) state.year = "all";
    }
    return <StockShell data={data} state={state}>{state.view === "overview" ? <StockOverview data={data} level={state.level}/> : <StockView view={view} data={data} state={state}/>}</StockShell>;
}
