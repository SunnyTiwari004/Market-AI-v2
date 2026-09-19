import { buildInputs } from "./inputs";
import { buildResearch } from "./research";
import { DATASET, GENERATOR, METHOD, SEED } from "./spec";
import { digest } from "./identity";
export function buildSlice() {
    const inputs = buildInputs(), research = buildResearch(inputs);
    const data = { ...inputs, ...research };
    return { version: DATASET, method: METHOD, generator: GENERATOR, seed: SEED, profile: "three-company-development-slice", digest: digest(data), ...data };
}
export type Slice = ReturnType<typeof buildSlice>;
