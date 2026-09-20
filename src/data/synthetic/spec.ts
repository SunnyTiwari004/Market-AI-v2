// Reviewed input intentions: amounts are INR; profits/cash precede any assessment.
// Original three-company inputs are retained as regression fixtures.
export const DATASET = "market-ai-synthetic-v1";
export const METHOD = "research-method-v1";
export const GENERATOR = "full-universe-generator-v1";
export const SEED = "mai-world-20260930-a";
export const SECTOR = { key: "s-6f2a", name: "Digital Operations Services", slug: "digital-operations-services" };
export const BUSINESSES = [
    { key: "i-7d2a", name: "Tavren Systems Limited", slug: "tavren-systems", symbol: "TAVREN", listedAt: "2020-06-01", description: "Runs contract-based software operations, earning recurring service and implementation fees.",
        revenues: ["90", "93", "96", "99", "103", "107", "111", "115", "120", "125", "130", "135", "140"], margin: "0.20", netMargin: "0.14", ocfFactor: "1.15", capexRate: "0.03", debt: "20000000", interest: "500000", shares: "10000000", basePrice: "180", eventDate: "2026-07-10", event: "A multi-year software operations contract was renewed. Delivery obligations remain; future receipts are not current revenue.", scenario: [['-0.08', '0.85'], ['0', '1'], ['0.08', '1.12']] },
    { key: "i-c4b8", name: "Neralith Digital Limited", slug: "neralith-digital", symbol: "NERALITH", listedAt: "2022-04-04", description: "Builds configurable workflow deployments, earning project fees followed by support subscriptions.",
        revenues: ["40", "44", "48", "52", "58", "64", "70", "76", "84", "92", "100", "108", "116"], margin: "0.18", netMargin: "0.12", ocfFactor: "0.90", capexRate: "0.05", debt: "15000000", interest: "400000", shares: "8000000", basePrice: "210", eventDate: "2026-09-04", event: "Additional implementation hiring supports a growing pipeline. Delivery costs require monitoring; no future contract income is recognized.", scenario: [['-0.12', '0.80'], ['0.02', '1'], ['0.12', '1.15']] },
    { key: "i-2e9f", name: "Oryntel Services Limited", slug: "oryntel-services", symbol: "ORYNTEL", listedAt: "2019-07-01", description: "Maintains older business applications on renewable support contracts.",
        revenues: ["100", "99", "98", "97", "96", "94", "92", "90", "88", "86", "84", "82", "80"], margin: "0.16", netMargin: "0.10", ocfFactor: "1.25", capexRate: "0.02", debt: "30000000", interest: "800000", shares: "10000000", basePrice: "130", eventDate: "2026-07-16", event: "A support contract renewed with a narrower service scope. Cash collections remain separate from the declining scope of future work.", scenario: [['-0.15', '0.85'], ['-0.03', '1'], ['0.03', '1.08']] },
] as const;
