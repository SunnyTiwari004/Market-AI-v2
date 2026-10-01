import Link from "next/link";
import { getDiscovery } from "../../server/discovery";
import { EvidenceReader } from "../../components/evidence-reader";
import { DiscoveryControls, HomeSearch } from "./controls";
import { selectDiscovery } from "./model";
import { discoveryUrl, type DiscoveryRoute, type Query } from "./state";
import { Changes, EmptyResults, exploreLink, IpoCards, MarketBriefing, MembershipCards, SectionHeading, SectorCards, StockCards } from "./views";
import { RetryDiscovery } from "./retry";
import { DiscoveryFocus } from "./focus";
const titles = { "/": "Understand what’s happening today.", "/explore": "Find something worth understanding.", "/stocks": "Find a company. Understand its story.", "/ipos": "Explore the simulated IPO pipeline." };
export async function DiscoveryPage({ route, query }: { route: DiscoveryRoute; query: Query }) {
    const result = await getDiscovery(route, query);
    if (result.status !== "available") return <main id="main-content" className="page-container"><p className="disclosure">College Project · Simulated financial data</p><h1 tabIndex={-1}>Research is unavailable</h1><p>We could not read the canonical PostgreSQL dataset. Your requested URL is preserved; no replacement financial data is shown.</p><RetryDiscovery/></main>;
    const { data, state, canonicalUrl, invalid } = result, selected = selectDiscovery(data, state);
    const directoryCount = route === "/stocks" ? selected.stocks.length : route === "/ipos" ? selected.ipos.length : state.type === "all" ? selected.stocks.length + selected.sectors.length + selected.themes.length + selected.ipos.length : selected[state.type].length;
    const scoped = state.sector || state.theme || state.collection;
    const show = (type: typeof state.type) => state.type === "all" || state.type === type;
    const matches = !!(state.q || scoped || state.type === "stocks");
    const research = matches ? selected.stocks : selected.stocks.filter(s => s.worthy);
    const otherStocks = !matches ? selected.stocks.filter(s => !s.worthy) : [];
    const changes = selected.stocks.filter(s => s.changes);
    const count = route !== "/explore" || state.section === "research" ? directoryCount : state.section === "changes" ? changes.length : state.section === "collections" ? data.collections.length : selected[state.section].length;
    return <main id="main-content" className={`page-container discovery-page ${route === "/" ? "home-page" : ""}`}>
        <DiscoveryFocus section={state.section}/>
        <p className="disclosure">College Project · Simulated financial data</p>
        <header className="discovery-heading"><p className="eyebrow">{route === "/" ? "Market Today" : route.slice(1)} · Simulation date {data.cutoff}</p><h1 tabIndex={-1}>{titles[route]}</h1><p>{route === "/" ? "The simulated market picture, explained through research and evidence." : route === "/explore" ? "Discover companies, sectors, themes and IPOs. Start with the meaning, then examine the evidence." : route === "/stocks" ? "A complete directory of listed fictional companies, with reasons to look closer and concerns to understand." : "Fictional offers, with status derived from the simulation timeline. Open an offer to understand its structure, research and supporting evidence."}</p></header>
        <DiscoveryControls {...{ route, state, canonicalUrl, count, invalid }} sectors={data.sectors.map(({ slug, name }) => ({ slug, name }))}/>
        {route === "/" ? <>
            <HomeSearch key={canonicalUrl} identities={data.identities}/>
            <div className="home-briefing-layout"><MarketBriefing data={data} state={state}/>
                <section className="market-context"><SectionHeading title="Why is the market moving?"/><p>Observed movement and documented context are different. The index shows what prices did; the events below do not prove what caused that movement.</p>{data.events.length ? data.events.map(event => <article className="driver-row" key={event.id}><h3>{data.sectors.find(s => s.id === event.sectorId)?.name ?? "Market context"}</h3><p>{event.summary}</p><p className="meta">Occurred {event.occurredAt.slice(0, 10)} · Simulated event</p><EvidenceReader sources={data.sources.filter(s => s.id === event.evidenceId)} label="Read context evidence"/></article>) : <p>Documented market context is unavailable.</p>}</section>
                <section className="what-matters surface"><h2>What Matters Today</h2><p>Recent published context available at {data.cutoff}.</p>{data.events.map(event => { const source = data.sources.find(s => s.id === event.evidenceId); return source && <article key={event.id}><h3>{source.title}</h3><p className="meta">{source.publisher} · {source.publishedAt.slice(0, 10)} · Simulated article</p><p>{event.summary}</p><EvidenceReader sources={[source]} label="Read article"/></article>; })}</section>
            </div>
            <section className="discovery-section"><SectionHeading title="Sector Picture" href={exploreLink(state, "sectors")} action="Explore sectors"/><SectorCards sectors={data.sectors} state={state}/></section>
            <section className="discovery-section"><SectionHeading title="Worth Researching" href={exploreLink(state, "research")} action="Explore more research"/><p>Companies meeting the defined discovery checks, in name order. Each has a sourced reason and concern.</p>{data.stocks.some(s => s.worthy) ? <StockCards stocks={data.stocks.filter(s => s.worthy).slice(0, 3)} state={state}/> : <p>No companies meet the complete Worth Researching criteria at this cutoff.</p>}</section>
            <section className="discovery-section"><SectionHeading title="Recent Research Changes" href={exploreLink(state, "changes")} action="See all changes"/><Changes stocks={changes.slice(0, 3)} state={state}/></section>
            <section className="discovery-section"><SectionHeading title="IPO Watch" href="/ipos" action="View all IPOs"/><p>Offer previews from the fictional universe.</p><IpoCards ipos={data.ipos.filter(i => i.terms?.status !== "Listed").slice(0, 2)}/></section>
        </> : route === "/stocks" ? <section className="discovery-section" aria-label="Stock results">{selected.stocks.length ? <StockCards stocks={selected.stocks} state={state}/> : <EmptyResults href={discoveryUrl(route, state, { q: "", sector: "" })} dataset={!data.stocks.length}/>}</section>
        : route === "/ipos" ? <section className="discovery-section" aria-label="IPO results">{selected.ipos.length ? <IpoCards ipos={selected.ipos} grouped={state.status === "All"}/> : <EmptyResults href={discoveryUrl(route, state, { q: "", status: "All" })} dataset={!data.ipos.length}/>}</section>
        : <>
            {scoped && <section className="scope-summary"><h2>Research scope</h2>{state.sector && <p>Sector: {data.sectors.find(s => s.slug === state.sector)?.name}</p>}{state.theme && <><h3>{data.themes.find(t => t.slug === state.theme)?.name}</h3><p>{data.themes.find(t => t.slug === state.theme)?.rationale}</p></>}{state.collection && <><h3>{data.collections.find(c => c.slug === state.collection)?.name}</h3><p>{data.collections.find(c => c.slug === state.collection)?.rationale}</p></>}<Link className="text-action" href={discoveryUrl(route, state, { sector: "", theme: "", collection: "" })}>Clear discovery scope</Link></section>}
            <nav className="section-navigation" aria-label="Explore sections">{(["research", "changes", "sectors", "themes", "collections", "ipos"] as const).map(section => <Link key={section} href={discoveryUrl(route, state, { section, type: section === "sectors" ? "sectors" : section === "themes" ? "themes" : section === "ipos" ? "ipos" : section === "collections" ? "all" : state.type })} aria-current={state.section === section ? "location" : undefined}>{section === "ipos" ? "IPOs" : section[0].toUpperCase() + section.slice(1)}</Link>)}</nav>
            {count === 0 && <EmptyResults href={discoveryUrl(route, state, { q: "", type: "all", sector: "", theme: "", collection: "", picture: "Any", risk: "Any", valuation: "Any", change: "Any" })}/>}
            {(state.section === "research" && show("stocks")) && <section className="discovery-section"><SectionHeading title={matches ? "Stock research results" : "Worth Researching"}/><p>{matches ? "Matches from the complete Stock directory." : "Defined discovery checks: Strong or Mixed picture, Low or Medium Risk, at least Medium Evidence Confidence, with a sourced reason and concern. Name order, not a ranking."}</p>{research.length ? <StockCards stocks={research} state={state}/> : <p>No companies meet the Worth Researching criteria in this scope.</p>}{otherStocks.length > 0 && <><SectionHeading title="More Stock research"/><StockCards stocks={otherStocks} state={state}/></>}</section>}
            {(state.section === "changes" || (state.section === "research" && show("stocks"))) && <section className="discovery-section"><SectionHeading title="Recent Research Changes"/><Changes stocks={changes} state={state}/></section>}
            {(state.section === "sectors" || (state.section === "research" && show("sectors"))) && <section className="discovery-section"><SectionHeading title="Sector Picture"/><SectorCards sectors={selected.sectors} state={state}/></section>}
            {(state.section === "themes" || (state.section === "research" && show("themes"))) && <section className="discovery-section"><SectionHeading title="Themes"/><MembershipCards groups={selected.themes} title="theme"/></section>}
            {(state.section === "collections" || (state.section === "research" && state.type === "all" && !state.q)) && <section className="discovery-section"><SectionHeading title="Curated Collections"/><MembershipCards groups={data.collections} title="collection"/></section>}
            {(state.section === "ipos" || (state.section === "research" && show("ipos"))) && <section className="discovery-section"><SectionHeading title="IPO Watch" href="/ipos" action="View IPO directory"/><IpoCards ipos={selected.ipos}/></section>}
        </>}
        <footer className="discovery-footer"><p>Financial content is simulated for educational and demonstration use, not live exchange information or investment advice.</p><p className="meta">Dataset: {data.dataset} · As of {data.cutoff}</p></footer>
    </main>;
}
