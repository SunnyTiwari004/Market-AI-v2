"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function RetryDiscovery() {
    const router = useRouter(), [pending, startTransition] = useTransition();
    return <><button disabled={pending} onClick={() => startTransition(() => router.refresh())}>Retry data connection</button><p role="status">{pending ? "Retrying the canonical data read…" : ""}</p></>;
}
