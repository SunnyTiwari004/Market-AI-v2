import Link from "next/link";
export default function IpoNotFound() {
    return <main id="main-content" className="page-container"><p className="disclosure">College Project · Simulated financial data</p><h1 tabIndex={-1}>IPO not found</h1><p>No canonical offer matches this address.</p><Link className="text-action" href="/ipos">Browse IPOs →</Link></main>;
}
