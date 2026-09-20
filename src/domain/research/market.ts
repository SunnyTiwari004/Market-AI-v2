import { D, decimal } from "./metrics";
import type { Listing, Price, Result } from "./types";
import { result, unavailable } from "./types";
export interface IndexPoint { date:string; level:Result<string>; daily:Result<string>; memberIds:string[] }
// Eligible membership is fixed before checking endpoints. A gap breaks the chain.
export function marketIndex(listings: Listing[], prices: Price[], dates: string[]): IndexPoint[] {
    const observations=new Map(prices.map(p=>[`${p.listingId}/${p.date}`,p.close]));
    let level: InstanceType<typeof D>|null=new D(100);
    return dates.map((date,i)=>{
        const start=i===0?date:dates[i-1];
        const members=listings.filter(l=>l.listedAt<=start).map(l=>l.id).sort();
        let sum=new D(0),valid=members.length>0;
        for(const member of members){
            const before=decimal(observations.get(`${member}/${start}`)),after=decimal(observations.get(`${member}/${date}`));
            if(!before?.gt(0)||!after?.gt(0))valid=false;
            else sum=sum.plus(after.div(before).minus(1));
        }
        const change=valid?sum.div(members.length):null;
        level=level&&change?level.times(new D(1).plus(change)):null;
        return {date,memberIds:members,level:level?result(level.toFixed(12)):unavailable<string>("INCOMPLETE_INDEX_CHAIN"),daily:i===0?unavailable<string>("BASE_SESSION"):change?result(change.times(100).toFixed(12)):unavailable<string>("MISSING_EXPECTED_MEMBER_CLOSE")};
    });
}
