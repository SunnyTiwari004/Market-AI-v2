import Link from "next/link";
import type { ReactNode } from "react";
import type { getStockOverview } from "../../server/stock-overview";
import { money, number, statusTone } from "./format";
import { StockControls } from "./controls";
import { ShareStock } from "./share";
import { stockUrl, VIEWS, type StockState } from "./state";
export type StockData = Extract<Awaited<ReturnType<typeof getStockOverview>>, { status: "available" }>;
export function StockShell({ data, state, children }: { data: StockData; state: StockState; children: ReactNode }) {
    const url = stockUrl(data.listing.symbol, state);
    return <div className="stock-page">
        <main id="main-content" className="page-container">
            <p className="disclosure">College Project · Simulated financial data</p>
            <Link className="text-action" href={`/stocks${state.level !== "simple" || state.horizon !== "long" ? `?${new URLSearchParams({ ...(state.level !== "simple" ? { level: state.level } : {}), ...(state.horizon !== "long" ? { horizon: state.horizon } : {}) })}` : ""}`}>← Stocks directory</Link>
            <header className="stock-heading"><div><p className="eyebrow">{data.sector.name} · {data.listing.symbol}</p><h1 tabIndex={-1}>{data.issuer.name}</h1>{state.view === "overview" ? <p>{data.issuer.description}</p> : <details className="company-description"><summary>About this company</summary><p>{data.issuer.description}</p></details>}<p className="research-status"><span className={`status status-${statusTone("picture", data.snapshot!.picture.value)}`}>Research Picture: {data.snapshot!.picture.value ?? "Unavailable"}</span><span className={`status status-${statusTone("risk", data.snapshot!.risk.value)}`}>Risk: {data.snapshot!.risk.value ?? "Unavailable"}</span></p></div><div className="quote"><strong>{money(data.quote?.close ?? null)}</strong><p>{number(data.daily, "% day change")}</p><p className="meta">Simulated close · {data.snapshot!.session}</p><ShareStock key={url} path={url}/></div></header>
            <StockControls symbol={data.listing.symbol} state={state} canonicalUrl={url}/>
            <nav className="stock-navigation" aria-label="Stock research views">{VIEWS.map(view => <Link prefetch={false} scroll={false} key={view} href={stockUrl(data.listing.symbol, state, { view })} aria-current={view === state.view ? "page" : undefined}>{view[0].toUpperCase() + view.slice(1)}</Link>)}</nav>
            <div key={url}>{children}</div>
        </main>
    </div>;
}
