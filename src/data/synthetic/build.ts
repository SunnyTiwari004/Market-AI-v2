import { buildInputs } from "./inputs";
import { buildResearch } from "./research";
import { DATASET, GENERATOR, METHOD, SEED } from "./spec";
import { digest } from "./identity";
import { buildCorpus } from "./corpus";
import { buildIpoResearch } from "./ipo-research";
export function buildSlice() {
    const initial = buildInputs(), corpus = buildCorpus(initial);
    const inputs = {...initial,evidence:[...initial.evidence,...corpus.evidence]};
    const research = buildResearch(inputs);
    const data = { ...corpus, ...inputs, ...research, ipoResearch:buildIpoResearch(inputs,corpus.offers) };
    return { version: DATASET, method: METHOD, generator: GENERATOR, seed: SEED, profile: "full-release-1-universe", digest: digest(data), ...data };
}
export type Slice = ReturnType<typeof buildSlice>;
