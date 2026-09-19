import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StockOverview } from "../src/features/stock/overview";
import { stockFixture } from "./stock-fixture";
import { whatChanged } from "../src/domain/research/changes";
describe("bounded Overview rendering", () => {
    it("renders sources and functioning form semantics without unfinished controls", () => {
        const data = stockFixture();
        const markup = renderToStaticMarkup(<StockOverview data={{ ...data, status: "available", context: { cutoff: "2026-09-30", horizon: "long" }, daily: null, changes: whatChanged(data.previous, data.snapshot!) }}/>);
        expect(markup).toContain("College Project · Simulated financial data");
        expect(markup).toContain('action="/stocks/tavren"');
        expect(markup).toContain('name="horizon"');
        expect(markup).toContain('name="cutoff"');
        expect(markup).toContain("<dialog");
        expect(markup).toContain("aria-labelledby=");
        expect(markup).toContain(data.evidence[0].title);
        expect(markup).not.toContain('href="#"');
        expect(markup).not.toMatch(/Share|Ask AI|Start Decision|DATABASE_URL/);
        expect(markup).toContain("Unavailable");
    });
});
