import assert from "node:assert/strict";
import { UNIVERSE } from "../src/data/synthetic/universe-spec";
const base="http://localhost:3100";
async function main(){
for(const b of UNIVERSE.filter(b=>b.symbol)){
    const response=await fetch(`${base}/stocks/${b.symbol!.toLowerCase()}`,{headers:{"User-Agent":"Googlebot"}});
    const html=await response.text();
    assert.equal(response.status,200,b.symbol!);
    for(const text of [b.name,"College Project · Simulated financial data","What Changed?","Possible 30-Day Outcomes","Browse all sources"])
        assert.ok(html.includes(text),`${b.symbol}: ${text}`);
    assert.ok(!html.includes("Research is unavailable"),`${b.symbol}: database-backed research`);
    assert.ok(!html.includes('href="#"'),`${b.symbol}: no placeholder link`);
    console.log(`${b.symbol}: PASS`);
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
console.log("IPO-only routes: 6/6 not-found + noindex (streamed response may be 200); Meruvan historical short-history state: PASS");
}
main().catch(error=>{console.error(error instanceof Error?error.message:"Route verification failed");process.exitCode=1;});
