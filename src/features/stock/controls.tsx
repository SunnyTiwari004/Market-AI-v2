"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CUTOFFS } from "../../domain/research/calendar";
import { stockUrl, type StockState } from "./state";

export function StockControls({ symbol, state, canonicalUrl }: { symbol: string; state: StockState; canonicalUrl: string }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    useEffect(() => {
        // Normalize only when the server's accepted state arrives. Depending on
        // the live query here can replace a pending navigation with stale props.
        const current = window.location.pathname + window.location.search;
        if (current !== canonicalUrl) router.replace(canonicalUrl, { scroll: false });
    }, [canonicalUrl, router]);
    function update(patch: Partial<StockState>, replace = false) {
        const url = stockUrl(symbol, state, patch);
        if (url === canonicalUrl) return;
        startTransition(() => { if (replace) router.replace(url, { scroll: false }); else router.push(url, { scroll: false }); });
    }
    return <div className="research-controls" aria-busy={pending}>
        <label>Explanation level<select name="level" value={state.level} onChange={e => update({ level: e.target.value as StockState["level"] }, true)}><option value="simple">Simple</option><option value="normal">Normal</option><option value="pro">Pro</option></select></label>
        <label>Research horizon<select name="horizon" value={state.horizon} onChange={e => update({ horizon: e.target.value as StockState["horizon"] })}><option value="short">Short · Next 30 days</option><option value="medium">Medium · Next 12 months</option><option value="long">Long · 3–5 years</option></select></label>
        <label>Research as of<select name="cutoff" value={state.cutoff} onChange={e => update({ cutoff: e.target.value as StockState["cutoff"] })}>{CUTOFFS.map(c => <option key={c}>{c}</option>)}</select></label>
        <span className="meta" role="status">{pending ? "Updating research…" : `${state.level === "pro" ? "Pro" : state.level === "normal" ? "Normal" : "Simple"} · ${state.view} loaded`}</span>
    </div>;
}
