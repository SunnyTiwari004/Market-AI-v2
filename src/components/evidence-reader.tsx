"use client";
import { useEffect, useId, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Evidence } from "../domain/research/types";
export function EvidenceReader({ sources, label = "Read supporting sources" }: {
    sources: Evidence[];
    label?: string;
}) {
    const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null), titleId = useId();
    const pathname = usePathname(), query = useSearchParams();
    useEffect(() => { dialog.current?.close(); }, [pathname, query]);
    if (!sources.length) return <span>— Supporting sources unavailable</span>;
    return <><button className="source-button" ref={trigger} onClick={() => dialog.current?.showModal()}>{label} ({sources.length})</button>
    <dialog ref={dialog} aria-labelledby={titleId} onClose={() => trigger.current?.focus()} onKeyDown={event => {
        if (event.key !== "Tab") return;
        const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]')];
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>
      <div className="reader-header"><h2 id={titleId}>Supporting sources</h2><button autoFocus onClick={() => dialog.current?.close()}>Close</button></div>
      <div className="reader-content" tabIndex={0} role="region" aria-label="Source content">
      <p className="disclosure">College Project · Simulated financial data</p>
      {sources.map(source => <article className="source-body" key={source.id}><h3>{source.title}</h3><p>{source.publisher} · Published {source.publishedAt.slice(0, 10)}</p><p className="source-text">{source.body.trim() || "— Source content unavailable."}</p></article>)}
      </div>
    </dialog></>;
}
