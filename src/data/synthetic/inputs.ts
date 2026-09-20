import { D } from "../../domain/research/metrics";
import { addDays, sessions, START, END, timestamp } from "../../domain/research/calendar";
import type { Evidence, Financial, Issuer, Listing, Price } from "../../domain/research/types";
import { SEED } from "./spec";
import { UNIVERSE, SECTORS } from "./universe-spec";
import { OFFERS } from "./offer-spec";
import { hash, id } from "./identity";
export function buildInputs() {
    const sectors = SECTORS.map(s => ({ id: id("sector", s.key), name: s.name, slug: s.slug }));
    const sector = sectors[0];
    const issuers: Issuer[] = [], listings: Listing[] = [], financials: Financial[] = [], prices: Price[] = [], evidence: Evidence[] = [];
    for (const b of UNIVERSE) {
        const issuer: Issuer = { id: id("issuer", b.key), key: b.key, name: b.name, slug: b.slug, description: b.description, sectorId: id("sector", b.sector) };
        issuers.push(issuer);
        const listing: Listing | null = b.symbol && b.listedAt ? { id: id("listing", `${b.key}/ordinary`), issuerId: issuer.id, symbol: b.symbol, listedAt: b.listedAt } : null;
        if (listing) listings.push(listing);
        let cash = new D(b.openingCash), equity = new D("200000000");
        const quarters: Financial[] = [];
        for (let q = 0; q < 13; q++) {
            const start = new Date(Date.UTC(2023, 3 + q * 3, 1)).toISOString().slice(0, 10), end = new Date(Date.UTC(2023, 6 + q * 3, 0)).toISOString().slice(0, 10);
            const revenue = new D(b.revenues[q]).times(1000000);
            // Neralith's recent hiring gradually compresses margin and cash conversion.
            const compression = b.symbol === "NERALITH" && q >= 10 ? new D(q - 9).times("0.005") : ["SUDRAVA", "ROVANTA"].includes(b.symbol ?? "") ? new D(q).times("0.002") : new D(0);
            const recovery = b.symbol === "PARNEX" ? new D(q === 12 ? "0.17" : q >= 8 ? "0.02" : "0") : new D(0);
            const income = revenue.times(new D(b.netMargin).minus(compression).plus(recovery));
            const collectionFactor = b.symbol === "TALVESSA" ? new D(q % 2 ? "1.35" : "0.4") : b.symbol === "ROVANTA" ? new D(q % 2 ? "0.9" : "0.3") : new D(b.ocfFactor).minus(compression);
            const ocf = income.times(collectionFactor).toDecimalPlaces(2), capex = revenue.times(b.symbol === "MERUVAN" && q === 12 ? "0.5" : b.capexRate), openingCash = cash;
            const offer = OFFERS.find(o => o.issuerKey === b.key && o.actual);
            const issuance = offer && q === 12 ? new D(offer.fresh).times(offer.final!).minus(offer.expenses) : new D(0);
            const repayment = b.symbol === "DHARVEX" && q === 12 ? new D("60000000") : new D(0);
            const financing = issuance.minus(repayment), debt = new D(b.debt).minus(repayment);
            const endingShares = offer && q === 12 ? new D(b.shares).plus(offer.fresh).toFixed(0) : b.shares;
            // June has 58 pre-issuance days and 33 days including/after May 29.
            const weightedShares = offer && q === 12 ? new D(b.shares).times(58).plus(new D(endingShares).times(33)).div(91).toFixed(6) : b.shares;
            cash = cash.plus(ocf).minus(capex).plus(financing);
            equity = equity.plus(income).plus(issuance);
            const liabilities = debt.plus("40000000");
            const publication = b.symbol === "MERUVAN" && end === "2026-03-31" ? "2026-08-15" : b.symbol === "MERUVAN" && end === "2026-06-30" ? "2026-08-28" : b.sector === "s-3a7f" && end.endsWith("03-31") ? `${end.slice(0,4)}-06-15` : addDays(end, 45);
            quarters.push({ id: id("period", `${b.key}/quarterly/${start}/${end}`), issuerId: issuer.id, sourceId: id("evidence", `${b.key}/quarterly/${start}/${end}`), basis: "quarterly", start, end, publishedAt: timestamp(publication), currency: "INR", scope: "standalone",
                revenue: revenue.toFixed(2), ebit: revenue.times(new D(b.margin).minus(compression).plus(recovery)).toFixed(2), interest: b.interest, income: income.toFixed(2), weightedShares, assets: equity.plus(liabilities).toFixed(2), liabilities: liabilities.toFixed(2), equity: equity.toFixed(2), debt: repayment.eq(0) ? b.debt : debt.toFixed(2), cash: cash.toFixed(2), shares: endingShares, ocf: ocf.toFixed(2), investing: capex.negated().toFixed(2), financing: financing.toFixed(2), capex: capex.toFixed(2), openingCash: openingCash.toFixed(2), closingCash: cash.toFixed(2) });
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
        if (!listing) continue;
        evidence.push({ id: id("evidence", `${b.key}/announcement`), issuerId: issuer.id, kind: "document", documentType: "announcement", publisher: `${b.name} reporting desk`, title: `${b.name} business update — Simulated`, publishedAt: `${b.eventDate}T12:00:00+05:30`, body: `College Project · Simulated financial data\n${b.event}\nThis qualitative update does not revise already published financial statements.`, simulated: true });
        for (const role of ["article-A1", "article-A2"]) {
            const isEvent = role === "article-A1";
            evidence.push({ id: id("evidence", `${b.key}/${role}`), issuerId: issuer.id, kind: "article", documentType: null, publisher: "Ledger Grove Review", title: `${b.name}: ${isEvent ? "business update context" : "June reporting review"} — Simulated`, publishedAt: `${isEvent ? addDays(b.eventDate, 1) : "2026-08-15"}T12:00:00+05:30`, body: `College Project · Simulated financial data\n${isEvent ? b.event : `The June quarter report updates historical operating and cash-flow inputs for ${b.name}. Revenue recognition and operating cash receipts are distinct. ${b.description}`}\nThis original fictional article provides context, not independent verification or a measured explanation of price movement. Read the corresponding issuer ${isEvent ? "announcement" : "June 2026 report"} for the underlying evidence.`, simulated: true });
        }
        // The original three sources remain byte-identical regression records.
        if (b.sector !== "s-6f2a") {
            for (const source of evidence.filter(e => e.issuerId === issuer.id && e.kind === "article")) {
                source.publisher = b.sector === "s-1b9c" ? "Ledger Grove Review" : "Workshop Meridian";
                if (b.symbol === "MERUVAN" && source.id === id("evidence", `${b.key}/article-A2`)) source.publishedAt = "2026-08-31T12:00:00+05:30";
            }
        }
        if (b.symbol === "MERUVAN") {
            for (const source of evidence.filter(e => e.issuerId === issuer.id && e.documentType === "quarterly")) {
                source.body = source.body.replace("No splits, dividends, currency translation or share issuance in this modeled period.", "No splits, dividends or currency translation. Fresh shares on 2026-05-29 add net fresh proceeds to financing cash and equity; OFS transfers existing shares without company cash. June weighted shares use 58 pre-offer and 33 post-offer days. March 2026 and June 2026 discrete reports were delayed during reporting-package migration; annual statements were not restated.");
            }
        }
        let price = new D(b.basePrice);
        for (const [i, date] of sessions(listing.listedAt > START ? listing.listedAt : START, END).entries()) {
            if (i > 0) {
                const random = new D(BigInt(`0x${hash([SEED, listing.id, "close-variation", date, "0"].join("\0")).slice(0, 12)}`).toString()).div("281474976710656").minus("0.5");
                const drift = b.symbol === "TAVREN" ? "0.0005" : b.symbol === "NERALITH" ? (i < 400 ? "0.0012" : "-0.0002") : b.symbol === "ORYNTEL" ? (i < 430 ? "-0.0004" : "0") : b.drift;
                price = price.times(new D(1).plus(drift).plus(random.times(b.symbol === "NERALITH" ? "0.012" : ["TAVREN", "ORYNTEL"].includes(b.symbol!) ? "0.006" : b.variation)));
            }
            prices.push({ id: id("price", `${listing.id}/${date}`), listingId: listing.id, date, close: price.toFixed(2) });
        }
    }
    return { sector, sectors, issuers, listings, financials, prices, evidence };
}
export type Inputs = ReturnType<typeof buildInputs>;
