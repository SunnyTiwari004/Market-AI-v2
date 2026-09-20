import { expect,it } from "vitest";
import { buildInputs } from "../src/data/synthetic/inputs";
import { buildCorpus } from "../src/data/synthetic/corpus";
import { offerTerms } from "../src/domain/ipo/terms";
const corpus=buildCorpus(buildInputs());
const publications=new Map(corpus.evidence.map(e=>[e.id,e.publishedAt]));
it("derives exact fresh/OFS proceeds, minimum application and post-offer ownership",()=>{
    const offer=corpus.offers.find(o=>o.slug==="meruvan-controls-ipo")!;
    const result=offerTerms(offer,"2026-09-30T18:00:00+05:30",publications).value!;
    expect(result).toMatchObject({minimumApplication:"12000.00",postShares:"10000000",grossFresh:"240000000.00",ofsProceeds:"60000000.00",netFresh:"234000000.00",issueTotal:"300000000.00",ownershipBasis:"post-offer"});
    expect(result.holders.map(h=>h.afterShares)).toEqual(["5600000","1900000","2500000"]);
    expect(result.proceeds.map(p=>p.amount)).toEqual(["93600000.000000000000","93600000.000000000000","46800000.000000000000"]);
});
it("gates terms, final price and demand independently by publication",()=>{
    const offer=corpus.offers.find(o=>o.slug==="meruvan-controls-ipo")!;
    expect(offerTerms(offer,"2026-05-10T18:00:00+05:30",publications).availability).toBe("unavailable");
    const before=offerTerms(offer,"2026-05-21T18:00:00+05:30",publications).value!;
    expect(before.reference).toBe("125.00");expect(before.priceBasis).toBe("upper-band-illustration");
    expect(before.subscriptions.every(s=>s.multiple.availability==="unavailable")).toBe(true);
    const after=offerTerms(offer,"2026-05-22T18:00:00+05:30",publications).value!;
    expect(after.reference).toBe("120.00");expect(after.status).toBe("Closed");
    expect(after.subscriptions.map(s=>s.multiple.value)).toEqual(["1.400000000000","0.800000000000","1.100000000000"]);
});
it("keeps fresh-only OFS at zero and excludes nonexistent upcoming demand",()=>{
    const nivora=offerTerms(corpus.offers[1],"2026-09-30T18:00:00+05:30",publications).value!;
    expect(nivora).toMatchObject({status:"Open",ofsProceeds:"0.00",ownershipBasis:"pro-forma",minimumApplication:"8500.00"});
    const upcoming=offerTerms(corpus.offers[0],"2026-09-30T18:00:00+05:30",publications).value!;
    expect(upcoming.status).toBe("Upcoming");expect(upcoming.demandObservedAt).toBeNull();
});
