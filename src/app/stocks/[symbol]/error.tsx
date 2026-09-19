"use client";
export default function ErrorBoundary({ reset }: {
    reset: () => void;
}) { return <main className="page-container"><h1>Research could not be displayed</h1><p>Please retry. No replacement data has been generated.</p><button onClick={reset}>Try again</button></main>; }
