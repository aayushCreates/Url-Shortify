import { redis } from "../../loaders/redis";
import { urlRepository } from "../url/url.repository";
import { verifyPassword } from "../../lib/hash";
import { AppError, Errors } from "../../middleware/errorHandler";
import logger from "../../config/logger";

const CACHE_TTL = 3600; // 1 hour

interface CachedUrl {
  originalUrl: string;
  redirectType: number;
  passwordHash?: string | null;
  isActive: boolean;
  expiresAt?: string | null;
  maxClicks?: number | null;
  totalClicks: number;
  id: string;
  variants: { id: string; url: string; weight: number }[];
}

export class RedirectService {
  async resolve(
    slug: string,
    password?: string,
  ): Promise<{ url: string; redirectType: number; urlId: string; variantId: string | null }> {
    let cached: CachedUrl | null = null;

    const cacheKey = `url:${slug}`;
    const cachedRaw = await redis.get(cacheKey);

    if (cachedRaw) {
      cached = JSON.parse(cachedRaw) as CachedUrl;
    } else {
      const dbUrl = await urlRepository.findBySlugWithVariants(slug);
      if (!dbUrl) {
        throw Errors.notFound("Short URL");
      }

      cached = {
        originalUrl: dbUrl.originalUrl,
        redirectType: dbUrl.redirectType,
        passwordHash: dbUrl.passwordHash,
        isActive: dbUrl.isActive,
        expiresAt: dbUrl.expiresAt?.toISOString() ?? null,
        maxClicks: dbUrl.maxClicks,
        totalClicks: dbUrl.totalClicks,
        id: dbUrl.id,
        variants: dbUrl.variants.map((v) => ({
          id: v.id,
          url: v.url,
          weight: v.weight,
        })),
      };

      await redis.set(cacheKey, JSON.stringify(cached), "EX", CACHE_TTL);
      logger.debug(`Cache populated for slug: ${slug}`);
    }

    if (!cached.isActive) {
      throw Errors.gone("This short URL has been disabled");
    }

    if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) {
      throw Errors.gone("This short URL has expired");
    }

    if (
      cached.maxClicks !== null &&
      cached.maxClicks !== undefined &&
      cached.totalClicks >= cached.maxClicks
    ) {
      throw Errors.gone("This short URL has reached its click limit");
    }

    if (cached.passwordHash) {
      if (!password) {
        throw new AppError(
          401,
          "PASSWORD_REQUIRED",
          "This short URL is password-protected. Provide ?pwd= query parameter.",
        );
      }
      const valid = await verifyPassword(password, cached.passwordHash);
      if (!valid) {
        throw new AppError(401, "INVALID_PASSWORD", "Incorrect password");
      }
    }

    // A/B Testing Logic
    let targetUrl = cached.originalUrl;
    let variantId: string | null = null;

    if (cached.variants && cached.variants.length > 0) {
      const totalVariantWeight = cached.variants.reduce((sum, v) => sum + v.weight, 0);
      const originalWeight = Math.max(0, 100 - totalVariantWeight);
      const totalWeight = originalWeight + totalVariantWeight;

      let roll = Math.random() * totalWeight;

      if (roll < originalWeight) {
        targetUrl = cached.originalUrl;
        variantId = null;
      } else {
        roll -= originalWeight;
        for (const variant of cached.variants) {
          if (roll < variant.weight) {
            targetUrl = variant.url;
            variantId = variant.id;
            break;
          }
          roll -= variant.weight;
        }
      }
    }

    return {
      url: targetUrl,
      redirectType: cached.redirectType,
      urlId: cached.id,
      variantId,
    };
  }
}

export const redirectService = new RedirectService();
