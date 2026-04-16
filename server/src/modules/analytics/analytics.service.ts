import { prisma } from "../../loaders/prisma";
import { redis } from "../../loaders/redis";
import { Errors } from "../../middleware/errorHandler";
import { StatsQuery } from "./analytics.schema";

export class AnalyticsService {
  async getOverview(userId: string) {
    const totalUrls = await prisma.shortUrl.count({
      where: { userId, deletedAt: null },
    });

    const aggregates = await prisma.shortUrl.aggregate({
      where: { userId, deletedAt: null },
      _sum: {
        totalClicks: true,
        uniqueClicks: true,
      },
    });

    const topUrls = await prisma.shortUrl.findMany({
      where: { userId, deletedAt: null },
      orderBy: { totalClicks: "desc" },
      take: 5,
      select: {
        id: true,
        slug: true,
        originalUrl: true,
        totalClicks: true,
        uniqueClicks: true,
        createdAt: true,
      },
    });

    return {
      totalUrls,
      totalClicks: aggregates._sum.totalClicks || 0,
      uniqueClicks: aggregates._sum.uniqueClicks || 0,
      topUrls,
    };
  }

  async getUrlStats(slug: string, userId: string, query: StatsQuery) {
    const url = await prisma.shortUrl.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true, userId: true, totalClicks: true, uniqueClicks: true },
    });

    if (!url) {
      throw Errors.notFound("Short URL");
    }

    if (url.userId && url.userId !== userId) {
      throw Errors.forbidden("You do not own this URL");
    }

    const [realtimeClicksStr, realtimeUniqueStr] = await redis.mget(
      `clicks:total:${slug}`,
      `clicks:unique:${slug}`,
    );

    const realtimeClicks = realtimeClicksStr
      ? parseInt(realtimeClicksStr)
      : url.totalClicks;
    const realtimeUnique = realtimeUniqueStr
      ? parseInt(realtimeUniqueStr)
      : url.uniqueClicks;

    const timeseries = await prisma.clickStat.findMany({
      where: {
        shortUrlId: url.id,
        period: query.period,
      },
      orderBy: { periodKey: "desc" },
      take: query.limit,
    });

    // For high volume, this should eventually be moved to a materialized view (precompute the data) or specialized OLAP DB (like ClickHouse)
    const [deviceStats, browserStats, osStats, referrerStats] =
      await Promise.all([
        prisma.clickEvent.groupBy({
          by: ["device"],
          where: { shortUrlId: url.id },
          _count: { device: true },
          orderBy: { _count: { device: "desc" } },
        }),
        prisma.clickEvent.groupBy({
          by: ["browser"],
          where: { shortUrlId: url.id, browser: { not: null } },
          _count: { browser: true },
          orderBy: { _count: { browser: "desc" } },
        }),
        prisma.clickEvent.groupBy({
          by: ["os"],
          where: { shortUrlId: url.id, os: { not: null } },
          _count: { os: true },
          orderBy: { _count: { os: "desc" } },
        }),
        prisma.clickEvent.groupBy({
          by: ["referrer"],
          where: { shortUrlId: url.id, referrer: { not: null } },
          _count: { referrer: true },
          orderBy: { _count: { referrer: "desc" } },
          take: 10,
        }),
      ]);

    return {
      totals: {
        clicks: realtimeClicks,
        uniques: realtimeUnique,
      },
      timeseries: timeseries.reverse(), // Return chronological order
      breakdown: {
        device: deviceStats.map((d: any) => ({
          name: d.device,
          count: d._count.device,
        })),
        browser: browserStats.map((b: any) => ({
          name: b.browser,
          count: b._count.browser,
        })),
        os: osStats.map((o: any) => ({ name: o.os, count: o._count.os })),
        referrer: referrerStats.map((r: any) => ({
          name: r.referrer,
          count: r._count.referrer,
        })),
      },
    };
  }
}

export const analyticsService = new AnalyticsService();
