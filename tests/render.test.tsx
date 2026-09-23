import { describe, it, expect, vi } from "vitest";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }), usePathname: () => "/stocks/tavren", useSearchParams: () => new URLSearchParams() }));
import { renderToStaticMarkup } from "react-dom/server";
import { StockOverview } from "../src/features/stock/overview";
import { StockShell } from "../src/features/stock/shell";
import { stockState } from "../src/features/stock/state";
import { stockFixture } from "./stock-fixture";
import { whatChanged } from "../src/domain/research/changes";
describe("bounded Overview rendering", () => {
    it("renders sources and functioning form semantics without unfinished controls", () => {
        const data = stockFixture();
        const model = { ...data, status: "available" as const, context: { cutoff: "2026-09-30", horizon: "long" as const }, daily: null, changes: whatChanged(data.previous, data.snapshot!) };
        const markup = renderToStaticMarkup(<StockShell data={model} state={stockState({})}><StockOverview data={model}/></StockShell>);
        expect(markup).toContain("College Project · Simulated financial data");
        expect(markup).toContain('href="/stocks/tavren"');
        expect(markup).toContain('name="horizon"');
        expect(markup).toContain('name="cutoff"');
        expect(markup).toContain("<dialog");
        expect(markup).toContain("aria-labelledby=");
        expect(markup).toContain(data.evidence[0].title);
        expect(markup).not.toContain('href="#"');
        expect(markup).toContain("Share");
        expect(markup).not.toMatch(/Ask AI|Start Decision|DATABASE_URL/);
        expect(markup).toContain("Unavailable");
    });
});
