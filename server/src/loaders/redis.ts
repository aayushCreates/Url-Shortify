import Redis from "ioredis";
import { env } from "../config/env";
import logger from "../config/logger";

function createRetryStrategy(type: string) {
  return (times: number): number | void => {
    if (times > 20) {
      logger.error(`❌ Redis ${type}: Max retries reached, giving up`);
      return undefined;
    }
    const delay = Math.min(times * 200, 5000);
    logger.warn(
      `⚠️ Redis ${type}: Reconnecting in ${delay}ms (attempt ${times})`,
    );
    return delay;
  };
}

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: createRetryStrategy("Cache"),
  lazyConnect: true, // Don't connect until we explicitly call .connect()
});

export const redisQueue = new Redis(env.REDIS_QUEUE_URL, {
  maxRetriesPerRequest: null, // BullMQ requires this to be null
  enableReadyCheck: true,
  retryStrategy: createRetryStrategy("Queue"),
  lazyConnect: true,
});

function attachListeners(client: Redis, name: string) {
  client.on("connect", () => logger.info(`✅ Redis ${name}: Connected`));
  client.on("ready", () => logger.info(`✅ Redis ${name}: Ready`));
  client.on("error", (err) =>
    logger.error(`❌ Redis ${name}: Error`, { error: err.message }),
  );
  client.on("close", () => logger.warn(`⚠️ Redis ${name}: Connection closed`));
}

export async function connectRedis(): Promise<void> {
  attachListeners(redis, "Cache");
  attachListeners(redisQueue, "Queue");

  const clients = [
    { client: redis, name: "Cache" },
    { client: redisQueue, name: "Queue" },
  ];

  try {
    const connectPromises = clients.map(async ({ client, name }) => {
      if (client.status === "wait" || client.status === "end") {
        logger.debug(`Initiating Redis ${name} connection...`);
        return client.connect();
      }
      logger.debug(`Redis ${name} already in status: ${client.status}`);
      return Promise.resolve();
    });

    await Promise.all(connectPromises);
    logger.info("✅ All Redis connections established");
  } catch (error) {
    logger.error("❌ Redis connection failed", error as Error);
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  await Promise.all([redis.quit(), redisQueue.quit()]);
  logger.info("Redis connections closed");
}
