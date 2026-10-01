import assert from "node:assert/strict";
import { UNIVERSE } from "../src/data/synthetic/universe-spec";
import { VIEWS } from "../src/features/stock/state";
import { OFFERS } from "../src/data/synthetic/offer-spec";
const base="http://localhost:3100";
async function main(){
const discovery = [
    ["/", "Market in Simple Words", "What Matters Today", "Sector Picture", "Worth Researching", "IPO Watch"],
    ["/explore", "Connected Operations", "Everyday Resource Use", "Recurring Service Models", "Capacity and Cash", "22 results"],
    ["/stocks", "12 results", "Find a company"],
    ["/stocks?q=%20tAvReN%20", "1 results", "Tavren Systems Limited"],
    ["/stocks?q=unknown-company", "0 results", "No matching results"],
    ["/explore?type=stocks&picture=Weak&risk=Low", "0 results", "No matching results"],
    ["/explore?type=stocks&theme=connected-operations", "4 results", "Tools and equipment"],
    ["/explore?type=stocks&collection=capacity-and-cash", "3 results", "Capacity and Cash"],
    ["/explore?type=sectors&picture=Strong", "4 results", "Unsupported or incompatible URL choices"],
    ["/explore?section=changes", "12 results", "Recent Research Changes", "#what-changed"],
    ["/ipos", "4 results", "Elarven Workflow", "Nivora Kitchenware", "Kavreth Fabrication", "Meruvan Controls"],
    ...["Upcoming", "Open", "Closed", "Listed"].map(status => [`/ipos?status=${status}`, "1 results", status]),
];
for (const [path, ...markers] of discovery) {
    const response = await fetch(`${base}${path}`, { headers: { "User-Agent": "Googlebot" } });
    const html = await response.text(); assert.equal(response.status, 200, path);
    for (const marker of markers) assert.ok(html.includes(marker), `${path}: ${marker}`);
    assert.ok(html.includes("College Project · Simulated financial data"));
    assert.ok(!html.includes("Research is unavailable"), path);
    assert.ok(!/href="(?:#|\/ask)"/.test(html), `${path}: no dead destinations`);
    if (["/explore", "/ipos"].includes(path)) for (const offer of OFFERS) assert.ok(html.includes(`href="/ipos/${offer.slug}"`), `${path}: ${offer.slug}`);
    if (path === "/") for (const offer of OFFERS.filter(o => !o.actual).sort((a, b) => a.open.localeCompare(b.open)).slice(0, 2)) assert.ok(html.includes(`href="/ipos/${offer.slug}"`), `${path}: ${offer.slug}`);
    if (path === "/stocks") for (const company of UNIVERSE.filter(c => c.symbol)) assert.ok(html.includes(`href="/stocks/${company.symbol!.toLowerCase()}"`), company.name);
    console.log(`${path}: PASS`);
}
const missingPage = await fetch(`${base}/missing-discovery-route`, { headers: { "User-Agent": "Googlebot" } });
const missingHtml = await missingPage.text(); assert.ok(missingHtml.includes("Page not found") && missingHtml.includes("noindex"));
for (const [index, offer] of OFFERS.entries()) {
    for (const level of ["simple", "normal", "pro"]) {
        const path = `/ipos/${offer.slug}${level === "simple" ? "" : `?level=${level}`}`;
        const response = await fetch(`${base}${path}`, { headers: { "User-Agent": "Googlebot" } }), html = await response.text();
        assert.equal(response.status, 200, path);
        for (const marker of ["60-Second Overview", "Research Picture", "Evidence Confidence", "What Looks Good", "Needs Attention", "Fresh Issue", "Use of Proceeds", "Who is selling?", "Who wants shares?", "Price vs Value", "Listing Scenarios", "Browse all IPO sources", "College Project · Simulated financial data", ["Upcoming", "Open", "Closed", "Listed"][index]]) assert.ok(html.includes(marker), `${path}: ${marker}`);
        assert.ok(!html.includes("IPO research is unavailable"));
        assert.ok(!/href="#"|Apply Now|Invest Now|Subscribe Now|Watch IPO|Thinking of Applying|Profit Probability/.test(html));
        if (index === 0) assert.ok(html.includes("Demand observation unavailable"));
        if (index === 3) assert.ok(html.includes("Historical pre-listing research") && html.includes("/stocks/meruvan"));
        console.log(`${path}: PASS`);
    }
}
const unknownIpo = await fetch(`${base}/ipos/unknown-offer`, { headers: { "User-Agent": "Googlebot" } });
const unknownIpoHtml = await unknownIpo.text();
assert.ok([200, 404].includes(unknownIpo.status)); assert.ok(unknownIpoHtml.includes("IPO not found") && unknownIpoHtml.includes("noindex"));
for(const b of UNIVERSE.filter(b=>b.symbol)){
    const response=await fetch(`${base}/stocks/${b.symbol!.toLowerCase()}`,{headers:{"User-Agent":"Googlebot"}});
    const html=await response.text();
    assert.equal(response.status,200,b.symbol!);
    for(const text of [b.name,"College Project · Simulated financial data","What Changed?","Possible 30-Day Outcomes","Browse all sources"])
        assert.ok(html.includes(text),`${b.symbol}: ${text}`);
    assert.ok(!html.includes("Research is unavailable"),`${b.symbol}: database-backed research`);
    assert.ok(!html.includes('href="#"'),`${b.symbol}: no placeholder link`);
    console.log(`${b.symbol}: PASS`);
    for (const view of VIEWS.filter(v => v !== "overview")) {
        const response = await fetch(`${base}/stocks/${b.symbol!.toLowerCase()}?view=${view}&level=pro`, { headers: { "User-Agent": "Googlebot" } });
        const body = await response.text();
        assert.equal(response.status, 200);
        assert.ok(body.includes(b.name) && body.includes("College Project · Simulated financial data"));
        assert.ok(!body.includes("View unavailable") && !body.includes("Research is unavailable"));
        const markers = { financials: ["Income Statement", "Balance Sheet", "Cash Flow", "Read report"], chart: ["Inspect a closing price", "Closing-price table"], news: ["Read article", "newest first"], peers: ["Sector peer comparison", "canonical sector peers"], filings: ["Read document", "Apply filters"] };
        for (const marker of markers[view]) assert.ok(body.includes(marker), `${b.symbol}/${view}: ${marker}`);
        assert.ok(!body.includes('href="#"'));
    }
}
for(const slug of ["elarven","nivora","kavreth","elarven-workflow","nivora-kitchenware","kavreth-fabrication"]){
    const response=await fetch(`${base}/stocks/${slug}`,{headers:{"User-Agent":"Googlebot"}});
    const missing=await response.text();
    // Next's existing loading boundary can commit a streaming 200 before notFound.
    assert.ok([200,404].includes(response.status),slug);
    assert.ok(missing.includes("Stock not found")&&missing.includes("noindex"),slug);
}
const historical=await fetch(`${base}/stocks/meruvan?cutoff=2026-08-01&horizon=long`);
const html=await historical.text();
assert.equal(historical.status,200);
assert.ok(html.includes("Unavailable")&&html.includes("2026-07-31"));
console.log("Stock view route matrix: 72/72; IPO-only routes: 6/6 not-found + noindex (streamed response may be 200); Meruvan historical short-history state: PASS");
}
main().catch(error=>{console.error(error instanceof Error?error.message:"Route verification failed");process.exitCode=1;});
