"use client";
import { useState } from "react";
import { shareLink } from "../features/stock/share-link";
export function ShareResearch({ path }: { path: string }) {
    const [message, setMessage] = useState(""), [manual, setManual] = useState(""), [pending, setPending] = useState(false);
    async function share() {
        setPending(true);
        const url = new URL(path, window.location.origin).href;
        // Some embedded browsers leave native-share or clipboard permission
        // requests pending. Keep a usable URL available throughout that wait.
        setManual(url); setMessage("You can copy the research link below.");
        try {
            const result = await shareLink(url, {
                share: navigator.share ? value => navigator.share(value) : undefined,
                copy: navigator.clipboard ? value => navigator.clipboard.writeText(value) : undefined,
            });
            if (result === "shared" || result === "cancelled") { setManual(""); setMessage(""); }
            if (result === "copied") { setManual(""); setMessage("Link copied"); }
            if (result === "manual") { setManual(url); setMessage("Copy the research link below."); }
        } finally { setPending(false); }
    }
    return <div className="share-control"><button onClick={share} disabled={pending}>Share</button><span role="status">{message}</span>{manual && <label>Research link<input readOnly value={manual} onFocus={e => e.target.select()}/></label>}</div>;
}
