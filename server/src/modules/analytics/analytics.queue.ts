import { Queue } from "bullmq";
import { redisQueue } from "../../loaders/redis";

export interface ClickJobData {
  shortUrlId: string;
  slug: string;
  ip: string;
  userAgent: string;
  referrer: string | null;
  variantId: string | null;
  timestamp: string; // ISO string — serialization-safe
}

export const clickQueue = new Queue("clicks", {
  connection: redisQueue,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000, // 1s → 5s → 30s
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 500 },
  },
});

export async function enqueueClick(data: ClickJobData): Promise<void> {
  await clickQueue.add("process-click", data, {
    jobId: `${data.shortUrlId}-${data.timestamp}`,
  });
}
