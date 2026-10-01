import "server-only";
import { readIpo } from "./ipo-repository";
import { buildIpo } from "../features/ipo/model";
export async function getIpoResearch(slug: string) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return { status: "not-found" as const };
    try {
        const records = await readIpo(slug);
        return records ? { status: "available" as const, data: buildIpo(records) } : { status: "not-found" as const };
    } catch {
        console.error("IPO research read failed", { operation: "ipo-research", code: "DATA_UNAVAILABLE" });
        return { status: "data-unavailable" as const };
    }
}
