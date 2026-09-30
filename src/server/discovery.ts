import "server-only";
import { readDiscovery } from "./discovery-repository";
import { buildDiscovery } from "../features/discovery/model";
import { discoveryState, discoveryUrl, type DiscoveryRoute, type Query } from "../features/discovery/state";
export async function getDiscovery(route: DiscoveryRoute, query: Query) {
    const preliminary = discoveryState(route, query, { sectors: [], themes: [], collections: [] });
    try {
        const records = await readDiscovery(preliminary.horizon);
        const state = discoveryState(route, query, { sectors: records.sectors.map(s => s.slug), themes: records.themes.map(s => s.slug), collections: records.collections.map(s => s.slug) });
        const canonicalUrl = discoveryUrl(route, state);
        const accepted = new URL(canonicalUrl, "https://market-ai.invalid").searchParams;
        const invalid = Object.entries(query).some(([key, value]) => Array.isArray(value) || (value !== undefined && accepted.get(key) !== value && !(["simple", "long", "all", "All", "Any", "research", ""].includes(value) && !accepted.has(key))));
        return { status: "available" as const, state, canonicalUrl, invalid, data: buildDiscovery(records, state) };
    } catch {
        console.error("Discovery read failed", { operation: "discovery", code: "DATA_UNAVAILABLE" });
        return { status: "data-unavailable" as const };
    }
}
