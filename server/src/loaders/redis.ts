import Redis from "ioredis";
import { env } from "../config/env";
import logger from "../config/logger";

/**
 * Redis Connection Manager
 * ------------------------
 * WHY `ioredis` OVER `redis` (node-redis):
 * - Built-in auto-reconnection with configurable retry strategies.
 * - Native support for Redis Cluster and Sentinel (for future scaling).
 * - Cleaner Promise-based API without needing `.connect()` explicitly.
 * - Slightly better performance in benchmarks for pipeline-heavy workloads.
 *
 * WHY TWO SEPARATE CONNECTIONS:
 * We create two Redis instances:
 * 1. `redis` — For caching (slug->URL lookups, QR codes, Bloom filter).
 * 2. `redisQueue` — For BullMQ job queue (on a different Redis DB index).
 *
 * Separating them provides fault isolation: if the job queue's Redis
 * connection gets saturated or fails, it won't affect cache lookups
 * (which are latency-critical for redirects).
 *
 * RETRY STRATEGY:
 * On connection failure, we use exponential backoff (doubles each attempt,
 * capped at 5 seconds). After 20 failed retries (~2 minutes), we stop
 * retrying and let the health check report the service as unhealthy.
 */

function createRetryStrategy(type: string) {
  return (times: number): number | void => {
    if (times > 20) {
      logger.error(`❌ Redis ${type}: Max retries reached, giving up`);
      return undefined; // Stop retrying
    }
    const delay = Math.min(times * 200, 5000);
    logger.warn(
      `⚠️ Redis ${type}: Reconnecting in ${delay}ms (attempt ${times})`
    );
    return delay;
  };
}

// Main cache connection
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: createRetryStrategy("Cache"),
  lazyConnect: true, // Don't connect until we explicitly call .connect()
});

// BullMQ queue connection (separate DB)
export const redisQueue = new Redis(env.REDIS_QUEUE_URL, {
  maxRetriesPerRequest: null, // BullMQ requires this to be null
  enableReadyCheck: true,
  retryStrategy: createRetryStrategy("Queue"),
  lazyConnect: true,
});

// Attach event listeners for observability
function attachListeners(client: Redis, name: string) {
  client.on("connect", () => logger.info(`✅ Redis ${name}: Connected`));
  client.on("ready", () => logger.info(`✅ Redis ${name}: Ready`));
  client.on("error", (err) =>
    logger.error(`❌ Redis ${name}: Error`, { error: err.message })
  );
  client.on("close", () => logger.warn(`⚠️ Redis ${name}: Connection closed`));
}

/**
 * Connect both Redis instances.
 * Called once during server startup.
 */
export async function connectRedis(): Promise<void> {
  attachListeners(redis, "Cache");
  attachListeners(redisQueue, "Queue");

  try {
    await Promise.all([redis.connect(), redisQueue.connect()]);
    logger.info("✅ All Redis connections established");
  } catch (error) {
    logger.error("❌ Redis connection failed", { error });
    process.exit(1);
  }
}

/**
 * Gracefully disconnect both Redis instances.
 * Called during server shutdown.
 */
export async function disconnectRedis(): Promise<void> {
  await Promise.all([redis.quit(), redisQueue.quit()]);
  logger.info("Redis connections closed");
}
