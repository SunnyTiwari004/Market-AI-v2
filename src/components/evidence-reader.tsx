"use client";
import { useId, useRef } from "react";
import type { Evidence } from "../domain/research/types";
export function EvidenceReader({ sources, label = "Read supporting sources" }: {
    sources: Evidence[];
    label?: string;
}) {
    const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null), titleId = useId();
    return <><button className="source-button" ref={trigger} onClick={() => dialog.current?.showModal()}>{label} ({sources.length})</button>
    <dialog ref={dialog} aria-labelledby={titleId} onClose={() => trigger.current?.focus()}>
      <div className="reader-header"><h2 id={titleId}>Supporting sources</h2><button onClick={() => dialog.current?.close()}>Close</button></div>
      <p className="disclosure">College Project · Simulated financial data</p>
      {sources.map(source => <article className="source-body" key={source.id}><h3>{source.title}</h3><p>{source.publisher} · Published {source.publishedAt.slice(0, 10)}</p><p className="source-text">{source.body}</p></article>)}
    </dialog></>;
}
