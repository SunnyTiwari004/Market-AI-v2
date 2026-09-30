"use client";
import { useEffect, useRef } from "react";
export function DiscoveryFocus({ section }: { section: string }) {
    const previous = useRef(section);
    useEffect(() => { document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true }); }, []);
    useEffect(() => {
        if (previous.current !== section) {
            previous.current = section;
            if (document.activeElement?.classList.contains("filter-trigger")) return;
            const heading = document.querySelector<HTMLElement>(".discovery-section h2");
            heading?.setAttribute("tabindex", "-1");
            heading?.focus();
        }
    }, [section]);
    return null;
}
