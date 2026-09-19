import { beforeEach, describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("../src/server/stock-repository", () => ({ readStock: vi.fn() }));
import { readStock } from "../src/server/stock-repository";
import { getStockOverview, stockContext } from "../src/server/stock-overview";
import { databaseUrl } from "../src/server/db/connection";
import { stockFixture } from "./stock-fixture";
beforeEach(() => { vi.resetAllMocks(); });
describe("server use case", () => {
    it("assembles canonical quote, scenarios and comparison", async () => { vi.mocked(readStock).mockResolvedValue(stockFixture()); const view = await getStockOverview("tavren"); expect(view.status).toBe("available"); if (view.status !== "available")
        throw new Error("Expected available"); expect(view.snapshot?.picture.value).toBe("Strong"); expect(view.changes.value?.from).toBe("2026-08-31"); expect(view.scenario?.value).toHaveLength(3); expect(view.daily).not.toBeNull(); expect(view.evidence.length).toBe(view.snapshot?.evidenceIds.length); });
    it("known issuer with missing snapshot remains unavailable", async () => { vi.mocked(readStock).mockResolvedValue({ ...stockFixture(), snapshot: null, previous: null, evidence: [], scenario: null, assumptions: [], quote: null, previousQuote: null }); expect((await getStockOverview("tavren")).status).toBe("research-unavailable"); });
    it("normalizes ambiguous URL inputs", () => expect(stockContext(["bad"], ["short"])).toEqual({ cutoff: "2026-09-30", horizon: "long" }));
    it("unknown symbol is not found", async () => { vi.mocked(readStock).mockResolvedValue(null); expect(await getStockOverview("unknown")).toEqual({ status: "not-found" }); });
    it("invalid route syntax never queries DB", async () => { expect(await getStockOverview("' OR 1=1")).toEqual({ status: "not-found" }); expect(readStock).not.toHaveBeenCalled(); });
    it("DB failures never expose details or replace data", async () => { const log = vi.spyOn(console, "error").mockImplementation(() => { }); vi.mocked(readStock).mockRejectedValue(new Error("private credential")); const result = await getStockOverview("tavren"); expect(result.status).toBe("data-unavailable"); expect(JSON.stringify(result)).not.toContain("private"); log.mockRestore(); });
    it("missing database configuration is explicit", () => { const original = process.env.DATABASE_URL; delete process.env.DATABASE_URL; try {
        expect(() => databaseUrl()).toThrow("DATABASE_NOT_CONFIGURED");
    }
    finally {
        if (original !== undefined)
            process.env.DATABASE_URL = original;
    } });
});
