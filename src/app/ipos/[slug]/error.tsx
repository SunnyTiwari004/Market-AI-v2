"use client";
export default function IpoError({ reset }: { reset: () => void }) {
    return <main id="main-content" className="page-container"><p className="disclosure">College Project · Simulated financial data</p><h1 tabIndex={-1}>IPO research could not be loaded</h1><p>Your requested address is preserved. Try loading it again.</p><button onClick={reset}>Try again</button></main>;
}
