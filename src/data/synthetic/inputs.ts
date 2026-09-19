import { D } from "../../domain/research/metrics";
import { addDays, sessions, START, END, timestamp } from "../../domain/research/calendar";
import type { Evidence, Financial, Issuer, Listing, Price } from "../../domain/research/types";
import { BUSINESSES, SECTOR, SEED } from "./spec";
import { hash, id } from "./identity";
export function buildInputs() {
    const sector = { id: id("sector", SECTOR.key), name: SECTOR.name, slug: SECTOR.slug };
    const issuers: Issuer[] = [], listings: Listing[] = [], financials: Financial[] = [], prices: Price[] = [], evidence: Evidence[] = [];
    for (const b of BUSINESSES) {
        const issuer: Issuer = { id: id("issuer", b.key), key: b.key, name: b.name, slug: b.slug, description: b.description, sectorId: sector.id };
        issuers.push(issuer);
        const listing: Listing = { id: id("listing", `${b.key}/ordinary`), issuerId: issuer.id, symbol: b.symbol, listedAt: b.listedAt };
        listings.push(listing);
        let cash = new D("20000000"), equity = new D("200000000");
        const quarters: Financial[] = [];
        for (let q = 0; q < 13; q++) {
            const start = new Date(Date.UTC(2023, 3 + q * 3, 1)).toISOString().slice(0, 10), end = new Date(Date.UTC(2023, 6 + q * 3, 0)).toISOString().slice(0, 10);
            const revenue = new D(b.revenues[q]).times(1000000);
            // Neralith's recent hiring gradually compresses margin and cash conversion.
            const compression = b.symbol === "NERALITH" && q >= 10 ? new D(q - 9).times("0.005") : new D(0);
            const income = revenue.times(new D(b.netMargin).minus(compression)), ocf = income.times(new D(b.ocfFactor).minus(compression)), capex = revenue.times(b.capexRate), openingCash = cash;
            cash = cash.plus(ocf).minus(capex);
            equity = equity.plus(income);
            const liabilities = new D(b.debt).plus("40000000");
            quarters.push({ id: id("period", `${b.key}/quarterly/${start}/${end}`), issuerId: issuer.id, sourceId: id("evidence", `${b.key}/quarterly/${start}/${end}`), basis: "quarterly", start, end, publishedAt: timestamp(addDays(end, 45)), currency: "INR", scope: "standalone",
                revenue: revenue.toFixed(2), ebit: revenue.times(new D(b.margin).minus(compression)).toFixed(2), interest: b.interest, income: income.toFixed(2), weightedShares: b.shares, assets: equity.plus(liabilities).toFixed(2), liabilities: liabilities.toFixed(2), equity: equity.toFixed(2), debt: b.debt, cash: cash.toFixed(2), shares: b.shares, ocf: ocf.toFixed(2), investing: capex.negated().toFixed(2), financing: "0.00", capex: capex.toFixed(2), openingCash: openingCash.toFixed(2), closingCash: cash.toFixed(2) });
        }
        const reports: Financial[] = [...quarters.slice(5)];
        for (let y = 0; y < 3; y++) {
            const qs = quarters.slice(y * 4, y * 4 + 4), last = qs[3], start = qs[0].start, end = last.end;
            const total = (field: "revenue" | "ebit" | "interest" | "income" | "ocf" | "investing" | "financing" | "capex") => qs.reduce((s, q) => s.plus(q[field]), new D(0)).toFixed(2);
            reports.push({ ...last, id: id("period", `${b.key}/annual/${start}/${end}`), sourceId: id("evidence", `${b.key}/annual/${start}/${end}`), basis: "annual", start, end, publishedAt: timestamp(`${2024 + y}-06-15`), revenue: total("revenue"), ebit: total("ebit"), interest: total("interest"), income: total("income"), ocf: total("ocf"), investing: total("investing"), financing: total("financing"), capex: total("capex"), openingCash: qs[0].openingCash });
        }
        financials.push(...reports);
        for (const r of reports)
            evidence.push({ id: r.sourceId, issuerId: issuer.id, kind: "document", documentType: r.basis, publisher: `${b.name} reporting desk`, title: `${b.name} ${r.basis === "annual" ? "Annual" : "Quarterly"} Report — ${r.end} — Simulated`, publishedAt: r.publishedAt, simulated: true,
                body: `College Project · Simulated financial data\n${b.description}\nReporting period: ${r.start} to ${r.end}. INR whole units; standalone ordinary shares.\nIncome statement: revenue ${r.revenue}; operating profit ${r.ebit}; finance interest ${r.interest}; ordinary net income ${r.income}; weighted average shares ${r.weightedShares}.\nBalance sheet: assets ${r.assets}; liabilities ${r.liabilities}; equity ${r.equity}; interest-bearing debt ${r.debt}; cash ${r.cash}; ending shares ${r.shares}.\nCash flow: opening cash ${r.openingCash}; operating ${r.ocf}; investing ${r.investing}; financing ${r.financing}; closing cash ${r.closingCash}. Capital expenditure outflow ${r.capex} is included in investing cash flow.\nNo splits, dividends, currency translation or share issuance in this modeled period. Earlier opening balances are explicit synthetic report inputs. Numerical observations support calculations, not a forecast.` });
        evidence.push({ id: id("evidence", `${b.key}/announcement`), issuerId: issuer.id, kind: "document", documentType: "announcement", publisher: `${b.name} reporting desk`, title: `${b.name} business update — Simulated`, publishedAt: `${b.eventDate}T12:00:00+05:30`, body: `College Project · Simulated financial data\n${b.event}\nThis qualitative update does not revise already published financial statements.`, simulated: true });
        for (const role of ["article-A1", "article-A2"]) {
            const isEvent = role === "article-A1";
            evidence.push({ id: id("evidence", `${b.key}/${role}`), issuerId: issuer.id, kind: "article", documentType: null, publisher: "Ledger Grove Review", title: `${b.name}: ${isEvent ? "business update context" : "June reporting review"} — Simulated`, publishedAt: `${isEvent ? addDays(b.eventDate, 1) : "2026-08-15"}T12:00:00+05:30`, body: `College Project · Simulated financial data\n${isEvent ? b.event : `The June quarter report updates historical operating and cash-flow inputs for ${b.name}. Revenue recognition and operating cash receipts are distinct. ${b.description}`}\nThis original fictional article provides context, not independent verification or a measured explanation of price movement. Read the corresponding issuer ${isEvent ? "announcement" : "June 2026 report"} for the underlying evidence.`, simulated: true });
        }
        let price = new D(b.basePrice);
        for (const [i, date] of sessions(START, END).entries()) {
            if (i > 0) {
                const random = new D(BigInt(`0x${hash([SEED, listing.id, "close-variation", date, "0"].join("\0")).slice(0, 12)}`).toString()).div("281474976710656").minus("0.5");
                const drift = b.symbol === "TAVREN" ? "0.0005" : b.symbol === "NERALITH" ? (i < 400 ? "0.0012" : "-0.0002") : (i < 430 ? "-0.0004" : "0");
                price = price.times(new D(1).plus(drift).plus(random.times(b.symbol === "NERALITH" ? "0.012" : "0.006")));
            }
            prices.push({ id: id("price", `${listing.id}/${date}`), listingId: listing.id, date, close: price.toFixed(2) });
        }
    }
    return { sector, issuers, listings, financials, prices, evidence };
}
export type Inputs = ReturnType<typeof buildInputs>;
