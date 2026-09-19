import { describe, expect, it } from "vitest";
import { previousSession, cutoffSession } from "../src/domain/research/calendar";
import { digest, id } from "../src/data/synthetic/identity";
import { buildSlice } from "../src/data/synthetic/build";
import { valuation } from "../src/domain/research/assessments";
import { D } from "../src/domain/research/metrics";
import { statusTone } from "../src/features/stock/format";
import { assertIdenticalPublishedDataset } from "../src/server/db/seed-policy";

describe("completion audit", () => {
    it("rejects conflicting or unpublished seed replay without database mutation",()=>{
        expect(()=>assertIdenticalPublishedDataset({digest:"same",published:true},"same")).not.toThrow();
        expect(()=>assertIdenticalPublishedDataset({digest:"other",published:true},"same")).toThrow("IMMUTABLE_DATASET_CONFLICT");
        expect(()=>assertIdenticalPublishedDataset({digest:"same",published:false},"same")).toThrow("IMMUTABLE_DATASET_CONFLICT");
    });
    it.each([
        ["2026-09-29", "2026-09-28"],
        ["2026-08-31", "2026-08-28"],
        ["2026-08-01", "2026-07-30"],
    ])("previous quote for cutoff %s uses %s", (cutoff, expected) => {
        expect(previousSession(cutoffSession(cutoff))).toBe(expected);
    });

    it("canonicalizes object keys while preserving intentional collection order", () => {
        expect(digest({ b: [{ y: 2, x: 1 }], a: 0 })).toBe(digest({ a: 0, b: [{ x: 1, y: 2 }] }));
        expect(digest(["Weak", "Base", "Strong"])).not.toBe(digest(["Strong", "Base", "Weak"]));
        expect(id("issuer", "i-7d2a")).toBe(id("issuer", "i-7d2a"));
        expect(id("issuer", "i-7d2a")).not.toBe(id("listing", "i-7d2a"));
    });
    it("rebuilds identical content and detects an actual observation change", () => {
        const first = buildSlice(), second = buildSlice();
        expect(second).toEqual(first);
        second.prices[0].close = new D(second.prices[0].close).plus("0.01").toFixed(2);
        expect(digest(second.prices)).not.toBe(digest(first.prices));
    });

    const subject = { id: "subject", sectorId: "sector", eps: new D(1), close: new D(10), window: "2025-07/2026-06", session: "2026-09-30", listed: true };
    const peer = { ...subject, id: "peer" };
    it("duplicate representations never satisfy the two-distinct-peer minimum", () => {
        const result = valuation(subject, [peer, { ...peer, close: new D(20) }, subject]);
        expect(result.eligible).toEqual(["peer"]);
        expect(result.assessment.availability).toBe("unavailable");
    });
    it.each([
        { sectorId: "other" }, { listed: false }, { window: "different" }, { session: "2026-08-31" },
    ])("excludes ineligible peer %j", change => {
        expect(valuation(subject, [peer, { ...peer, id: "second", ...change }]).assessment.availability).toBe("unavailable");
    });
    it("uses contextual status meanings and neutral unknown/unavailable labels", () => {
        expect(["Low", "Medium", "High"].map(v => statusTone("risk", v))).toEqual(["strong", "mixed", "weak"]);
        expect(["Low", "Medium", "High"].map(v => statusTone("confidence", v))).toEqual(["weak", "mixed", "strong"]);
        expect(statusTone("risk", null)).toBe("unavailable");
        expect(statusTone("risk", "Unreviewed")).toBe("unavailable");
    });
});
