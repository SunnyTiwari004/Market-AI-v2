"use client";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { appliedCount, DEFAULT_FILTERS, discoveryUrl, FILTER_KEYS, FILTER_LABELS, FILTER_OPTIONS, matchIdentities, STATUSES, TYPES, type DiscoveryRoute, type DiscoveryState, type Identity } from "./state";

const explanations = {
    picture: "Overall synthesis of supported business, growth, financial health and research context.",
    valuation: "Relative valuation against compatible companies in the same sector; not a forecast of returns.",
    risk: "Summarizes supported financial and historical price-risk evidence.",
    change: "Compares compatible research snapshots. Research Picture direction takes precedence, then Risk. Other metric movements remain in the details.",
};
export function DiscoveryControls({ route, state, canonicalUrl, sectors, count, invalid = false }: { route: DiscoveryRoute; state: DiscoveryState; canonicalUrl: string; sectors: { slug: string; name: string }[]; count: number; invalid?: boolean }) {
    const router = useRouter(), [pending, startTransition] = useTransition();
    const [editing, setEditing] = useState({ url: canonicalUrl, text: state.q }), [draft, setDraft] = useState(state);
    const query = editing.url === canonicalUrl ? editing.text : state.q;
    const setQuery = (text: string) => setEditing({ url: canonicalUrl, text });
    const [notice, setNotice] = useState(invalid ? "Unsupported or incompatible URL choices were removed. Showing the accepted state." : "");
    const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null), titleId = useId();
    const active = appliedCount(state);
    useEffect(() => {
        dialog.current?.close();
        if (window.location.pathname + window.location.search !== canonicalUrl) router.replace(canonicalUrl, { scroll: false });
    }, [canonicalUrl, router]);
    useEffect(() => {
        const sheet = dialog.current;
        return () => { sheet?.close(); };
    }, []);
    function update(patch: Partial<DiscoveryState>, replace = false) {
        const next = discoveryUrl(route, state, patch);
        if (next === canonicalUrl) return;
        startTransition(() => { if (replace) router.replace(next, { scroll: false }); else router.push(next, { scroll: false }); });
    }
    function close() { dialog.current?.close(); }
    function apply() {
        update({ type: "stocks", section: "research", ...Object.fromEntries(FILTER_KEYS.map(k => [k, draft[k]])), horizon: draft.horizon });
        close();
    }
    return <div className="discovery-controls" aria-busy={pending}>
        <div className="discovery-preferences"><label>Explanation level<select value={state.level} onChange={e => update({ level: e.target.value as DiscoveryState["level"] }, true)}><option value="simple">Simple</option><option value="normal">Normal</option><option value="pro">Pro</option></select></label>{(route === "/explore" || route === "/stocks") && <label>Research Horizon<select value={state.horizon} onChange={e => update({ horizon: e.target.value as DiscoveryState["horizon"] })}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></label>}</div>
        {route !== "/" && <form className="directory-search" onSubmit={e => { e.preventDefault(); update({ q: query }); }} role="search"><label htmlFor="discovery-query">{route === "/stocks" ? "Search by company name or symbol" : route === "/ipos" ? "Search by IPO issuer name" : "Search companies, sectors, themes or IPOs"}</label><div><input id="discovery-query" name="q" value={query} onChange={e => setQuery(e.target.value)} type="search"/><button className="primary-button" type="submit">Search</button><button type="button" onClick={() => { setQuery(""); update({ q: "" }); }}>Clear search</button></div></form>}
        {route === "/explore" && <><div className="category-controls"><div className="category-rail" role="group" aria-label="Discovery category">{TYPES.map(type => <button key={type} aria-pressed={type === state.type} onClick={() => { if (type !== "stocks" && active) setNotice("Company filters cleared. These filters apply only to Stocks."); update({ type, section: "research", ...DEFAULT_FILTERS, theme: "", collection: "" }); }}>{type === "ipos" ? "IPOs" : type[0].toUpperCase() + type.slice(1)}</button>)}</div><button className="filter-trigger" ref={trigger} onClick={() => { setDraft({ ...state }); dialog.current?.showModal(); }}>{state.type === "stocks" ? "Filters" : "Filter stocks"}{active ? ` (${active})` : ""}</button></div>
        <dialog ref={dialog} className="filter-dialog" aria-labelledby={titleId} onClose={() => trigger.current?.focus()} onClick={e => { if (e.target !== e.currentTarget) return; const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); }} onKeyDown={e => {
            if (e.key !== "Tab") return;
            const elements = [...e.currentTarget.querySelectorAll<HTMLElement>('button, select, input, [tabindex="0"]')];
            const first = elements[0], last = elements.at(-1);
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
        }}>
            <div className="filter-header"><div><h2 id={titleId}>Filters <span className="draft-count">{appliedCount(draft)} selected in draft</span></h2><p>Meaning first · Refining simulated stock research</p></div><button autoFocus aria-label="Close filters without applying" onClick={close}>×</button></div>
            <div className="filter-body" tabIndex={0} role="region" aria-label="Filter choices">{FILTER_KEYS.map((key, i) => <fieldset key={key}><legend>{i + 1}. {FILTER_LABELS[key]}</legend><div className={`filter-options filter-options-${key}`}>{FILTER_OPTIONS[key].map(value => <button key={value} type="button" aria-pressed={draft[key] === value} onClick={() => setDraft({ ...draft, [key]: value })}><span>{value}</span>{draft[key] === value && <span aria-hidden="true">✓</span>}</button>)}</div><p>{explanations[key]}</p></fieldset>)}<fieldset><legend>5. Research Horizon</legend><div className="filter-options">{(["short", "medium", "long"] as const).map(horizon => <button key={horizon} aria-pressed={draft.horizon === horizon} onClick={() => setDraft({ ...draft, horizon })}>{horizon[0].toUpperCase() + horizon.slice(1)}{draft.horizon === horizon && <span aria-hidden="true">✓</span>}</button>)}</div><p>Changes the research context, not a suggested holding period. Historical financial records remain unchanged. Horizon is independent of the company-filter count.</p></fieldset></div>
            <div className="filter-footer"><button onClick={() => setDraft({ ...draft, ...DEFAULT_FILTERS, horizon: "long" })}>Reset</button><button className="primary-button" onClick={apply}>Apply filters{appliedCount(draft) ? ` · ${appliedCount(draft)}` : ""}</button></div>
        </dialog>
        {active > 0 && <div className="active-filters" aria-label="Applied company filters">{FILTER_KEYS.filter(k => state[k] !== "Any").map(k => <button key={k} aria-label={`Remove ${FILTER_LABELS[k]}: ${state[k]}`} onClick={() => update({ [k]: "Any" })}>{FILTER_LABELS[k]}: {state[k]} ×</button>)}<button onClick={() => update(DEFAULT_FILTERS)}>Clear all filters</button></div>}</>}
        {route === "/stocks" && <label className="directory-select">Sector<select value={state.sector} onChange={e => update({ sector: e.target.value })}><option value="">Any</option>{sectors.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></label>}
        {route === "/ipos" && <div className="category-rail" role="group" aria-label="IPO status">{STATUSES.map(status => <button key={status} aria-pressed={state.status === status} onClick={() => update({ status })}>{status}</button>)}</div>}
        {route !== "/" && <p className="result-status" role="status" aria-live="polite">{pending ? "Updating results… Displayed results are from the previous selection." : `${count} results for the applied state.`} {notice}</p>}
    </div>;
}

