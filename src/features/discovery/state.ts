import { LEVELS } from "../stock/state";
import { HORIZONS } from "../../domain/research/types";

export type Query = Record<string, string | string[] | undefined>;
export type DiscoveryRoute = "/" | "/explore" | "/stocks" | "/ipos";
export const TYPES = ["all", "stocks", "sectors", "themes", "ipos"] as const;
export const STATUSES = ["All", "Upcoming", "Open", "Closed", "Listed"] as const;
export const FILTER_OPTIONS = {
    picture: ["Any", "Strong", "Mixed", "Weak"],
    valuation: ["Any", "Attractive", "In line", "Expensive"],
    risk: ["Any", "Low", "Medium", "High"],
    change: ["Any", "Improving", "Weakening", "Unchanged", "Newly available/Unavailable"],
} as const;
export const FILTER_LABELS = { picture: "Research Picture", valuation: "Price vs Value", risk: "Risk", change: "Recent Change" };
export type FilterKey = keyof typeof FILTER_OPTIONS;
export const FILTER_KEYS = Object.keys(FILTER_OPTIONS) as FilterKey[];
export const DEFAULT_FILTERS = { picture: "Any", valuation: "Any", risk: "Any", change: "Any" } as const;
const choice = <T extends string>(v: unknown, options: readonly T[], fallback: T): T => typeof v === "string" && options.includes(v as T) ? v as T : fallback;
export const normalizeText = (text: string) => text.normalize("NFC").trim();
export function discoveryState(route: DiscoveryRoute, query: Query, scopes: { sectors: string[]; themes: string[]; collections: string[] }) {
    const type = choice(query.type, TYPES, "all");
    const scope = (v: unknown, allowed: string[]) => typeof v === "string" && allowed.includes(v) ? v : "";
    const stockFilters = route === "/explore" && type === "stocks";
    return {
        level: choice(query.level, LEVELS, "simple"),
        horizon: route === "/explore" || route === "/stocks" ? choice(query.horizon, HORIZONS, "long") : "long" as const,
        q: route !== "/" && typeof query.q === "string" ? normalizeText(query.q) : "",
        type: route === "/explore" ? type : "all" as const,
        sector: route === "/explore" || route === "/stocks" ? scope(query.sector, scopes.sectors) : "",
        theme: route === "/explore" && (type === "stocks" || type === "all") ? scope(query.theme, scopes.themes) : "",
        collection: route === "/explore" && (type === "stocks" || type === "all") ? scope(query.collection, scopes.collections) : "",
        section: route === "/explore" ? choice(query.section, ["research", "changes", "sectors", "themes", "collections", "ipos"] as const, "research") : "research" as const,
        status: route === "/ipos" ? choice(query.status, STATUSES, "All") : "All" as const,
        picture: stockFilters ? choice(query.picture, FILTER_OPTIONS.picture, "Any") : "Any" as const,
        valuation: stockFilters ? choice(query.valuation, FILTER_OPTIONS.valuation, "Any") : "Any" as const,
        risk: stockFilters ? choice(query.risk, FILTER_OPTIONS.risk, "Any") : "Any" as const,
        change: stockFilters ? choice(query.change, FILTER_OPTIONS.change, "Any") : "Any" as const,
    };
}
export type DiscoveryState = ReturnType<typeof discoveryState>;
export function discoveryUrl(route: DiscoveryRoute, state: DiscoveryState, patch: Partial<DiscoveryState> = {}) {
    const s = { ...state, ...patch }, q = new URLSearchParams();
    if (s.level !== "simple") q.set("level", s.level);
    if (route === "/stocks" || route === "/explore") {
        if (s.horizon !== "long") q.set("horizon", s.horizon);
        if (s.sector) q.set("sector", s.sector);
    }
    if (route !== "/" && normalizeText(s.q)) q.set("q", normalizeText(s.q));
    if (route === "/ipos" && s.status !== "All") q.set("status", s.status);
    if (route === "/explore") {
        if (s.type !== "all") q.set("type", s.type);
        if (s.section !== "research") q.set("section", s.section);
        if (s.type === "stocks" || s.type === "all") {
            if (s.theme) q.set("theme", s.theme);
            if (s.collection) q.set("collection", s.collection);
        }
        if (s.type === "stocks") for (const key of FILTER_KEYS) if (s[key] !== "Any") q.set(key, s[key]);
    }
    return route + (q.size ? `?${q}` : "");
}
export const appliedCount = (state: DiscoveryState) => FILTER_KEYS.filter(k => state[k] !== "Any").length;

export interface Identity { id: string; kind: "stocks" | "ipos" | "sectors" | "themes"; name: string; symbol?: string; aliases: string[]; href: string }
export const compareText = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function matchIdentities<T extends Identity>(items: T[], query: string): T[] {
    const q = normalizeText(query).toLowerCase();
    const rank = (item: T) => {
        const names = [item.name, item.symbol ?? "", ...item.aliases].map(n => normalizeText(n).toLowerCase());
        return !q || names.includes(q) ? 0 : names.some(n => n.startsWith(q)) ? 1 : names.some(n => n.includes(q)) ? 2 : 3;
    };
    return items.map(item => ({ item, rank: rank(item) })).filter(r => r.rank < 3)
        .sort((a, b) => a.rank - b.rank || compareText(a.item.name, b.item.name) || compareText(a.item.kind, b.item.kind) || compareText(a.item.id, b.item.id)).map(r => r.item);
}
