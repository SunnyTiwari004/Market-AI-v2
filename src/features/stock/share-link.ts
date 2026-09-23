type ShareCapabilities = {
    share?: (data: { title: string; url: string }) => Promise<void>;
    copy?: (url: string) => Promise<void>;
};
export async function shareLink(url: string, capabilities: ShareCapabilities): Promise<"shared" | "cancelled" | "copied" | "manual"> {
    if (capabilities.share) {
        try {
            await capabilities.share({ title: "MARKET AI · Simulated stock research", url });
            return "shared";
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") return "cancelled";
        }
    }
    if (capabilities.copy) {
        try { await capabilities.copy(url); return "copied"; }
        catch { /* A selectable URL remains available when clipboard access fails. */ }
    }
    return "manual";
}
