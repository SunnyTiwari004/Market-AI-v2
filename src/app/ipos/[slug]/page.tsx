import { notFound } from "next/navigation";
import { getIpoResearch } from "../../../server/ipo-research";
import { IpoResearch } from "../../../features/ipo/view";
import { ipoLevel, ipoUrl } from "../../../features/ipo/state";
export const dynamic = "force-dynamic";
export default async function IpoPage({ params, searchParams }: {
    params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { slug } = await params, level = ipoLevel(await searchParams), result = await getIpoResearch(slug);
    if (result.status === "not-found") notFound();
    if (result.status === "data-unavailable") return <main id="main-content" className="page-container"><p className="disclosure">College Project · Simulated financial data</p><h1 tabIndex={-1}>IPO research is unavailable</h1><p>The research database could not be reached or is not ready. No replacement financial data is shown.</p><a className="button" href={ipoUrl(slug, level)}>Try again</a></main>;
    return <IpoResearch data={result.data} level={level}/>;
}
