import { ipoUrl } from "../ipo/state";
import type { DiscoveryRecords } from "../../server/discovery-repository";
import { marketIndex } from "../../domain/research/market";
import { whatChanged, type ChangeSet } from "../../domain/research/changes";
import { offerTerms } from "../../domain/ipo/terms";
import { meanings } from "../stock/format";
import { stockState, stockUrl } from "../stock/state";
import { compareText, discoveryUrl, matchIdentities, type DiscoveryState, type Identity } from "./state";

export function recentChange(changes: ChangeSet | null): DiscoveryState["change"] {
    if (!changes) return "Newly available/Unavailable";
    const picture = changes.categories.find(c => c.field === "picture");
    if (!picture || picture.state === "Unavailable" || picture.state === "Newly available") return "Newly available/Unavailable";
    if (picture.state === "Improved") return "Improving";
    if (picture.state === "Weakened") return "Weakening";
    const risk = changes.categories.find(c => c.field === "risk");
    if (!risk || risk.before === null || risk.after === null) return "Newly available/Unavailable";
    const ranks = ["Low", "Medium", "High"];
    return ranks.indexOf(risk.after) < ranks.indexOf(risk.before) ? "Improving" : ranks.indexOf(risk.after) > ranks.indexOf(risk.before) ? "Weakening" : "Unchanged";
}
export function buildDiscovery(records: DiscoveryRecords, state: DiscoveryState) {
    const { cutoff } = records;
    const stocks = records.listings.map(listing => {
        const issuer = records.issuers.find(i => i.id === listing.issuerId);
        const sector = records.sectors.find(s => s.id === issuer?.sectorId);
        if (!issuer || !sector) throw new Error("INVALID_MEMBERSHIP");
        const data = records.stocks.find(s => s?.listing.id === listing.id);
        const snapshot = data?.snapshot ?? null;
        const changes = snapshot ? whatChanged(data?.previous ?? null, snapshot).value : null;
        const positive = snapshot?.findings.find(f => f.kind === "positive" && f.evidenceIds.length);
        const caution = snapshot?.findings.find(f => f.kind !== "positive" && f.evidenceIds.length);
        const meaning = (f: typeof positive) => f && snapshot?.[f.field].value ? meanings[f.field][snapshot[f.field].value!] : null;
        const worthy = !!snapshot && ["Strong", "Mixed"].includes(snapshot.picture.value ?? "") && ["Low", "Medium"].includes(snapshot.risk.value ?? "") && ["Medium", "High"].includes(snapshot.confidence.value ?? "") && !!positive && !!caution;
        return { id: listing.id, kind: "stocks" as const, name: issuer.name, symbol: listing.symbol, aliases: [] as string[], href: stockUrl(listing.symbol, stockState({ level: state.level, horizon: state.horizon })), description: issuer.description, issuerId: issuer.id, sector, snapshot, changes, change: recentChange(changes), worthy, reason: meaning(positive), caution: meaning(caution), themes: records.themeMembers.filter(m => m.listingId === listing.id).map(m => m.themeId), collections: records.collectionMembers.filter(m => m.listingId === listing.id).map(m => m.collectionId) };
    }).sort((a, b) => compareText(a.name, b.name));
    const dates = records.sessions.map(s => s.date);
    const market = marketIndex(records.listings, records.prices, dates).at(-1) ?? null;
    const sectors = records.sectors.map(sector => {
        const members = stocks.filter(s => s.sector.id === sector.id);
        const counts = { Strong: 0, Mixed: 0, Weak: 0, Unavailable: 0 };
        for (const stock of members) counts[stock.snapshot?.picture.value ?? "Unavailable"]++;
        const majority = (["Strong", "Mixed", "Weak"] as const).find(k => counts[k] > members.length / 2);
        const picture = !members.length || counts.Unavailable ? null : majority ?? "Mixed";
        const ids = members.map(s => s.id);
        return { ...sector, kind: "sectors" as const, aliases: [], href: discoveryUrl("/explore", state, { type: "stocks", sector: sector.slug, q: "", theme: "", collection: "", section: "research" }), members, counts, picture, context: records.events.filter(e => e.kind === "market-sector" && e.sectorId === sector.id), market: marketIndex(records.listings.filter(l => ids.includes(l.id)), records.prices, dates).at(-1) ?? null };
    }).sort((a, b) => compareText(a.name, b.name));
    const themes = records.themes.map(theme => ({ ...theme, kind: "themes" as const, aliases: [], href: discoveryUrl("/explore", state, { type: "stocks", theme: theme.slug, collection: "", sector: "", q: "", section: "research" }), members: records.themeMembers.filter(m => m.themeId === theme.id).map(m => ({ ...m, stock: stocks.find(s => s.id === m.listingId)! })) }));
    const collections = records.collections.map(collection => ({ ...collection, href: discoveryUrl("/explore", state, { type: "stocks", collection: collection.slug, theme: "", sector: "", q: "", section: "research" }), members: records.collectionMembers.filter(m => m.collectionId === collection.id).map(m => ({ ...m, stock: stocks.find(s => s.id === m.listingId)! })) }));
    const publications = new Map(records.sources.map(s => [s.id, s.publishedAt]));
    const ipos = records.offers.map(offer => {
        const issuer = records.issuers.find(i => i.id === offer.issuerId);
        if (!issuer) throw new Error("INVALID_OFFER_ISSUER");
        const terms = offerTerms({ ...offer, holders: [], proceeds: [], reservations: [], subscriptions: [] }, records.referenceAt, publications).value;
        return { ...offer, kind: "ipos" as const, name: issuer.name, description: issuer.description, sectorId: issuer.sectorId, aliases: [] as string[], terms, sources: records.sources.filter(s => s.id === offer.sourceId || s.id === offer.lifecycleId), href: ipoUrl(offer.slug, state.level) };
    }).sort((a, b) => compareText(a.opensAt, b.opensAt) || compareText(a.name, b.name));
    const identities: Identity[] = [...stocks, ...ipos, ...sectors, ...themes].map(({ id, kind, name, aliases, href }) => ({ id, kind, name, aliases, href, symbol: stocks.find(s => s.id === id)?.symbol }));
    return { dataset: records.dataset, cutoff, market, stocks, sectors, themes, collections, ipos, identities, events: records.events.filter(e => e.kind === "market-sector").sort((a, b) => compareText(b.publishedAt, a.publishedAt)), sources: records.sources };
}
export type DiscoveryModel = ReturnType<typeof buildDiscovery>;
export type DiscoveryStock = DiscoveryModel["stocks"][number];
export function selectDiscovery(data: DiscoveryModel, state: DiscoveryState) {
    const theme = data.themes.find(t => t.slug === state.theme), collection = data.collections.find(c => c.slug === state.collection);
    const stocks = matchIdentities(data.stocks.filter(s => (!state.sector || s.sector.slug === state.sector) && (!theme || s.themes.includes(theme.id)) && (!collection || s.collections.includes(collection.id)) && (state.type !== "stocks" || ((state.picture === "Any" || s.snapshot?.picture.value === state.picture) && (state.valuation === "Any" || s.snapshot?.valuation.value === state.valuation) && (state.risk === "Any" || s.snapshot?.risk.value === state.risk) && (state.change === "Any" || s.change === state.change)))), state.q);
    const sectors = matchIdentities(data.sectors.filter(s => !state.sector || s.slug === state.sector), state.q);
    const themes = matchIdentities(data.themes.filter(t => !state.sector || t.members.some(m => m.stock.sector.slug === state.sector)), state.q);
    const sectorId = data.sectors.find(s => s.slug === state.sector)?.id;
    const ipos = matchIdentities(data.ipos.filter(i => (!sectorId || i.sectorId === sectorId) && (state.status === "All" || i.terms?.status === state.status)), state.q).sort((a, b) => compareText(a.opensAt, b.opensAt) || compareText(a.name, b.name));
    return { stocks, sectors, themes, ipos };
}
