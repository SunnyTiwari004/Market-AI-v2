import type { Slice } from "./build";
import { D } from "../../domain/research/metrics";
import { CUTOFFS, daysBetween, END, sessions, START, timestamp } from "../../domain/research/calendar";
import { marketIndex } from "../../domain/research/market";
import { buildIpoResearch, offerStatus } from "./ipo-research";
import { digest, id } from "./identity";
import { UNIVERSE, SECTORS } from "./universe-spec";
import { OFFERS } from "./offer-spec";
import { whatChanged } from "../../domain/research/changes";

export function validateUniverse(s: Slice) {
    const errors:string[]=[],check=(ok:boolean,label:string)=>{if(!ok)errors.push(label);};
    const sum=(rows:string[])=>rows.reduce((a,b)=>a.plus(b),new D(0));
    check(s.sectors.length===4,"Four sectors required");
    for(const sector of SECTORS){
        check(s.sectors.some(x=>x.id===id("sector",sector.key)&&x.name===sector.name&&x.slug===sector.slug),`Sector registry ${sector.key}`);
        check(s.listings.filter(l=>s.issuers.find(i=>i.id===l.issuerId)?.sectorId===id("sector",sector.key)).length===3,`Sector membership ${sector.key}`);
    }
    for(const b of UNIVERSE){
        const issuer=id("issuer",b.key),periods=s.financials.filter(p=>p.issuerId===issuer);
        const annual=periods.filter(p=>p.basis==="annual"),qs=periods.filter(p=>p.basis==="quarterly").sort((a,b)=>a.start.localeCompare(b.start));
        check(annual.length===3&&qs.length===8,`Period coverage ${b.key}`);
        check(s.issuers.find(i=>i.id===issuer)?.sectorId===id("sector",b.sector),`Issuer sector ${b.key}`);
        check(s.listings.filter(l=>l.issuerId===issuer).length===(b.symbol?1:0),`Listing coverage ${b.key}`);
        for(let i=1;i<qs.length;i++)check(new D(qs[i].openingCash).eq(qs[i-1].closingCash),`Quarter cash ${b.key}`);
        for(const p of periods){
            check(Date.parse(p.publishedAt)<=Date.parse(timestamp(END)),`Future report ${p.id}`);
            const offered=b.key==="i-f7a1"&&p.end==="2026-06-30";
            check(new D(p.shares).eq(offered?"10000000":b.shares),`Ending share count ${p.id}`);
            const weighted=offered?new D(b.shares).times(58).plus(new D("10000000").times(33)).div(91).toFixed(6):b.shares;
            check(new D(p.weightedShares).eq(weighted),`Weighted shares ${p.id}`);
            if(b.sector==="s-3a7f"&&p.basis==="quarterly"&&p.end.endsWith("03-31")){
                const expected=b.key==="i-f7a1"&&p.end==="2026-03-31"?"2026-08-15":`${p.end.slice(0,4)}-06-15`;
                check(p.publishedAt===timestamp(expected),`Facility publication ${p.id}`);
            }
        }
        for(const a of annual){const overlap=qs.filter(q=>q.start>=a.start&&q.end<=a.end);if(overlap.length===4){
            for(const field of ["revenue","ebit","interest","income","ocf","investing","financing","capex"] as const)check(sum(overlap.map(q=>q[field])).eq(a[field]),`Annual overlap ${a.id}/${field}`);
            const days=sum(overlap.map(q=>String(daysBetween(q.start,q.end)+1)));
            check(sum(overlap.map(q=>new D(q.weightedShares).times(daysBetween(q.start,q.end)+1).toString())).div(days).toFixed(6)===new D(a.weightedShares).toFixed(6),`Annual share weighting ${a.id}`);
        }}
    }
    check(s.evidence.filter(e=>e.kind==="document").length===184,"Document inventory");
    check(s.evidence.filter(e=>e.kind==="article").length===32,"Article inventory");
    check(s.concepts.length===6&&s.evidence.filter(e=>e.kind==="concept").length===6,"Concept inventory");
    for(const e of s.evidence){
        check(Date.parse(e.publishedAt)<=Date.parse(timestamp(END)),`Future source ${e.id}`);
        if(e.kind==="article")check(s.publishers.some(p=>p.name===e.publisher),`Fictional publisher ${e.id}`);
        if(e.kind==="concept")check(s.concepts.some(c=>c.id===e.id),`Concept subtype ${e.id}`);
        if(e.issuerId===null&&e.kind!=="concept")check(s.events.some(v=>v.evidenceId===e.id),`Unscoped source ${e.id}`);
    }
    check(s.events.filter(e=>e.kind==="company").length===12&&s.events.filter(e=>e.kind==="market-sector").length===4,"Event inventory");
    for(const event of s.events)check(s.evidence.some(e=>e.id===event.evidenceId&&Date.parse(e.publishedAt)<=Date.parse(event.publishedAt))&&s.sectors.some(v=>v.id===event.sectorId),`Event evidence ${event.id}`);
    for(const kind of ["theme","collection"]){check(s.groups.filter(g=>g.kind===kind).length===2,`Discovery count ${kind}`);}
    for(const g of s.groups)check(g.members.length>=2&&new Set(g.members.map(m=>m.listingId)).size===g.members.length&&g.members.every(m=>m.rationale.trim()&&s.listings.some(l=>l.id===m.listingId)),`Discovery membership ${g.id}`);
    check(s.offers.length===4&&new Set(s.offers.map(o=>o.issuerId)).size===4,"Offer inventory");
    check(s.offers.map(o=>offerStatus(o,timestamp(END))).sort().join()==="Closed,Listed,Open,Upcoming","Offer lifecycle coverage");
    for(const offer of s.offers){
        const definition=OFFERS.find(o=>id("offer",o.key)===offer.id);
        check(!!definition&&offer.issuerId===id("issuer",definition.issuerKey),`Offer identity ${offer.id}`);
        check(Date.parse(offer.termsPublishedAt)<Date.parse(offer.opensAt)&&Date.parse(offer.opensAt)<=Date.parse(offer.closesAt),`Offer chronology ${offer.id}`);
        check(new D(offer.low).gt(0)&&new D(offer.high).gte(offer.low)&&offer.lot>0,`Offer prices ${offer.id}`);
        const gross=new D(offer.finalPrice??offer.high).times(offer.freshShares);
        check(new D(offer.expenses).gte(0)&&gross.gte(offer.expenses)&&sum(offer.proceeds.map(p=>p.fraction)).eq(1),`Proceeds ${offer.id}`);
        check(sum(offer.holders.map(h=>h.pre)).eq(offer.preShares)&&sum(offer.holders.map(h=>h.sold)).eq(offer.ofsShares)&&sum(offer.holders.map(h=>h.fresh)).eq(offer.freshShares)&&sum(offer.holders.map(h=>h.transferred)).eq(offer.ofsShares),`Ownership totals ${offer.id}`);
        check(offer.holders.every(h=>new D(h.pre).gte(h.sold)&&new D(h.sold).gte(0)),`Ownership bounds ${offer.id}`);
        check(sum(offer.holders.map(h=>new D(h.pre).minus(h.sold).plus(h.fresh).plus(h.transferred).toString())).eq(new D(offer.preShares).plus(offer.freshShares)),`Post offer ownership ${offer.id}`);
        check(offer.reservations.length===3&&new Set(offer.reservations.map(r=>r.category)).size===3&&offer.reservations.every(r=>new D(r.shares).gt(0))&&sum(offer.reservations.map(r=>r.shares)).eq(new D(offer.freshShares).plus(offer.ofsShares)),`Reservations ${offer.id}`);
        for(const obs of offer.subscriptions)check(Date.parse(obs.observedAt)>=Date.parse(offer.opensAt)&&Date.parse(obs.observedAt)<=Date.parse(s.evidence.find(e=>e.id===obs.sourceId)!.publishedAt)&&new D(obs.subscribed).gte(0),`Demand chronology ${offer.id}`);
        if(offer.actualListing){
            check(offer.issuerId===id("issuer","i-f7a1")&&s.listings.some(l=>l.id===offer.listingId&&l.issuerId===offer.issuerId&&l.listedAt===offer.actualListing!.slice(0,10)),"Meruvan overlap");
            const june=s.financials.find(p=>p.issuerId===offer.issuerId&&p.basis==="quarterly"&&p.end==="2026-06-30")!;
            check(new D(june.financing).eq(gross.minus(offer.expenses)),"Meruvan net fresh financing excludes OFS");
        } else check(offer.listingId===null,"IPO-only listing must be absent");
    }
    check(s.ipoResearch.length===4&&digest(s.ipoResearch)===digest(buildIpoResearch(s,s.offers)),"IPO outputs/provenance");
    for(const research of s.ipoResearch){
        for(const eid of research.evidenceIds)check(s.evidence.some(e=>e.id===eid&&Date.parse(e.publishedAt)<=Date.parse(research.cutoff)),`IPO future evidence ${eid}`);
        for(const pid of research.priceIds)check(s.prices.some(p=>p.id===pid&&p.date<=cutoffSessionSafe(research.cutoff)),`IPO price chronology ${pid}`);
        check(!research.scenarios.reasons.some(r=>r==="INVALID_ASSUMPTIONS"||r==="SCENARIO_ORDER_VIOLATION"),`IPO scenarios ${research.id}`);
    }
    for(const snapshot of s.snapshots){
        const peers=s.listings.filter(l=>l.id!==snapshot.listingId&&s.issuers.find(i=>i.id===l.issuerId)?.sectorId===s.issuers.find(i=>i.id===snapshot.issuerId)?.sectorId).map(l=>l.id).sort();
        check(snapshot.peerIds.join()===peers.join(),`Same-sector peers ${snapshot.id}`);
    }
    const dates=sessions(START,END);
    const scopes=[s.listings,...s.sectors.map(sector=>s.listings.filter(l=>s.issuers.find(i=>i.id===l.issuerId)?.sectorId===sector.id))];
    for(const scope of scopes){const points=marketIndex(scope,s.prices,dates);check(points.length===523&&points.every(p=>p.level.availability==="available"),"Contiguous index");}
    const index=marketIndex(s.listings,s.prices,dates);
    check(index.find(p=>p.date==="2026-05-29")?.memberIds.length===11&&index.find(p=>p.date==="2026-06-01")?.memberIds.length===12,"Index admission interval");
    if(errors.length)throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
}
import { cutoffSession as cutoffSessionSafe } from "../../domain/research/calendar";
export function coverageReport(s:Slice){
    const groups=CUTOFFS.flatMap(cutoff=>["short","medium","long"].map(horizon=>{
        const rows=s.snapshots.filter(x=>x.cutoff===cutoff&&x.horizon===horizon);
        const fields=["business","growth","financial","risk","valuation","direction","picture","confidence"] as const;
        return {cutoff,horizon,states:Object.fromEntries(fields.map(field=>[field,Object.fromEntries([...new Set(rows.map(r=>`${r[field].availability}:${r[field].value??"unavailable"}`))].sort().map(state=>[state,rows.filter(r=>`${r[field].availability}:${r[field].value??"unavailable"}`===state).map(r=>({symbol:s.listings.find(l=>l.id===r.listingId)!.symbol,reasons:r[field].reasons}))]))]))};
    }));
    const changes=s.snapshots.filter(s=>s.cutoff!==CUTOFFS[0]).map(current=>{const previous=s.snapshots.find(p=>p.listingId===current.listingId&&p.horizon===current.horizon&&p.cutoff===CUTOFFS[CUTOFFS.indexOf(current.cutoff as typeof CUTOFFS[number])-1])!;return {symbol:s.listings.find(l=>l.id===current.listingId)!.symbol,horizon:current.horizon,to:current.cutoff,comparison:whatChanged(previous,current)};});
    return {groups,changes,ipoLifecycle:s.offers.map(o=>({slug:o.slug,status:offerStatus(o,timestamp(END))})),askEvidenceReadiness:{stock:s.listings.length,compare:"Same-window typed financial and peer inputs",concepts:s.concepts.length,marketEvents:s.events.filter(e=>e.kind==="market-sector").length,generation:"Not implemented"}};
}
