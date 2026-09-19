import { D } from "../../domain/research/metrics";
export function number(value: string | null, unit = "") { return value === null ? "— Unavailable" : `${new D(value).toFixed(2)}${unit}`; }
export const money = (value: string | null) => value === null ? "— Unavailable" : `₹${new D(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
export const labels = { business: "Business Health", growth: "Growth Potential", financial: "Financial Health", picture: "Research Picture", risk: "Risk", confidence: "Evidence Confidence", valuation: "Price vs Value", direction: "Price Direction" };
type Tone = "strong" | "mixed" | "weak" | "unavailable";
const pillarTones = { Strong: "strong", Mixed: "mixed", Weak: "weak" } as const;
const statusTones: Record<keyof typeof labels, Readonly<Record<string, Tone>>> = {
    business: pillarTones, growth: pillarTones, financial: pillarTones, picture: pillarTones,
    risk: { Low: "strong", Medium: "mixed", High: "weak" },
    confidence: { High: "strong", Medium: "mixed", Low: "weak" },
    valuation: { Attractive: "strong", "In line": "unavailable", Expensive: "weak" },
    direction: { Up: "unavailable", Flat: "unavailable", Down: "unavailable" },
};
export function statusTone(context: keyof typeof labels, value: string | null): Tone {
    return value !== null && Object.hasOwn(statusTones[context], value) ? statusTones[context][value] : "unavailable";
}
export const meanings = {
    business: { Strong: "Profitability and operating cash both support the business.", Mixed: "The business has a mix of strengths and operating constraints.", Weak: "Profitability or operating cash shows a supported weakness." },
    growth: { Strong: "Revenue and per-share earnings meet the defined growth checks.", Mixed: "Growth evidence is mixed; stronger growth is not established.", Weak: "Revenue or per-share earnings has weakened under the research rules." },
    financial: { Strong: "Borrowing and cash generation meet the financial-strength checks.", Mixed: "Borrowing, interest or investment needs create trade-offs.", Weak: "The balance sheet or operating cash shows a supported funding concern." },
};
