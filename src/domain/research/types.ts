export const HORIZONS = ["short", "medium", "long"] as const;
export type Horizon = (typeof HORIZONS)[number];
export type Availability = "available" | "partial" | "unavailable" | "not-applicable";
export type Pillar = "Strong" | "Mixed" | "Weak";
export type Risk = "Low" | "Medium" | "High";
export type ValuePosition = "Attractive" | "In line" | "Expensive";
export type Direction = "Up" | "Flat" | "Down";
export interface Result<T> {
    value: T | null;
    availability: Availability;
    reasons: string[];
}
export const result = <T>(value: T): Result<T> => ({ value, availability: "available", reasons: [] });
export const unavailable = <T>(reason: string): Result<T> => ({ value: null, availability: "unavailable", reasons: [reason] });
export interface Financial {
    id: string;
    issuerId: string;
    sourceId: string;
    basis: "annual" | "quarterly";
    start: string;
    end: string;
    publishedAt: string;
    currency: "INR";
    scope: "standalone";
    revenue: string;
    ebit: string;
    interest: string;
    income: string;
    weightedShares: string;
    assets: string;
    liabilities: string;
    equity: string;
    debt: string;
    cash: string;
    shares: string;
    ocf: string;
    investing: string;
    financing: string;
    capex: string;
    openingCash: string;
    closingCash: string;
}
export interface Issuer {
    id: string;
    key: string;
    name: string;
    slug: string;
    description: string;
    sectorId: string;
}
export interface Listing {
    id: string;
    issuerId: string;
    symbol: string;
    listedAt: string;
}
export interface Price {
    id: string;
    listingId: string;
    date: string;
    close: string;
}
export interface Evidence {
    id: string;
    issuerId: string;
    kind: "document" | "article";
    title: string;
    publishedAt: string;
    body: string;
    publisher: string;
    simulated: true;
    documentType: "annual" | "quarterly" | "announcement" | null;
}
export interface Assumption {
    id: string;
    listingId: string;
    cutoff: string;
    dataset: string;
    method: string;
    days: 30;
    cases: {
        label: "Weak" | "Base" | "Strong";
        g: string;
        m: string;
        rationale: string;
        evidenceIds: string[];
    }[];
}
export interface ScenarioOutput {
    label: "Weak" | "Base" | "Strong";
    price: string;
    change: string;
}
export interface ScenarioSet {
    id: string;
    assumptionId: string;
    listingId: string;
    cutoff: string;
    result: Result<ScenarioOutput[]>;
}
export interface Finding {
    key: string;
    kind: "positive" | "caution" | "neutral";
    field: "business" | "growth" | "financial";
    evidenceIds: string[];
}
export interface Snapshot {
    id: string;
    issuerId: string;
    listingId: string;
    dataset: string;
    method: string;
    cutoff: string;
    session: string;
    horizon: Horizon;
    basis: "INR/standalone/unadjusted/weekday-calendar-v1/30-days";
    annualEnd: string | null;
    ttmEnd: string | null;
    metrics: Record<"revenueGrowth" | "cagr" | "eps" | "epsGrowth" | "margin" | "cashConversion" | "fcf" | "debtEquity" | "coverage" | "volatility" | "drawdown" | "ttmEps" | "pe" | "peerMedian" | "valuationRatio" | "return20" | "return60" | "return252", Result<string>>;
    business: Result<Pillar>;
    growth: Result<Pillar>;
    financial: Result<Pillar>;
    risk: Result<Risk>;
    valuation: Result<ValuePosition>;
    direction: Result<Direction>;
    picture: Result<Pillar>;
    confidence: Result<Risk>;
    earningsState: string;
    scenarioId: string;
    findings: Finding[];
    evidenceIds: string[];
    financialIds: string[];
    priceIds: string[];
    peerIds: string[];
}
