"use client";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { HELP, type HelpTopic } from "./context-help-content";

export function ContextHelp({ topic }: { topic: HelpTopic }) {
    const path = usePathname(), query = useSearchParams();
    return <Help key={`${path}?${query}`} topic={topic}/>;
}
function Help({ topic }: { topic: HelpTopic }) {
    const content = HELP[topic], id = useId(), trigger = useRef<HTMLButtonElement>(null);
    const popover = useRef<HTMLDivElement>(null), sheet = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(false), [mobile, setMobile] = useState(false);
    function close(restore = true) {
        if (popover.current?.matches(":popover-open")) popover.current.hidePopover();
        if (sheet.current?.open) sheet.current.close();
        setOpen(false);
        if (restore) trigger.current?.focus({ preventScroll: true });
    }
    useEffect(() => {
        // Native top-layer surfaces are closed before their trigger disappears.
        const panel = popover.current, dialog = sheet.current;
        return () => { if (panel?.matches(":popover-open")) panel.hidePopover(); if (dialog?.open) dialog.close(); };
    }, []);
    useEffect(() => {
        if (!open) return;
        const dismiss = () => close(false);
        const resize = () => close();
        const outside = (event: PointerEvent) => {
            if (!mobile && !popover.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) close(false);
        };
        const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && !mobile) { event.preventDefault(); close(); } };
        const scroll = (event: Event) => { if (!mobile && !popover.current?.contains(event.target as Node)) close(false); };
        window.addEventListener("market-ai-help-open", dismiss);
        window.addEventListener("resize", resize);
        document.addEventListener("pointerdown", outside);
        document.addEventListener("keydown", escape);
        document.addEventListener("scroll", scroll, true);
        return () => {
            window.removeEventListener("market-ai-help-open", dismiss); window.removeEventListener("resize", resize);
            document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape);
            document.removeEventListener("scroll", scroll, true);
        };
    });
    function toggle() {
        if (open) { close(); return; }
        window.dispatchEvent(new Event("market-ai-help-open"));
        const narrow = window.matchMedia("(max-width: 767px)").matches;
        setMobile(narrow); setOpen(true);
        if (narrow) { sheet.current?.showModal(); sheet.current?.querySelector<HTMLButtonElement>("button")?.focus(); }
        else if (popover.current && trigger.current) {
            const panel = popover.current, anchor = trigger.current.getBoundingClientRect();
            const below = window.innerHeight - anchor.bottom - 20, above = anchor.top - 20;
            const placeBelow = below >= 320 || below >= above;
            panel.style.maxHeight = `${Math.min(600, Math.max(120, placeBelow ? below : above))}px`;
            panel.showPopover();
            const width = panel.getBoundingClientRect().width, height = panel.getBoundingClientRect().height;
            panel.style.left = `${Math.max(12, Math.min(anchor.right - width, window.innerWidth - width - 12))}px`;
            panel.style.top = `${placeBelow ? anchor.bottom + 8 : Math.max(12, anchor.top - height - 8)}px`;
            trigger.current.focus({ preventScroll: true });
        }
    }
    const body = <><div className="help-meaning"><h3>{content.question}</h3><p>{content.meaning}</p></div><div className="help-explainer"><h3>What it tells you</h3><p>{content.tells}</p></div><div className="help-limitation"><h3>What it does not tell you</h3><p>{content.limitation}</p></div>{"checks" in content && <div className="help-checks"><h3>How MARKET AI checks it</h3><ol>{content.checks.map(check => <li key={check}>{check}</li>)}</ol></div>}</>;
    const closeButton = <button className="help-close" aria-label={`Close ${content.title} help`} onClick={() => close()}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>;
    return <div className="context-help"><button ref={trigger} className="help-trigger" onClick={toggle} aria-label={`About ${content.title}`} aria-expanded={open} aria-controls={`${id}-${mobile ? "sheet" : "popover"}`}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3h.01"/></svg></button>
        <div ref={popover} popover="manual" className="help-popover" id={`${id}-popover`} role="region" aria-labelledby={`${id}-desktop-title`}><div className="help-header"><h2 id={`${id}-desktop-title`}>{content.title}</h2>{closeButton}</div><div className="help-body" tabIndex={0}>{body}</div></div>
        <dialog ref={sheet} className="help-sheet" id={`${id}-sheet`} aria-labelledby={`${id}-mobile-title`} onClose={() => { setOpen(false); trigger.current?.focus({ preventScroll: true }); }} onClick={event => {
            if (event.target !== event.currentTarget) return;
            const r = event.currentTarget.getBoundingClientRect();
            if (event.clientY < r.top || event.clientY > r.bottom || event.clientX < r.left || event.clientX > r.right) close();
        }} onKeyDown={event => {
            if (event.key !== "Tab") return;
            const items = [...event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]')];
            if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
            else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
        }}><div className="help-header"><div><p className="eyebrow">CONTEXT HELP</p><h2 id={`${id}-mobile-title`}>{content.title}</h2></div>{closeButton}</div><div className="help-body" tabIndex={0} role="region" aria-label={`${content.title} explanation`}>{body}</div><footer><button className="primary-button" onClick={() => close()}>Got it</button></footer></dialog>
    </div>;
}
