import { prisma } from "../../loaders/prisma";
import { redis } from "../../loaders/redis";
import { Errors } from "../../middleware/errorHandler";
import { StatsQuery } from "./analytics.schema";

interface OverviewQuery {
  from?: string;
  to?: string;
}

const DEVICE_COLORS: Record<string, string> = {
  desktop: "#4F46E5",
  mobile: "#10B981",
  tablet: "#F59E0B",
  unknown: "#94A3B8",
};

export class AnalyticsService {
  async getOverview(userId: string, query: OverviewQuery = {}) {
    // Default to last 14 days if no range given
    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from
      ? new Date(query.from)
      : new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

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

    // Get all URL IDs for this user
    const userUrls = await prisma.shortUrl.findMany({
      where: { userId, deletedAt: null },
      select: { id: true },
    });
    const urlIds = userUrls.map((u) => u.id);

    // Build daily clicks between from/to
    const fromKey = from.toISOString().split("T")[0];
    const toKey = to.toISOString().split("T")[0];

    const dailyStats = await prisma.clickStat.groupBy({
      by: ["periodKey"],
      where: {
        period: "day",
        shortUrlId: { in: urlIds },
        periodKey: { gte: fromKey, lte: toKey },
      },
      _sum: { clicks: true, uniques: true },
    });

    // Build full date range with 0-filled gaps
    const dayCount = Math.max(
      1,
      Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1
    );

    const dailyClicks = Array.from({ length: dayCount }).map((_, i) => {
      const d = new Date(from);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      const stat = dailyStats.find((s) => s.periodKey === key);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        clicks: stat?._sum.clicks ?? 0,
        unique: stat?._sum.uniques ?? 0,
      };
    });

    // Global aggregations from ClickEvent (scoped to date range)
    const [deviceStats, referrerStats, locationStats] = await Promise.all([
      prisma.clickEvent.groupBy({
        by: ["device"],
        where: {
          shortUrlId: { in: urlIds },
          createdAt: { gte: from, lte: to },
        },
        _count: { device: true },
        orderBy: { _count: { device: "desc" } },
      }),
      prisma.clickEvent.groupBy({
        by: ["referrer"],
        where: {
          shortUrlId: { in: urlIds },
          referrer: { not: null },
          createdAt: { gte: from, lte: to },
        },
        _count: { referrer: true },
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),
      prisma.clickEvent.groupBy({
        by: ["country"],
        where: {
          shortUrlId: { in: urlIds },
          country: { not: null },
          createdAt: { gte: from, lte: to },
        },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),
    ]);

    // Compute total clicks for share calculation
    const totalDeviceClicks = deviceStats.reduce(
      (sum, d) => sum + d._count.device,
      0
    );
    const totalReferrerClicks = referrerStats.reduce(
      (sum, r) => sum + (r._count.referrer ?? 0),
      0
    );

    const devices = deviceStats.map((d) => ({
      name: d.device
        ? d.device.charAt(0).toUpperCase() + d.device.slice(1)
        : "Unknown",
      value: d._count.device,
      color: DEVICE_COLORS[d.device?.toLowerCase() ?? "unknown"] ?? "#94A3B8",
    }));

    const referrers = referrerStats.map((r) => {
      const count = r._count.referrer ?? 0;
      return {
        source: r.referrer ?? "Direct",
        visits: count,
        share:
          totalReferrerClicks > 0
            ? Math.round((count / totalReferrerClicks) * 100)
            : 0,
      };
    });

    const locations = locationStats.map((l) => ({
      country: l.country ?? "Unknown",
      code: l.country ?? "XX",
      visits: l._count.country,
    }));

    return {
      stats: {
        totalUrls,
        totalUrlsGrowth: 0,
        totalClicks: aggregates._sum.totalClicks ?? 0,
        totalClicksGrowth: 0,
        uniqueVisitors: aggregates._sum.uniqueClicks ?? 0,
        uniqueVisitorsGrowth: 0,
        overallGrowth: 0,
        overallGrowthVsLastMonth: 0,
      },
      dailyClicks,
      topUrls,
      devices,
      referrers,
      locations,
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
