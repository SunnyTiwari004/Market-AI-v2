export function assertIdenticalPublishedDataset(existing: { digest: string; published: boolean }, expectedDigest: string) {
    if (existing.digest !== expectedDigest || !existing.published) throw new Error("IMMUTABLE_DATASET_CONFLICT");
}
