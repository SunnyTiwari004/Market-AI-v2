import type { Inputs } from "./inputs";
import type { Evidence } from "../../domain/research/types";
import { id } from "./identity";
import { timestamp } from "../../domain/research/calendar";
import { OFFERS } from "./offer-spec";
import { UNIVERSE } from "./universe-spec";
import { D } from "../../domain/research/metrics";

export const PUBLISHERS = [
    {id:id("publisher","p-4a8c"),name:"Ledger Grove Review"},
    {id:id("publisher","p-9d2e"),name:"Workshop Meridian"},
    {id:id("publisher","p-2f7b"),name:"Commonfield Research Bulletin"},
];
const teaching = [
    ["cn-8a2d","Earnings and growth","Revenue is recognized business income before costs. Ordinary EPS divides net income attributable to ordinary shareholders by weighted average shares.","Revenue growth = 100 × (current/prior − 1), requiring a positive prior revenue. Two-year CAGR requires three consecutive full annual periods and positive endpoints. Operating margin = 100 × EBIT/revenue.","Loss-to-profit is a transition, not a positive-base EPS growth percentage. Reported growth is historical, not a forecast."],
    ["cn-3e7b","Cash and financial capacity","Profit and operating cash measure different things. Working-capital movements can delay the cash from recognized sales.","Cash conversion = operating cash/net income when income is positive. Free cash flow = operating cash − capital expenditure. Debt/equity requires positive equity; interest coverage = EBIT/interest.","Negative free cash flow can reflect equipment investment. No debt and no interest is not-applicable coverage, not infinite strength. Losses and zero denominators remain explicit."],
    ["cn-5c9f","Relative valuation","P/E compares share price with historical earnings per share. Price vs Value is a comparison with eligible peers, not intrinsic value.","TTM uses four consecutive published quarters and day-weighted shares, with the latest quarter within 200 days. At least two positive, compatible peers are required. The median of two P/Es is their arithmetic mean.","Below 0.85 times peer median is Attractive; above 1.15 is Expensive; endpoints are In line. Scenarios change earnings and multiples explicitly; they are neither forecasts nor probabilities."],
    ["cn-1b6e","Price movement and risk","Price Direction summarizes recorded movement. Risk combines operating and borrowing concerns with supported historical price behavior.","Session return = 100 × (ending close/starting close − 1). Direction uses 20, 60 or 252 intervals. Price volatility uses 60 daily percentage returns and sample divisor 59. Drawdown measures decline from the running peak.","Returns exactly ±5 percent are Flat. A recent listing cannot supply an invented long history. Historical volatility does not establish future risk probabilities."],
    ["cn-7f4a","Reading research and evidence","Business Health, Growth Potential and Financial Health describe separate research questions. Research Picture combines those checks with required context.","Required missing components make Research Picture unavailable. With complete inputs, High Risk or two Weak pillars produces Weak. Evidence Confidence separately checks provenance, report coverage, recency, price or offer evidence, and readability.","High confidence can accompany a weak business. What Changed compares compatible snapshots with the same method; newly available is not the same as improved. Sources are simulated, not independent real-world verification."],
    ["cn-9d3c","Understanding an IPO","Fresh Issue creates new shares and company funding. Offer for Sale transfers existing owners' shares; its proceeds go to those owners.","Post-offer shares = pre-offer shares + fresh shares. Net fresh proceeds = issue price × fresh shares − expenses. Subscription multiple = subscribed/reserved shares at the same observation time.","The categories are Large Professional Investors, Large Individual Investors and Regular Individual Investors. Demand is not a return prediction. Listing-day scenarios use pro-forma TTM EPS and offer price, never a later realized close."],
] as const;
const marketSpecs = [
    ["ev-6e1b","2026-07-27","s-6f2a","Longer implementation acceptance cycles","Implementation acceptance can take longer than delivery work. This fictional bulletin highlights the distinction between project completion, billing and cash receipt."],
    ["ev-3c8d","2026-08-19","s-8e4d","Uneven machinery delivery schedules","Order planning remains uneven across component customers. Capacity utilization and conversion of scheduled batches into accepted deliveries merit attention."],
    ["ev-a9f2","2026-09-18","s-1b9c","Packaging-cost watchpoints","Qualitative fictional supplier observations indicate packaging-cost pressure. Product pricing, material use and inventory turnover may absorb or amplify that pressure; no commodity index is claimed."],
    ["ev-7b4e","2026-09-29","s-3a7f","Maintenance budgets and project cash cycles","Maintenance demand offers recurring work while project acceptance can delay receipts. Service renewals and collections remain separate watchpoints."],
] as const;
export function buildCorpus(input: Inputs) {
    const evidence: Evidence[] = [];
    const concepts = teaching.map(([key,title,definition,formula,limitations]) => {
        const evidenceId=id("evidence",key);
        evidence.push({id:evidenceId,issuerId:null,kind:"concept",documentType:null,title,publishedAt:"2024-09-30T08:00:00+05:30",publisher:"MARKET AI educational editorial desk",simulated:true,body:`College Project · Simulated financial data\nDefinition: ${definition}\nFormula and conditions: ${formula}\nLimitations: ${limitations}`});
        return {id:evidenceId,key,definition,formula,limitations};
    });
    const companyKeys=["ev-a6d1","ev-f2b8","ev-7c3e","ev-2a9f","ev-b8e4","ev-4f1c","ev-d3a7","ev-9e6b","ev-5b2d","ev-c7f3","ev-1d8a","ev-e4c9"];
    const events=UNIVERSE.filter(b=>b.symbol).map((b,i)=>({id:id("event",companyKeys[i]),kind:"company" as "company"|"market-sector",occurredAt:`${b.eventDate}T12:00:00+05:30`,publishedAt:`${b.eventDate}T12:00:00+05:30`,summary:b.event,issuerId:id("issuer",b.key) as string|null,sectorId:id("sector",b.sector),evidenceId:id("evidence",`${b.key}/announcement`)}));
    for(const [key,date,sectorKey,title,body] of marketSpecs){
        const evidenceId=id("evidence",`${key}/article`),publishedAt=`${date}T12:00:00+05:30`;
        evidence.push({id:evidenceId,issuerId:null,kind:"article",documentType:null,title:`${title} — Simulated`,publishedAt,publisher:"Commonfield Research Bulletin",simulated:true,body:`College Project · Simulated financial data\n${body}\nThis original qualitative bulletin provides context. It does not measure a causal contribution to any index movement.`});
        events.push({id:id("event",key),kind:"market-sector",occurredAt:publishedAt,publishedAt,summary:body,issuerId:null,sectorId:id("sector",sectorKey),evidenceId});
    }
    const offers=OFFERS.map(o=>{
        const business=UNIVERSE.find(b=>b.key===o.issuerKey)!;
        const offerId=id("offer",o.key),issuerId=id("issuer",o.issuerKey),sourceId=id("evidence",`${o.key}/offer`);
        const holders=[
            {key:"founder",label:"Founder group",pre:new D(o.pre).times("0.7").toFixed(0),sold:o.seller==="founder"?o.ofs:"0",fresh:"0",promoter:true},
            {key:"early-capital",label:"Early-capital group",pre:new D(o.pre).times("0.3").toFixed(0),sold:o.seller==="early-capital"?o.ofs:"0",fresh:"0",promoter:false},
            {key:"public",label:"New public allottee pool",pre:"0",sold:"0",fresh:o.fresh,promoter:false},
        ].map(h=>({...h,transferred:h.key==="public"?o.ofs:"0",offerId,sourceId}));
        const proceeds=o.purposes.map((purpose,i)=>({offerId,key:`purpose-${i+1}`,purpose,fraction:o.purposes.length===2?"0.5":i===2?"0.2":"0.4",sourceId}));
        const reservations=(["professional","large-individual","regular-individual"] as const).map((category,i)=>({offerId,category,shares:new D(o.fresh).plus(o.ofs).times(["0.5","0.15","0.35"][i]).toFixed(0),sourceId}));
        const lifecycleId=o.lifecycle?id("evidence",`${o.key}/lifecycle`):null;
        const subscriptions=o.observation?reservations.map((r,i)=>({offerId,category:r.category,observedAt:o.observation!,subscribed:new D(r.shares).times(["1.4","0.8","1.1"][i]).toFixed(0),sourceId:lifecycleId!})):[];
        const terms=`${business.description}\nOffer terms: band INR ${o.low}–${o.high}; lot ${o.lot}; pre-offer shares ${o.pre}; fresh shares ${o.fresh}; OFS shares ${o.ofs}; issue expenses INR ${o.expenses}.\nTimetable: opens ${o.open}, closes ${o.close}; expected listing ${o.expected} is a plan.\nOwnership (pro-forma until actual issue): ${holders.map(h=>`${h.label}: pre ${h.pre}, sold ${h.sold}, fresh ${h.fresh}, transferred in ${h.transferred}`).join("; ")}. OFS transfers existing shares and creates no company proceeds.\nNet fresh proceeds uses: ${proceeds.map(p=>`${p.purpose}: fraction ${p.fraction}`).join("; ")}. These allocations do not assume earnings from proceeds.\nReservations: ${reservations.map(r=>`${r.category}: ${r.shares}`).join("; ")}. Demand is unavailable before an eligible lifecycle observation.\nFinancial evidence: use only published standalone reports at the evaluation cutoff. Historical income is not increased by issue proceeds.\nRisks: ${business.event || "Delivery, inventory, capacity and funding needs must be evaluated separately from demand for the offer."}`;
        evidence.push({id:sourceId,issuerId,kind:"document",documentType:"offer",title:`${business.name} Offer Document — Simulated`,publishedAt:timestamp(o.termsDate),publisher:`${business.name} reporting desk`,simulated:true,body:`College Project · Simulated financial data\n${terms}`});
        if(o.lifecycle)evidence.push({id:lifecycleId!,issuerId,kind:"document",documentType:"lifecycle",title:`${business.name} Lifecycle Update — Simulated`,publishedAt:o.lifecycle,publisher:`${business.name} reporting desk`,simulated:true,body:`College Project · Simulated financial data\nDemand observed ${o.observation}: ${subscriptions.map(s=>`${s.category} subscribed shares ${s.subscribed}`).join("; ")}. ${o.final?`Final issue price INR ${o.final}.`:"Final issue price is not yet published; upper-band illustrations remain labeled."} Expected listing ${o.expected} is a plan, not evidence of actual admission. Demand is not a probability of a positive return.`});
        evidence.push({id:id("evidence",`${o.key}/article`),issuerId,kind:"article",documentType:null,title:`${business.name}: offer funding and ownership — Simulated`,publishedAt:`${o.articleDate}T12:00:00+05:30`,publisher:business.sector==="s-1b9c"||business.sector==="s-6f2a"?"Ledger Grove Review":"Workshop Meridian",simulated:true,body:`College Project · Simulated financial data\n${business.description}\nThe published offer document separates company funding from ${o.ofs==="0"?"the absence of owner sales":"existing-owner sales"}. Planned funding uses include ${o.purposes.join(", ")}. Historical earnings do not include a return from the proposed funding. Demand and final pricing require their separately dated lifecycle evidence; the offer article makes no listing-return prediction.`});
        return {id:offerId,issuerId,slug:o.slug,opensAt:`${o.open}T09:00:00+05:30`,closesAt:`${o.close}T17:00:00+05:30`,expectedListing:o.expected,actualListing:o.actual,listingId:o.actual?id("listing",`${o.issuerKey}/ordinary`):null,low:o.low,high:o.high,finalPrice:o.final,finalPublishedAt:o.finalDate?timestamp(o.finalDate):null,lot:o.lot,preShares:o.pre,freshShares:o.fresh,ofsShares:o.ofs,expenses:o.expenses,termsPublishedAt:timestamp(o.termsDate),sourceId,lifecycleId,holders,proceeds,reservations,subscriptions};
    });
    const groups=[
        {key:"th-4c8a",kind:"theme",slug:"connected-operations",name:"Connected Operations",rationale:"Tools and equipment that help businesses coordinate routine operations.",members:[["TAVREN","Software operations"],["NERALITH","Workflow deployments"],["KELMIRA","Repeatable precision production"],["MERUVAN","Building-control modules"]]},
        {key:"th-9e2b",kind:"theme",slug:"everyday-resource-use",name:"Everyday Resource Use",rationale:"Design affects material, water or heat use; no quantified environmental claim.",members:[["VELMORA","Reusable containers"],["SUDRAVA","Reusable organizers"],["AVENQOR","Thermal-control equipment"],["TALVESSA","Water-handling systems"]]},
        {key:"co-6b1d",kind:"collection",slug:"recurring-service-models",name:"Recurring Service Models",rationale:"Compare service-renewal models; membership does not imply financial strength.",members:[["TAVREN","Operations renewals"],["ORYNTEL","Application maintenance renewals"],["AVENQOR","Equipment-maintenance contracts"]]},
        {key:"co-2f7c",kind:"collection",slug:"capacity-and-cash",name:"Capacity and Cash",rationale:"Investigate how equipment expansion interacts with cash needs; no ranking.",members:[["DHARVEX","Drive-assembly capacity and debt"],["KELMIRA","Manufacturing machinery"],["MERUVAN","Post-offer commissioning tools"]]},
    ].map(g=>({...g,id:id(g.kind,g.key),members:g.members.map(([symbol,rationale])=>({listingId:input.listings.find(l=>l.symbol===symbol)!.id,rationale}))}));
    return {evidence,concepts,events,offers,groups,publishers:PUBLISHERS};
}
export type Offer = ReturnType<typeof buildCorpus>["offers"][number];
