"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ipoUrl, LEVELS, type Level } from "./state";
export function IpoControls({ slug, level }: { slug: string; level: Level }) {
    const router = useRouter(), [pending, startTransition] = useTransition(), canonical = ipoUrl(slug, level);
    useEffect(() => { document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true }); }, [slug]);
    useEffect(() => {
        if (window.location.pathname + window.location.search !== canonical) router.replace(canonical, { scroll: false });
    }, [canonical, router]);
    return <div className="research-controls" aria-busy={pending}><label>Explanation level<select value={level} onChange={e => {
        const next = LEVELS.find(l => l === e.target.value) ?? "simple";
        if (next !== level) startTransition(() => router.replace(ipoUrl(slug, next), { scroll: false }));
    }}><option value="simple">Simple</option><option value="normal">Normal</option><option value="pro">Pro</option></select></label><span className="meta" role="status">{pending ? "Updating explanation… Displayed research is from the previous selection." : `${level === "pro" ? "Pro" : level === "normal" ? "Normal" : "Simple"} explanation loaded`}</span></div>;
}
