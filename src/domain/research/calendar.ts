const DAY = 86400000;
export const CUTOFFS = ["2026-08-01", "2026-08-31", "2026-09-30"] as const;
export const START = "2024-09-30";
export const END = "2026-09-30";
export const timestamp = (date: string) => `${date}T18:00:00+05:30`;
export function addDays(date: string, days: number) { return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10); }
export function daysBetween(start: string, end: string) { return (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY; }
export function isSession(date: string) { const day = new Date(`${date}T00:00:00Z`).getUTCDay(); return day > 0 && day < 6; }
export function sessions(start: string, end: string) { const dates: string[] = []; for (let d = start; d <= end; d = addDays(d, 1))
    if (isSession(d))
        dates.push(d); return dates; }
export function cutoffSession(cutoff: string) {
    const instant = Date.parse(cutoff.length === 10 ? timestamp(cutoff) : cutoff);
    if (!Number.isFinite(instant))
        throw new Error("Invalid cutoff");
    let date = new Date(instant + 330 * 60000).toISOString().slice(0, 10);
    if (Date.parse(`${date}T15:30:00+05:30`) > instant)
        date = addDays(date, -1);
    while (!isSession(date))
        date = addDays(date, -1);
    return date;
}
export function fullPeriod(start: string, end: string, basis: "annual" | "quarterly") {
    const year = Number(start.slice(0, 4));
    if (basis === "annual")
        return start === `${year}-04-01` && end === `${year + 1}-03-31`;
    const ends: Record<string, string> = { "01-01": "03-31", "04-01": "06-30", "07-01": "09-30", "10-01": "12-31" };
    return ends[start.slice(5)] !== undefined && end === `${year}-${ends[start.slice(5)]}`;
}
export function previousSession(session: string) {
    return cutoffSession(addDays(session, -1));
}
