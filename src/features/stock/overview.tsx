import type { getStockOverview } from "../../server/stock-overview";
import { EvidenceReader } from "../../components/evidence-reader";
import type { StockState } from "./state";
import { labels, meanings, money, number, statusTone } from "./format";
import { METRIC_LABELS } from "../../domain/research/metric-labels";
import type { Result } from "../../domain/research/types";
type Data = Extract<Awaited<ReturnType<typeof getStockOverview>>, {
    status: "available";
}>;
function Status({ value, context }: {
    value: Result<string>;
    context: keyof typeof labels;
}) { const label = value.value; return <span className={`status status-${statusTone(context, label)}`}>{label ?? <><span aria-hidden="true">— </span>Unavailable</>}{value.availability === "partial" ? " · incomplete coverage" : ""}</span>; }
export function StockOverview({ data, level = "simple" }: {
    data: Data; level?: StockState["level"];
}) {
    const s = data.snapshot!, sources = (ids: string[]) => data.evidence.filter(e => ids.includes(e.id)), changes = data.changes.value;
    const positive = s.findings.filter(f => f.kind === "positive"), attention = s.findings.filter(f => f.kind !== "positive");
    return <>
      <section className="surface"><h2>Overview</h2><p>{s.picture.value === "Strong" ? "The defined research checks show a broadly strong business picture." : s.picture.value === "Weak" ? "The research checks identify significant weaknesses that need attention." : s.picture.value === "Mixed" ? "The business picture combines strengths with important trade-offs." : "There is not enough complete research to form an overall picture."} This is an educational assessment, not a prediction or investment instruction.</p>
        <p>Research as of {s.cutoff}. Annual business inputs end {s.annualEnd ?? "Unavailable"}; trailing earnings end {s.ttmEnd ?? "Unavailable"}. Daily price movement is separate from business health.</p>
        <EvidenceReader sources={sources(s.findings.flatMap(f => f.evidenceIds))}/>
        {level !== "simple" && <dl className="metric-list">{(["revenueGrowth", "margin", "debtEquity"] as const).map(key => <div key={key}><dt>{METRIC_LABELS[key][0]}</dt><dd>{number(s.metrics[key].value, ` ${METRIC_LABELS[key][1]}`)}</dd></div>)}</dl>}
        {level === "pro" && <p className="meta">Annual period ends {s.annualEnd ?? "Unavailable"}; trailing four-quarter period ends {s.ttmEnd ?? "Unavailable"}. INR, standalone. Operating margin = EBIT ÷ revenue × 100; debt/equity = interest-bearing debt ÷ positive ordinary equity. Research method: {s.method}. Missing or incompatible inputs remain unavailable.</p>}
      </section>
      <section className="surface"><h2>Quick View</h2><dl className="quick-view">{(["picture", "confidence", "risk", "direction", "valuation"] as const).map(key => <div key={key}><dt>{labels[key]}</dt><dd><Status value={s[key]} context={key}/></dd></div>)}</dl>
        <p>Evidence Confidence measures simulated source coverage, not the likelihood of a return. Price Direction covers {s.horizon === "short" ? "20" : s.horizon === "medium" ? "60" : "252"} trading sessions. Price vs Value compares the same trailing earnings window against two same-sector peers; it is not intrinsic value.</p>
        {s.confidence.reasons.length > 0 && <p className="notice">Evidence coverage is incomplete: {s.confidence.reasons.map(r => r.replaceAll("_", " ").toLowerCase()).join(", ")}. Later publications are excluded from this cutoff.</p>}
      </section>
      <div className="two-columns">{[{ title: "What Looks Good", items: positive }, { title: "Needs Attention", items: attention }].map(({ title, items }) => <section className="surface" key={title}><h2>{title}</h2>{items.length ? items.map(f => <div className="finding" key={f.key}><h3>{labels[f.field]}</h3><p>{s[f.field].value ? meanings[f.field][s[f.field].value!] : "Required research inputs are unavailable."}</p><EvidenceReader label="Read evidence" sources={sources(f.evidenceIds)}/></div>) : <p>{title === "What Looks Good" ? "No pillar meets all strength checks in this snapshot." : "No pillar-level weakness was identified. The small peer set and illustrative assumptions still limit this research."}</p>}</section>)}</div>
      <section className="surface"><h2>How We See the Stock</h2><div className="pillars">{(["business", "growth", "financial"] as const).map(key => <article key={key}><h3>{labels[key]}</h3><Status value={s[key]} context={key}/><p>{s[key].value ? meanings[key][s[key].value!] : "Required inputs are unavailable."}</p></article>)}</div></section>
      <div className="two-columns"><section className="surface"><h2>Possible 30-Day Outcomes</h2><p>Illustrative earnings and peer-multiple sensitivities. These are neither probabilities nor guaranteed returns. The window stays 30 days at every research horizon.</p>
        {data.scenario?.value ? <div className="scenario-grid">{data.scenario.value.map(c => <article key={c.label}><h3>{c.label}</h3><strong>{money(c.price)}</strong><p>{number(c.change, "% versus cutoff close")}</p></article>)}</div> : <p>— Unavailable: comparable positive earnings and peer valuation are required.</p>}
        <details><summary>Read scenario assumptions</summary>{data.assumptions.map(a => <p key={a.id}><strong>{a.label}:</strong> earnings change {number(a.g)} as a fraction; peer multiplier {number(a.m)} times. {a.rationale}</p>)}</details>
      </section><section className="surface" id="what-changed"><h2 tabIndex={-1}>What Changed?</h2>{changes ? <><p>Compared with {changes.from}, using the same {s.horizon} horizon and methodology.</p>{changes.headlines.length ? <ul>{changes.headlines.map(c => <li key={c.field}>{labels[c.field as keyof typeof labels]}: {c.before ?? "Unavailable"} → {c.after ?? "Unavailable"} ({c.state.toLowerCase()})</li>)}</ul> : <p>Research categories are unchanged. Input values may still have moved.</p>}<p>{changes.addedEvidence.length} supporting sources added; {changes.removedEvidence.length} removed.</p><details><summary>All comparison details</summary><p>Annual period: {changes.annualPeriods.join(" → ")}. Trailing period: {changes.ttmPeriods.join(" → ")}.</p><dl className="metric-list">{changes.metrics.map(m => <div key={m.field}><dt>{m.label}</dt><dd>{m.delta === null ? "Unavailable" : number(m.delta, ` ${m.unit}`)}</dd></div>)}</dl></details></> : <p>— Unavailable: no earlier compatible snapshot exists for this first cutoff.</p>}</section></div>
      <section className="surface"><h2>Evidence and calculation basis</h2><p>{data.evidence.length} distinct supporting sources. Statements and source bodies are simulated; calculations use those inputs under {s.method}.</p><EvidenceReader sources={data.evidence} label="Browse all sources"/><details open={level === "pro"}><summary>Supporting calculated values</summary><dl className="metric-list">{Object.entries(s.metrics).map(([key, value]) => <div key={key}><dt>{METRIC_LABELS[key as keyof typeof METRIC_LABELS][0]}</dt><dd>{value.value === null ? "Unavailable" : number(value.value, ` ${METRIC_LABELS[key as keyof typeof METRIC_LABELS][1]}`)}{value.reasons.length ? ` · ${value.reasons.join(", ")}` : ""}</dd></div>)}</dl></details><p className="meta">Dataset: {s.dataset}. Research assessments use the same canonical inputs at every explanation level.</p></section>
    </>;
}
