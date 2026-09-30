import { DiscoveryPage } from "../features/discovery/page";
import type { Query } from "../features/discovery/state";
export const dynamic = "force-dynamic";
export default async function Home({ searchParams }: { searchParams: Promise<Query> }) {
    return <DiscoveryPage route="/" query={await searchParams}/>;
}
