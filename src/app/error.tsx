"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main-content" className="page-container"><h1 tabIndex={-1}>Unable to show this research</h1><p>Your requested state remains in the URL. Please try again.</p><button onClick={reset}>Try again</button></main>; }
