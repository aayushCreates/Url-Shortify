import { redis } from "../loaders/redis";
import logger from "../config/logger";

const BLOOM_KEY = "bloom:slugs";
const BLOOM_SIZE = 1_000_000; // bits
const HASH_COUNT = 7;

// Generate k hash positions using double hashing technique.
// Instead of k independent hash functions, we use:
//   h(i) = (h1 + i * h2) mod m
// where h1 and h2 are derived from a single FNV-1a hash.
// Effective as k independent hashes.
function getHashPositions(slug: string): number[] {
  let h1 = 2166136261; // FNV offset basis
  let h2 = 0;

  for (let i = 0; i < slug.length; i++) {
    h1 ^= slug.charCodeAt(i);
    h1 = Math.imul(h1, 16777619); // FNV prime
  }

  // Second hash from reversed string
  for (let i = slug.length - 1; i >= 0; i--) {
    h2 ^= slug.charCodeAt(i);
    h2 = Math.imul(h2, 16777619);
  }

  h1 = h1 >>> 0; // Convert to unsigned 32-bit
  h2 = h2 >>> 0;

  const positions: number[] = [];
  for (let i = 0; i < HASH_COUNT; i++) {
    positions.push(((h1 + i * h2) >>> 0) % BLOOM_SIZE);
  }
  return positions;
}

export async function bloomAdd(slug: string): Promise<void> {
  const positions = getHashPositions(slug);
  const pipeline = redis.pipeline();
  for (const pos of positions) {
    pipeline.setbit(BLOOM_KEY, pos, 1);
  }
  await pipeline.exec();
}

export async function bloomCheck(slug: string): Promise<boolean> {
  const positions = getHashPositions(slug);
  const pipeline = redis.pipeline();
  for (const pos of positions) {
    pipeline.getbit(BLOOM_KEY, pos);
  }
  const results = await pipeline.exec();
  if (!results) return false;

  // If ANY bit is 0, the slug is definitely not in the set
  return results.every(([err, val]) => !err && val === 1);
}

// Rebuild the entire Bloom filter from a list of slugs (called by nightly cron)
export async function bloomRebuild(slugs: string[]): Promise<void> {
  logger.info(`Rebuilding Bloom filter with ${slugs.length} slugs...`);
  await redis.del(BLOOM_KEY);
  for (const slug of slugs) {
    await bloomAdd(slug);
  }
  logger.info("Bloom filter rebuilt successfully");
}
