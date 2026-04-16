import { Worker, Job } from "bullmq";
import { UAParser } from "ua-parser-js";
import { redisQueue } from "../../loaders/redis";
import { redis } from "../../loaders/redis";
import { prisma } from "../../loaders/prisma";
import { hashVisitor } from "../../lib/hash";
import { lookupIP } from "../../lib/geoip";
import { ClickJobData } from "./analytics.queue";
import logger from "../../config/logger";

// periodKey helpers — produce consistent keys for time-series aggregation
function getPeriodKey(
  date: Date,
  period: "hour" | "day" | "week" | "month",
): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");

  switch (period) {
    case "hour":
      return `${y}-${m}-${d}T${h}`;
    case "day":
      return `${y}-${m}-${d}`;
    case "week": {
      const day = date.getUTCDay() || 7;
      const monday = new Date(date);
      monday.setUTCDate(date.getUTCDate() - day + 1);
      const wy = monday.getUTCFullYear();
      const wm = String(monday.getUTCMonth() + 1).padStart(2, "0");
      const wd = String(monday.getUTCDate()).padStart(2, "0");
      return `${wy}-${wm}-${wd}`;
    }
    case "month":
      return `${y}-${m}`;
  }
}

async function processClick(job: Job<ClickJobData>): Promise<void> {
  const { shortUrlId, slug, ip, userAgent, referrer, variantId, timestamp } =
    job.data;

  const clickedAt = new Date(timestamp);

  const parser = new UAParser(userAgent);
  const ua = parser.getResult();
  const device = ua.device.type ?? "desktop";
  const browser = ua.browser.name ?? null;
  const os = ua.os.name ?? null;

  // Hash visitor identity for unique-click tracking (GDPR-safe, no raw IP stored)
  const visitorHash = hashVisitor(ip, userAgent);

  // GeoIP Lookup
  const { country, city } = lookupIP(ip);

  const uniqueKey = `unique:${shortUrlId}:${visitorHash}`;
  const isNew = await redis.set(uniqueKey, "1", "EX", 24 * 60 * 60 * 90, "NX"); //  EX = expire time, NX = only set if not exists
  const isUnique = isNew !== null;

  await prisma.clickEvent.create({
    data: {
      shortUrlId,
      visitorHash,
      country,
      city,
      device,
      browser,
      os,
      referrer,
      variantId,
      createdAt: clickedAt,
    },
  });

  await prisma.shortUrl.update({
    where: { id: shortUrlId },
    data: {
      totalClicks: { increment: 1 },
      ...(isUnique && { uniqueClicks: { increment: 1 } }),
    },
  });

  await redis.incr(`clicks:total:${slug}`);
  if (isUnique) {
    await redis.incr(`clicks:unique:${slug}`);
  }

  const periods = ["hour", "day", "week", "month"] as const;
  for (const period of periods) {
    const periodKey = getPeriodKey(clickedAt, period);
    await prisma.clickStat.upsert({
      where: {
        shortUrlId_period_periodKey: { shortUrlId, period, periodKey },
      },
      create: {
        shortUrlId,
        period,
        periodKey,
        clicks: 1,
        uniques: isUnique ? 1 : 0,
      },
      update: {
        clicks: { increment: 1 },
        ...(isUnique && { uniques: { increment: 1 } }),
      },
    });
  }

  if (variantId) {
    await prisma.aBVariant.update({
      where: { id: variantId },
      data: {
        clicks: { increment: 1 },
        ...(isUnique && { uniques: { increment: 1 } }),
      },
    });
  }

  logger.debug(`Click processed for slug: ${slug}`, {
    device,
    browser,
    os,
    isUnique,
  });
}

export function createClickWorker(): Worker<ClickJobData> {
  const worker = new Worker<ClickJobData>("clicks", processClick, {
    connection: redisQueue,
    concurrency: 5, // Process 5 click events in parallel per worker instance
  });

  worker.on("completed", (job) => {
    logger.debug(`Click job completed: ${job.id}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Click job failed: ${job?.id}`, { error: err.message });
  });

  worker.on("error", (err) => {
    logger.error("Click worker error", { error: err.message });
  });

  return worker;
}
