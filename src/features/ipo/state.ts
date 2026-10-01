export const LEVELS = ["simple", "normal", "pro"] as const;
export type Level = typeof LEVELS[number];
export function ipoLevel(query: Record<string, string | string[] | undefined>): Level {
    return LEVELS.find(level => level === query.level) ?? "simple";
}
export function ipoUrl(slug: string, level: Level) {
    return `/ipos/${encodeURIComponent(slug)}${level === "simple" ? "" : `?level=${level}`}`;
}
