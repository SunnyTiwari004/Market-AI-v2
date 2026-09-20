import { annuals, cagr, D, decimal as d, earnings, eps, growth, serialize, ttm } from "../../domain/research/metrics";
import { businessHealth, confidence, financialHealth, growthPotential, researchPicture, risk, scenarioValues, valuation } from "../../domain/research/assessments";
import { cutoffSession, daysBetween, timestamp } from "../../domain/research/calendar";
import type { Assumption } from "../../domain/research/types";
import { unavailable } from "../../domain/research/types";
import type { Inputs } from "./inputs";
import type { Offer } from "./corpus";
import { OFFERS } from "./offer-spec";
import { DATASET, METHOD } from "./spec";
import { digest, id } from "./identity";

export function offerStatus(offer: Offer, at: string) {
    const t=Date.parse(at);
    return offer.actualListing && Date.parse(offer.actualListing)<=t ? "Listed" : t<Date.parse(offer.opensAt)?"Upcoming":t<=Date.parse(offer.closesAt)?"Open":"Closed";
}
export function buildIpoResearch(input: Inputs, offers: Offer[]) {
    return offers.map(offer=>{
        const cutoff=offer.actualListing?"2026-05-29T08:59:59+05:30":timestamp("2026-09-30"),date=cutoff.slice(0,10),session=cutoffSession(cutoff);
        // Filter by exact evaluation instant first, then use the unchanged date-based engine.
        const eligible=input.financials.filter(p=>Date.parse(p.publishedAt)<=Date.parse(cutoff));
        const periods=eligible.filter(p=>p.issuerId===offer.issuerId),a=annuals(periods,date),last=a[0],prior=a[1],trailing=ttm(periods,date);
        const issuer=input.issuers.find(i=>i.id===offer.issuerId)!;
        const postShares=new D(offer.preShares).plus(offer.freshShares);
        const proFormaEps=trailing.eps===null?null:trailing.periods.reduce((sum,p)=>sum.plus(p.income),new D(0)).div(postShares);
        const finalEligible=offer.finalPrice!==null&&offer.finalPublishedAt!==null&&Date.parse(offer.finalPublishedAt)<=Date.parse(cutoff);
        const reference=new D(finalEligible?offer.finalPrice!:offer.high),priceBasis=finalEligible?"final-issue-price":"upper-band-illustration";
        const peers=input.listings.filter(l=>l.issuerId!==issuer.id&&l.listedAt<=session&&input.issuers.find(i=>i.id===l.issuerId)?.sectorId===issuer.sectorId).map(l=>{
            const t=ttm(eligible.filter(p=>p.issuerId===l.issuerId),date),price=input.prices.find(p=>p.listingId===l.id&&p.date===session);
            return {listing:l,trailing:t,price,value:{id:l.id,sectorId:issuer.sectorId,eps:t.eps,close:d(price?.close),window:t.key,session,listed:true}};
        });
        const v=valuation({id:offer.id,sectorId:issuer.sectorId,eps:proFormaEps,close:reference,window:trailing.key,session,listed:true},peers.map(p=>p.value));
        const fresh=last&&daysBetween(last.end,date)<=550;
        const field=(name:keyof typeof last)=>fresh?d(last[name]):null;
        const fin={debt:field("debt"),equity:field("equity"),ebit:field("ebit"),interest:field("interest"),income:field("income"),ocf:field("ocf"),capex:field("capex")};
        const business=businessHealth(field("revenue"),fin.ebit,fin.income,fin.ocf),financial=financialHealth(fin);
        const progression=earnings(eps(fin.income,field("weightedShares")),prior?eps(d(prior.income),d(prior.weightedShares)):null);
        const growthResult=growthPotential(prior?growth(field("revenue"),d(prior.revenue)):null,cagr(a),progression);
        // IPO financial-only Risk: the neutral price terms do not represent observations.
        const financialRisk=risk(fin,new D(0),new D(0));
        const definition=OFFERS.find(o=>id("offer",o.key)===offer.id)!;
        const cases:Assumption["cases"]=definition.scenario.map(([g,m],i)=>({label:(["Weak","Base","Strong"] as const)[i],g,m,rationale:`Authored listing-day educational sensitivity: ${["earnings pressure and multiple compression","broadly stable operating conditions","improved execution and multiple expansion"][i]}. ${issuer.description} No proceeds-driven income is assumed.`,evidenceIds:[offer.sourceId]}));
        const assumptions={id:id("ipo-assumption",`${offer.id}/${cutoff}/${METHOD}`),offerId:offer.id,cutoff,dataset:DATASET,method:METHOD,window:"listing-day" as const,cases};
        const financialIds=[...new Set([...periods,...peers.flatMap(p=>p.trailing.periods)].map(p=>p.id))].sort();
        const evidenceIds=[...new Set([...input.evidence.filter(e=>e.issuerId===issuer.id&&Date.parse(e.publishedAt)<=Date.parse(cutoff)).map(e=>e.id),...peers.flatMap(p=>p.trailing.periods.map(f=>f.sourceId))])].sort();
        const conf=confidence([true,a.length===3&&periods.filter(p=>p.basis==="quarterly").length===8,!!fresh&&trailing.eps!==null,Date.parse(offer.termsPublishedAt)<=Date.parse(cutoff)&&(!offer.actualListing||finalEligible),evidenceIds.every(e=>!!input.evidence.find(s=>s.id===e)?.body.trim())],evidenceIds.length>0);
        return {id:id("ipo-snapshot",`${offer.id}/${cutoff}/${METHOD}`),offerId:offer.id,cutoff,method:METHOD,assumptions,assumptionDigest:digest(assumptions),output:{priceBasis,reference:reference.toFixed(2),postShares:postShares.toFixed(0),ttmEps:serialize(proFormaEps),pe:serialize(v.pe),peerMedian:serialize(v.median),valuation:v.assessment,business,growth:growthResult,financial,risk:financialRisk,confidence:conf,picture:researchPicture("long",business,growthResult,financial,financialRisk,unavailable("IPO_HAS_NO_PRICE_DIRECTION"),v.assessment)},scenarios:scenarioValues(cases,proFormaEps,v.median,reference,v.eligible.length),financialIds,priceIds:peers.flatMap(p=>p.price?[p.price.id]:[]).sort(),peerIds:peers.map(p=>p.listing.id).sort(),evidenceIds};
    });
}
export type IpoResearch=ReturnType<typeof buildIpoResearch>[number];