export function HomeSearch({ identities }: { identities: Identity[] }) {
    const [query, setQuery] = useState(""), [open, setOpen] = useState(false), [selected, setSelected] = useState(-1);
    const id = useId(), router = useRouter();
    const matches = matchIdentities(identities.filter(i => i.kind === "stocks" || i.kind === "ipos"), query);
    const grouped = [...matches.filter(i => i.kind === "stocks"), ...matches.filter(i => i.kind === "ipos")];
    useEffect(() => {
        if (open && selected >= 0) document.getElementById(`${id}-${selected}`)?.scrollIntoView({ block: "nearest" });
    }, [id, open, selected]);
    return <div className="home-search"><form role="search" onSubmit={e => { e.preventDefault(); if (selected >= 0 && grouped[selected]) router.push(grouped[selected].href); else setOpen(true); }}><label htmlFor={id}>Find a fictional Stock or IPO</label><div className="home-search-input"><input id={id} type="search" role="combobox" aria-autocomplete="list" aria-expanded={open && !!query.trim()} aria-controls={`${id}-results`} aria-activedescendant={open && selected >= 0 ? `${id}-${selected}` : undefined} value={query} onChange={e => { setQuery(e.target.value); setSelected(-1); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={e => { if (e.nativeEvent.isComposing && e.key === "Enter") { e.preventDefault(); return; } if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setSelected(i => grouped.length ? (i + (e.key === "ArrowDown" ? 1 : -1) + grouped.length) % grouped.length : -1); } else if (e.key === "Escape" || e.key === "Tab") { setOpen(false); setSelected(-1); } }}/><button className="primary-button" type="submit">Search</button><button type="button" onClick={() => { setQuery(""); setSelected(-1); setOpen(false); }}>Clear</button></div></form>
        <p className="meta" role="status">{query.trim() ? `${grouped.length} matching entities. Choose a Stock or IPO to open its research.` : "Search canonical company names or Stock symbols. Enter shows matches; choose an entity to open it."}</p>
        <div id={`${id}-results`} role="listbox" aria-label="Matching entities" hidden={!open || !query.trim()}>{(["stocks", "ipos"] as const).map(kind => <div key={kind} role="group" aria-label={kind === "stocks" ? "Stocks" : "IPOs"}>{grouped.some(i => i.kind === kind) && <p className="suggestion-group" aria-hidden="true">{kind === "stocks" ? "Stocks" : "IPOs · Research"}</p>}{grouped.map((item, i) => item.kind === kind && <div key={item.id} id={`${id}-${i}`} role="option" aria-selected={i === selected} onMouseDown={e => e.preventDefault()} onClick={() => router.push(item.href)}>{item.name}{item.symbol ? ` · ${item.symbol}` : ""}</div>)}</div>)}</div>
        {open && query.trim() && !grouped.length && <p>No matching fictional entity. <a href="/explore">Browse Explore</a> or clear your search.</p>}
    </div>;
}
