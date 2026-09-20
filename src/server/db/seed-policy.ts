export function assertIdenticalPublishedDataset(existing: { digest: string; published: boolean }, expectedDigest: string) {
    if (existing.digest !== expectedDigest || !existing.published) throw new Error("IMMUTABLE_DATASET_CONFLICT");
}
export const LEGACY_DATASET="market-ai-core-slice-v1";
export function assertKnownDevelopmentTransition(datasets: {version:string;profile:string;digest:string;published:boolean}[], method:{specificationDigest:string;implementationDigest:string}, expectedSpecification:string){
    if(datasets.length!==1||datasets[0].version!==LEGACY_DATASET||datasets[0].profile!=="three-company-development-slice"||!datasets[0].published||datasets[0].digest!=="31486d2793a8bd571703d0904ea28f4399a660c62e336ab78eff51b357702de5"||method.specificationDigest!==expectedSpecification||method.implementationDigest!=="1bfa28ffad6953e14f18553a2bcf362d54442b2bc8ef98cd21176f9e5bf25486")throw new Error("UNRECOGNIZED_DEVELOPMENT_TRANSITION");
}
