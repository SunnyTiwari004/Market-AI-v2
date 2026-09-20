import { describe, expect, it } from "vitest";
import { buildSlice } from "../src/data/synthetic/build";
import { digest } from "../src/data/synthetic/identity";
import { validateSlice } from "../src/data/synthetic/validate";
import { validateUniverse } from "../src/data/synthetic/validate-universe";
import { marketIndex } from "../src/domain/research/market";
import { D, ttm } from "../src/domain/research/metrics";
import { assertKnownDevelopmentTransition, LEGACY_DATASET } from "../src/server/db/seed-policy";
const s=buildSlice();
describe("complete synthetic universe",()=>{
    it("preserves every original financial, close, evidence and research regression fingerprint",()=>{
        const fingerprints=[
            ["435472812fa0f0fa2774b67c819c14415ab2dbdc1d31f28ff199ccf8ff0d72a8","a3b5327ee41f79f2e298e4bbf42d15daf698a021049b429d23f96f295651ef21","80ce8ab7882893e53688f8edc04eff58971444a628f03d0578892bcd3f21330f","29dfaaa41c3153d93a70661f234c8fd46258e7e77e1bc3d60f30fd7c46b04c20"],
            ["d24895f1a7ab6092452ff4b77cf2d3088c8f4f7f8d6002f96afc794ee3da9ec5","328454f0853585931ff8e72ee786969e0da673f94d68124b0501349b449067a5","d82f26e8bf356b6693ca403368c8a64b62e5d45d7450a1376e09d361acc2f034","9ba43505ab3093000d54e9e002f9940f79550e92257529f95eec27c999402991"],
            ["e3a66599799006814c95b62c601336b27a27d94bbd57918a04e6e0037d2ec5a9","4ab17124b91cf690eb9eebc8042f59d9c584d5070e5219216f08dea22de85b06","e569528980dfefc8a8d9b28e33b9a40ee8c80c2269625b9602707067ed79fdd4","31b74dd479c44b960a6addd0c330d0962e40fd5bc3924b695369a4457ca13c81"],
        ];
        for(const [i,issuer] of s.issuers.slice(0,3).entries())expect([
            digest(s.financials.filter(p=>p.issuerId===issuer.id)),
            digest(s.prices.filter(p=>s.listings.find(l=>l.id===p.listingId)?.issuerId===issuer.id)),
            digest(s.evidence.filter(e=>e.issuerId===issuer.id)),
            digest(s.snapshots.filter(p=>p.issuerId===issuer.id).map(p=>({...p,dataset:"regression"}))),
        ]).toEqual(fingerprints[i]);
    });
    it("validates exact full inventories and separate IPO ownership",()=>{
        expect(validateSlice(s)).toMatchObject({issuers:15,listings:12,annual:45,quarterly:120,prices:5842,documents:184,articles:32,concepts:6,snapshots:108,scenarioSets:36});
        expect(s.offers.filter(o=>o.listingId)).toHaveLength(1);
        expect(s.offers.filter(o=>!o.listingId).every(o=>!s.listings.some(l=>l.issuerId===o.issuerId))).toBe(true);
    });
    it("keeps Meruvan historical IPO valuation, dilution and short-history research separate",()=>{
        const listing=s.listings.find(l=>l.symbol==="MERUVAN")!,offer=s.offers.find(o=>o.issuerId===listing.issuerId)!;
        const ipo=s.ipoResearch.find(r=>r.offerId===offer.id)!;
        expect(ipo.output.reference).toBe("120.00");expect(ipo.output.priceBasis).toBe("final-issue-price");
        expect(ipo.output.postShares).toBe("10000000");
        expect(ipo.priceIds.every(id=>s.prices.find(p=>p.id===id)!.listingId!==listing.id)).toBe(true);
        expect(ipo.financialIds.map(id=>s.financials.find(p=>p.id===id)!).every(p=>Date.parse(p.publishedAt)<Date.parse(ipo.cutoff))).toBe(true);
        const june=s.financials.find(p=>p.issuerId===listing.issuerId&&p.end==="2026-06-30")!;
        expect(june.weightedShares).toBe("8725274.725275");expect(june.financing).toBe("234000000.00");
        expect(s.prices.filter(p=>p.listingId===listing.id)).toHaveLength(89);
        expect(s.snapshots.filter(p=>p.listingId===listing.id&&p.horizon==="long").every(p=>p.direction.availability==="unavailable")).toBe(true);
        expect(s.snapshots.find(p=>p.listingId===listing.id&&p.cutoff==="2026-08-01")!.confidence.value).toBe("Low");
    });
    it("reflects actual Parnex recovery and Dharvex repayment without revising annuals",()=>{
        const parnex=s.listings.find(l=>l.symbol==="PARNEX")!,periods=s.financials.filter(p=>p.issuerId===parnex.issuerId);
        expect(ttm(periods,"2026-08-01").eps!.lte(0)).toBe(true);expect(ttm(periods,"2026-08-31").eps!.gt(0)).toBe(true);
        const dharvex=s.listings.find(l=>l.symbol==="DHARVEX")!,financials=s.financials.filter(p=>p.issuerId===dharvex.issuerId);
        expect(financials.find(p=>p.basis==="annual"&&p.end==="2026-03-31")!.debt).toBe("650000000");
        expect(financials.find(p=>p.end==="2026-06-30")!.debt).toBe("590000000.00");
    });
    it("independently verifies equal weights, admission timing and broken-chain behavior",()=>{
        const dates=["2026-05-28","2026-05-29","2026-06-01"],listings=[{id:"a",issuerId:"a",symbol:"AAA",listedAt:dates[0]},{id:"b",issuerId:"b",symbol:"BBB",listedAt:dates[1]}];
        const prices=[{id:"1",listingId:"a",date:dates[0],close:"100"},{id:"2",listingId:"a",date:dates[1],close:"110"},{id:"3",listingId:"a",date:dates[2],close:"121"},{id:"4",listingId:"b",date:dates[1],close:"200"},{id:"5",listingId:"b",date:dates[2],close:"180"}];
        const points=marketIndex(listings,prices,dates);
        expect(points.map(p=>p.memberIds.length)).toEqual([1,1,2]);expect(points.map(p=>p.level.value)).toEqual(["100.000000000000","110.000000000000","110.000000000000"]);
        expect(marketIndex(listings,prices.filter(p=>p.id!=="4"),dates)[2].level.availability).toBe("unavailable");
        expect(new D(points[2].daily.value!).eq(0)).toBe(true);
    });
    it("blocks corrupted ownership and early evidence without relying on a stale digest",()=>{
        const bad=structuredClone(s);bad.offers[0].holders[0].sold="999999999";
        expect(()=>validateUniverse(bad)).toThrow("Ownership");
        const future=structuredClone(s);future.ipoResearch[3].evidenceIds.push(s.evidence.find(e=>e.issuerId===s.offers[3].issuerId&&e.documentType==="announcement")!.id);
        expect(()=>validateUniverse(future)).toThrow("IPO");
    });
    it("permits only the exact known development transition and rejects additional datasets",()=>{
        const versions=[{version:LEGACY_DATASET,profile:"three-company-development-slice",published:true,digest:"31486d2793a8bd571703d0904ea28f4399a660c62e336ab78eff51b357702de5"}];
        const method={specificationDigest:"spec",implementationDigest:"1bfa28ffad6953e14f18553a2bcf362d54442b2bc8ef98cd21176f9e5bf25486"};
        expect(()=>assertKnownDevelopmentTransition(versions,method,"spec")).not.toThrow();
        expect(()=>assertKnownDevelopmentTransition([...versions,{...versions[0],version:"other"}],method,"spec")).toThrow();
        expect(()=>assertKnownDevelopmentTransition(versions,{...method,implementationDigest:"changed"},"spec")).toThrow();
    });
});
