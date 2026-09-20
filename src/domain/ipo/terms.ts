import { D } from "../research/metrics";
import { result, unavailable } from "../research/types";

interface OfferTerms {
    opensAt:string; closesAt:string; actualListing:string|null; listingId:string|null;
    termsPublishedAt:string; low:string; high:string; finalPrice:string|null; finalPublishedAt:string|null;
    lot:number; preShares:string; freshShares:string; ofsShares:string; expenses:string;
    holders:{key:string;pre:string;sold:string;fresh:string;transferred:string}[];
    proceeds:{key:string;fraction:string}[];
    reservations:{category:string;shares:string}[];
    subscriptions:{category:string;observedAt:string;subscribed:string;sourceId:string}[];
}

// Read-time offer arithmetic. Planned capital never rewrites reported statements.
export function offerTerms(offer:OfferTerms,cutoff:string,publications:ReadonlyMap<string,string>){
    const instant=Date.parse(cutoff);
    if(!Number.isFinite(instant)||Date.parse(offer.termsPublishedAt)>instant)return unavailable<never>("OFFER_TERMS_NOT_PUBLISHED");
    const final=offer.finalPrice!==null&&offer.finalPublishedAt!==null&&Date.parse(offer.finalPublishedAt)<=instant;
    const reference=new D(final?offer.finalPrice!:offer.high);
    const fresh=new D(offer.freshShares),ofs=new D(offer.ofsShares),pre=new D(offer.preShares),post=pre.plus(fresh);
    const grossFresh=reference.times(fresh),ofsProceeds=reference.times(ofs),netFresh=grossFresh.minus(offer.expenses);
    const status=offer.actualListing&&offer.listingId&&Date.parse(offer.actualListing)<=instant?"Listed":instant<Date.parse(offer.opensAt)?"Upcoming":instant<=Date.parse(offer.closesAt)?"Open":"Closed";
    const observations=offer.subscriptions.filter(s=>Date.parse(s.observedAt)<=instant&&Date.parse(s.observedAt)>=Date.parse(offer.opensAt)&&Date.parse(publications.get(s.sourceId)??"")<=instant);
    const latest=observations.map(s=>s.observedAt).sort((a,b)=>Date.parse(b)-Date.parse(a))[0]??null;
    return result({status,priceBasis:final?"final-issue-price":"upper-band-illustration",reference:reference.toFixed(2),minimumApplication:reference.times(offer.lot).toFixed(2),offeredShares:fresh.plus(ofs).toFixed(0),postShares:post.toFixed(0),grossFresh:grossFresh.toFixed(2),ofsProceeds:ofsProceeds.toFixed(2),issueTotal:grossFresh.plus(ofsProceeds).toFixed(2),netFresh:netFresh.toFixed(2),ownershipBasis:status==="Listed"?"post-offer":"pro-forma",
        holders:offer.holders.map(h=>{const after=new D(h.pre).minus(h.sold).plus(h.fresh).plus(h.transferred);return {key:h.key,afterShares:after.toFixed(0),beforePercent:new D(h.pre).div(pre).times(100).toFixed(12),afterPercent:after.div(post).times(100).toFixed(12)};}),
        proceeds:offer.proceeds.map(p=>({key:p.key,amount:netFresh.times(p.fraction).toFixed(12)})),
        demandObservedAt:latest,subscriptions:offer.reservations.map(r=>{const observation=observations.find(s=>s.category===r.category&&s.observedAt===latest);return {category:r.category,multiple:observation?result(new D(observation.subscribed).div(r.shares).toFixed(12)):unavailable<string>("NO_COMPATIBLE_PUBLISHED_DEMAND")};}),
    });
}
