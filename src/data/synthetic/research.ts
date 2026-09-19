import { CUTOFFS, cutoffSession, daysBetween, sessions, START, timestamp } from "../../domain/research/calendar";
import { annuals, cagr, decimal as d, debtEquity, earnings, eps, freeCashFlow, growth, interestCoverage, margin, cashConversion, periodReturn, priceRisk, serialize, ttm } from "../../domain/research/metrics";
import { businessHealth, growthPotential, financialHealth, risk, direction, valuation, confidence, scenarios, researchPicture, serializedCoverage } from "../../domain/research/assessments";
import { HORIZONS, type Assumption, type ScenarioSet, type Snapshot } from "../../domain/research/types";
import type { Inputs } from "./inputs";
import { id } from "./identity";
import { DATASET, METHOD, BUSINESSES } from "./spec";
export function buildResearch(input: Inputs) {
    const assumptions: Assumption[] = [], scenarioSets: ScenarioSet[] = [], snapshots: Snapshot[] = [];
    for (const cutoff of CUTOFFS) {
        const session = cutoffSession(cutoff);
        const contexts = input.listings.map(listing => {
            const issuer = input.issuers.find(i => i.id === listing.issuerId)!;
            const periods = input.financials.filter(p => p.issuerId === issuer.id), a = annuals(periods, cutoff), trailing = ttm(periods, cutoff);
            const prices = input.prices.filter(p => p.listingId === listing.id && p.date <= session);
            return { listing, issuer, periods, a, trailing, prices, valuation: { id: listing.id, sectorId: issuer.sectorId, eps: trailing.eps, window: trailing.key, session, close: d(prices.find(p => p.date === session)?.close), listed: listing.listedAt <= session } };
        });
        for (const c of contexts) {
            const a = c.a[0], prior = c.a[1], fresh = !!a && daysBetween(a.end, cutoff) <= 550;
            const field = (name: keyof typeof a) => fresh ? d(a[name]) : null;
            const fin = { debt: field("debt"), equity: field("equity"), ebit: field("ebit"), interest: field("interest"), income: field("income"), ocf: field("ocf"), capex: field("capex") };
            const currentEps = eps(fin.income, field("weightedShares")), previousEps = prior ? eps(d(prior.income), d(prior.weightedShares)) : null;
            const progression = earnings(currentEps, previousEps), revGrowth = fresh && prior ? growth(field("revenue"), d(prior.revenue)) : null, revenueCagr = fresh ? cagr(c.a) : null;
            const business = businessHealth(field("revenue"), fin.ebit, fin.income, fin.ocf), growthResult = growthPotential(revGrowth, revenueCagr, progression), financial = financialHealth(fin);
            const pr = priceRisk(c.prices, cutoff), riskResult = risk(fin, pr.volatility, pr.drawdown), v = valuation(c.valuation, contexts.map(x => x.valuation));
            const visible = input.evidence.filter(e => e.issuerId === c.issuer.id && Date.parse(e.publishedAt) <= Date.parse(timestamp(cutoff)));
            const peerPeriods = contexts.filter(x => x.listing.id !== c.listing.id).flatMap(x => x.trailing.periods);
            const ownPeriods = c.periods.filter(p => Date.parse(p.publishedAt) <= Date.parse(timestamp(cutoff)));
            const evidenceIds = [...new Set([...visible.map(e => e.id), ...peerPeriods.map(p => p.sourceId)])].sort();
            const completePrices = c.prices.length === sessions(START, session).length && c.prices.every(p => d(p.close)?.gt(0));
            const conf = confidence([evidenceIds.every(key => input.evidence.some(e => e.id === key)), ownPeriods.filter(p => p.basis === "annual").length === 3 && ownPeriods.filter(p => p.basis === "quarterly").length === 8, fresh && daysBetween(c.trailing.periods.at(-1)?.end ?? "1900-01-01", cutoff) <= 200, completePrices, evidenceIds.every(key => !!input.evidence.find(e => e.id === key)?.body.trim())], visible.length > 0);
            const b = BUSINESSES.find(x => x.key === c.issuer.key)!;
            const assumption: Assumption = { id: id("assumption", `${c.listing.id}/${cutoff}/${METHOD}`), listingId: c.listing.id, cutoff, dataset: DATASET, method: METHOD, days: 30, cases: b.scenario.map(([g, m], i) => ({ label: (["Weak", "Base", "Strong"] as const)[i], g, m, rationale: `Authored educational assumption: ${["earnings pressure and peer-multiple compression", "broadly stable operating conditions and peer multiples", "improved earnings conditions and a higher peer multiple"][i]}. ${b.description} This sensitivity is not a predicted report or probability.`, evidenceIds: a ? [a.sourceId] : [] })) };
            assumptions.push(assumption);
            const scenario: ScenarioSet = { id: id("scenario", `${c.listing.id}/${cutoff}/${METHOD}`), listingId: c.listing.id, cutoff, assumptionId: assumption.id, result: scenarios(assumption, { listingId: c.listing.id, cutoff, dataset: DATASET, method: METHOD }, c.trailing.eps, v.median, c.valuation.close, v.eligible.length) };
            scenarioSets.push(scenario);
            const r20 = periodReturn(c.prices, cutoff, 20), r60 = periodReturn(c.prices, cutoff, 60), r252 = periodReturn(c.prices, cutoff, 252);
            for (const horizon of HORIZONS) {
                const dir = direction(horizon === "short" ? r20 : horizon === "medium" ? r60 : r252);
                const findings = ([['business', business], ['growth', growthResult], ['financial', financial]] as const).map(([field, value]) => ({ key: field, field, kind: value.value === "Strong" ? "positive" as const : value.value === "Weak" || value.availability !== "available" ? "caution" as const : "neutral" as const, evidenceIds: field === "growth" ? c.a.slice(0, 3).map(p => p.sourceId) : a ? [a.sourceId] : [] }));
                snapshots.push({ id: id("snapshot", `${c.listing.id}/${cutoff}/${horizon}/${METHOD}`), listingId: c.listing.id, issuerId: c.issuer.id, dataset: DATASET, method: METHOD, cutoff, session, horizon, basis: "INR/standalone/unadjusted/weekday-calendar-v1/30-days", annualEnd: a?.end ?? null, ttmEnd: c.trailing.periods.at(-1)?.end ?? null,
                    metrics: { revenueGrowth: serialize(revGrowth), cagr: serialize(revenueCagr), eps: serialize(currentEps), epsGrowth: serialize(progression.growth, "EARNINGS_STATE_NO_PERCENTAGE"), margin: serialize(margin(fin.ebit, field("revenue"))), cashConversion: serialize(cashConversion(fin.ocf, fin.income)), fcf: serialize(freeCashFlow(fin.ocf, fin.capex)), debtEquity: serialize(debtEquity(fin.debt, fin.equity)), coverage: serializedCoverage(interestCoverage(fin.ebit, fin.interest, fin.debt)), volatility: serialize(pr.volatility), drawdown: serialize(pr.drawdown), ttmEps: serialize(c.trailing.eps, c.trailing.reason ?? undefined), pe: serialize(v.pe), peerMedian: serialize(v.median), valuationRatio: serialize(v.ratio), return20: serialize(r20), return60: serialize(r60), return252: serialize(r252) },
                    business, growth: growthResult, financial, risk: riskResult, valuation: v.assessment, direction: dir, picture: researchPicture(horizon, business, growthResult, financial, riskResult, dir, v.assessment), confidence: conf, earningsState: progression.state, scenarioId: scenario.id, findings, evidenceIds,
                    financialIds: [...new Set([...ownPeriods, ...peerPeriods].map(p => p.id))].sort(), priceIds: [...c.prices.map(p => p.id), ...contexts.filter(x => x.listing.id !== c.listing.id).flatMap(x => x.prices.filter(p => p.date === session).map(p => p.id))].sort(), peerIds: contexts.filter(x => x.listing.id !== c.listing.id).map(x => x.listing.id).sort() });
            }
        }
    }
    return { assumptions, scenarioSets, snapshots };
}
