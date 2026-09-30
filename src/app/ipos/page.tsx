import { DiscoveryPage } from "../../features/discovery/page";
import type { Query } from "../../features/discovery/state";
export const dynamic = "force-dynamic";
export default async function Ipos({ searchParams }: { searchParams: Promise<Query> }) {
    return <DiscoveryPage route="/ipos" query={await searchParams}/>;
}
