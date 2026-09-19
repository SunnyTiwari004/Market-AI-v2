import { createHash } from "node:crypto";
export const hash = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
export const id = (kind: string, key: string) => `${kind}-${hash(["market-ai-synthetic", kind, key].join("\0"))}`;
export function canonical(value: unknown): string {
    if (value === null || typeof value !== "object")
        return JSON.stringify(value);
    if (Array.isArray(value))
        return `[${value.map(canonical).join(",")}]`;
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object).sort().map(k => `${JSON.stringify(k)}:${canonical(object[k])}`).join(",")}}`;
}
export const digest = (value: unknown) => hash(canonical(value));
