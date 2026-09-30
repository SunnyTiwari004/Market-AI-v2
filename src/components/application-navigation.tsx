"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
export const DESTINATIONS = [["/", "Home"], ["/explore", "Explore"], ["/stocks", "Stocks"], ["/ipos", "IPOs"]] as const;
const paths = ["m3 10 9-7 9 7v10H3V10m6 10v-7h6v7", "m16 8-3 5-5 3 3-5 5-3M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20", "M5 20V10m7 10V4m7 16V7", "M6 3h9l4 4v14H6V3m9 0v5h4M9 12h7m-7 4h7"];
export function ApplicationNavigation() {
    const pathname = usePathname(), query = useSearchParams(), previous = useRef(pathname);
    useEffect(() => {
        if (previous.current !== pathname) { document.querySelector<HTMLElement>("main h1")?.focus(); previous.current = pathname; }
    }, [pathname]);
    return <><a className="skip-link" href="#main-content">Skip to content</a><header className="application-header"><Link className="brand" href="/" aria-label="MARKET AI Home"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m3 17 6-6 4 3 8-9"/></svg>MARKET AI</Link><nav className="primary-navigation" aria-label="Main navigation">{DESTINATIONS.map(([path, name], index) => {
        const params = new URLSearchParams();
        const level = query.get("level"), horizon = query.get("horizon");
        if (level === "normal" || level === "pro") params.set("level", level);
        if ((path === "/stocks" || path === "/explore") && (horizon === "short" || horizon === "medium")) params.set("horizon", horizon);
        const active = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return <Link key={path} prefetch={false} href={path + (params.size ? `?${params}` : "")} aria-current={active ? "page" : undefined}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[index]}/></svg>{name}</Link>;
    })}</nav><span className="header-context">Understand before deciding</span></header></>;
}
