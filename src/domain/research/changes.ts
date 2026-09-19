import { D } from "./metrics";
import { result, unavailable, type Snapshot } from "./types";
import { METRIC_LABELS } from "./metric-labels";
export function whatChanged(previous: Snapshot | null, current: Snapshot) {
    if (!previous)
        return unavailable<ChangeSet>("NO_PRIOR_SNAPSHOT");
    if (["dataset", "method", "issuerId", "listingId", "horizon", "basis"].some(k => previous[k as keyof Snapshot] !== current[k as keyof Snapshot]) || previous.cutoff >= current.cutoff)
        return unavailable<ChangeSet>("INCOMPATIBLE_SNAPSHOTS");
    const fields = ["risk", "picture", "business", "growth", "financial", "valuation", "direction", "confidence"] as const;
    const categories = fields.map(field => { const before = previous[field], after = current[field]; const ordinal = ["Weak", "Mixed", "Strong"]; const directional = ["picture", "business", "growth", "financial"].includes(field) && before.value !== null && after.value !== null; return { field, before: before.value, after: after.value, state: before.availability !== "available" && after.availability === "available" ? "Newly available" : after.availability !== "available" ? "Unavailable" : before.value === after.value ? "Unchanged" : directional ? (ordinal.indexOf(after.value!) > ordinal.indexOf(before.value!) ? "Improved" : "Weakened") : "Changed" }; });
    const metrics = Object.entries(current.metrics).map(([field, after]) => { const key = field as keyof Snapshot["metrics"], before = previous.metrics[key], unit = METRIC_LABELS[key][1]; return { field, label: METRIC_LABELS[key][0], unit: unit.startsWith("%") ? "percentage points" : unit, before: before.value, after: after.value, delta: before.value !== null && after.value !== null ? new D(after.value).minus(before.value).toFixed(12) : null }; });
    return result({ previousId: previous.id, currentId: current.id, from: previous.cutoff, to: current.cutoff, annualPeriods: [previous.annualEnd, current.annualEnd], ttmPeriods: [previous.ttmEnd, current.ttmEnd], categories, metrics, addedEvidence: current.evidenceIds.filter(id => !previous.evidenceIds.includes(id)), removedEvidence: previous.evidenceIds.filter(id => !current.evidenceIds.includes(id)), headlines: categories.filter(c => c.state !== "Unchanged").slice(0, 3) });
}
export interface ChangeSet {
    previousId: string;
    currentId: string;
    from: string;
    to: string;
    annualPeriods: (string | null)[];
    ttmPeriods: (string | null)[];
    categories: {
        field: string;
        before: string | null;
        after: string | null;
        state: string;
    }[];
    metrics: {
        field: string;
        label: string;
        unit: string;
        before: string | null;
        after: string | null;
        delta: string | null;
    }[];
    addedEvidence: string[];
    removedEvidence: string[];
    headlines: {
        field: string;
        before: string | null;
        after: string | null;
        state: string;
    }[];
}
