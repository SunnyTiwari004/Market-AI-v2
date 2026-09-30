import Link from "next/link";
export default function NotFound() { return <main id="main-content" className="page-container"><h1 tabIndex={-1}>Page not found</h1><p>This destination is not available.</p><Link className="text-action" href="/">Return Home</Link></main>; }
