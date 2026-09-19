import { notFound } from "next/navigation";
import { getStockOverview } from "../../../server/stock-overview";
import { StockOverview } from "../../../features/stock/overview";
export const dynamic = "force-dynamic";
export default async function StockPage({ params, searchParams }: {
    params: Promise<{
        symbol: string;
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { symbol } = await params, query = await searchParams;
    const data = await getStockOverview(symbol, query.cutoff, query.horizon);
    if (data.status === "not-found")
        notFound();
    if (data.status === "data-unavailable")
        return <main className="page-container"><p className="brand">MARKET AI</p><p className="disclosure">College Project · Simulated financial data</p><section className="surface"><h1>Research is unavailable</h1><p>The research database could not be reached or is not ready. No replacement financial data is shown.</p><a className="button" href={`/stocks/${symbol.toLowerCase()}?cutoff=${data.context.cutoff}&horizon=${data.context.horizon}`}>Try again</a></section></main>;
    if (data.status === "research-unavailable")
        return <main className="page-container"><p className="disclosure">College Project · Simulated financial data</p><h1>{data.issuer.name}</h1><p>— Research is unavailable for this cutoff and horizon. No older result has been substituted.</p></main>;
    return <StockOverview data={data}/>;
}
