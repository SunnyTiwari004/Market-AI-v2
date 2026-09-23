"use client";
import { useState } from "react";
import type { Price } from "../../domain/research/types";
import { money } from "./format";
export function selectedIndex(current: number, key: string, count: number) {
    return Math.max(0, Math.min(count - 1, key === "Home" ? 0 : key === "End" ? count - 1 : current + (key === "ArrowLeft" || key === "ArrowDown" ? -1 : key === "ArrowRight" || key === "ArrowUp" ? 1 : 0)));
}
export function CloseChart({ points }: { points: Price[] }) {
    const [index, setIndex] = useState(Math.max(0, points.length - 1));
    if (!points.length) return <p>— Unavailable: no stored closes in this range.</p>;
    const selected = points[index] ?? points[points.length - 1];
    // Binary numbers are used only for SVG geometry, never financial arithmetic.
    const values = points.map(p => Number(p.close)), min = Math.min(...values), max = Math.max(...values), spread = max - min || 1;
    const x = (i: number) => 24 + i / Math.max(1, points.length - 1) * 752;
    const y = (value: number) => 236 - (value - min) / spread * 212;
    return <>
        <p className="chart-readout" aria-live="polite" aria-atomic="true"><strong>{money(selected.close)}</strong> · {selected.date} · simulated close</p>
        <svg className="close-chart" viewBox="0 0 800 260" role="img" aria-label={`Simulated closing prices from ${points[0].date} to ${points[points.length - 1].date}. Use the labeled point selector below to inspect values.`}
            onPointerDown={e => { const r = e.currentTarget.getBoundingClientRect(); setIndex(Math.round(Math.max(0, Math.min(1, ((e.clientX - r.left) / r.width * 800 - 24) / 752)) * (points.length - 1))); }}
            onPointerMove={e => { if (e.pointerType === "mouse" || e.buttons === 1) { const r = e.currentTarget.getBoundingClientRect(); setIndex(Math.round(Math.max(0, Math.min(1, ((e.clientX - r.left) / r.width * 800 - 24) / 752)) * (points.length - 1))); } }}>
            {[24, 130, 236].map(v => <line key={v} x1="24" x2="776" y1={v} y2={v} stroke="var(--border)"/>)}
            <polyline points={values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke="var(--brand)" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
            <line x1={x(index)} x2={x(index)} y1="24" y2="236" stroke="var(--muted)" strokeDasharray="4 4"/>
            <circle cx={x(index)} cy={y(Number(selected.close))} r="5" fill="var(--brand)"/>
        </svg>
        <div className="chart-extents"><span>{points[0].date}</span><span>{points[points.length - 1].date}</span></div>
        <label className="point-selector">Inspect a closing price<input type="range" min={0} max={points.length - 1} value={index} aria-valuetext={`${selected.date}, ${money(selected.close)}`} onChange={e => setIndex(Number(e.target.value))} onKeyDown={e => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) { e.preventDefault(); setIndex(selectedIndex(index, e.key, points.length)); }
        }}/></label>
        <p className="meta">Tap the chart or use the selector. Arrow keys move one stored close; Home and End move to the endpoints. Line segments connect stored closes; no intermediate observations are created.</p>
        <details><summary>Closing-price table · {points.length} stored observations</summary><div className="table-scroll price-table" tabIndex={0} role="region" aria-label="Stored closing-price history"><table><caption>Same simulated closes as the chart · INR per share</caption><thead><tr><th scope="col">Date</th><th scope="col">Closing price</th></tr></thead><tbody>{points.map(p => <tr key={p.id}><th scope="row">{p.date}</th><td>{money(p.close)}</td></tr>)}</tbody></table></div></details>
    </>;
}
