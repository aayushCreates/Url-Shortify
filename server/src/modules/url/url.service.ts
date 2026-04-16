import { urlRepository } from "./url.repository";
import { CreateUrlInput, UpdateUrlInput, ListUrlsQuery } from "./url.schema";
import { generateSlug, isValidCustomSlug } from "../../lib/slugGenerator";
import { bloomCheck, bloomAdd } from "../../lib/bloomFilter";
import { hashPassword } from "../../lib/hash";
import { redis } from "../../loaders/redis";
import { AppError, Errors } from "../../middleware/errorHandler";
import { env } from "../../config/env";
import logger from "../../config/logger";

const MAX_SLUG_RETRIES = 5;
const CACHE_TTL = 3600;

export class UrlService {
  private async generateUniqueSlug(): Promise<string> {
    for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
      const slug = generateSlug();

      const maybeExists = await bloomCheck(slug);

      if (!maybeExists) {
        return slug;
      }

      const existing = await urlRepository.findBySlug(slug);
      if (!existing) {
        return slug;
      }

      logger.debug(`Slug collision on attempt ${attempt + 1}: ${slug}`);
    }

    throw new AppError(
      500,
      "SLUG_GENERATION_FAILED",
      `Failed to generate unique slug after ${MAX_SLUG_RETRIES} attempts`,
    );
  }

  async createUrl(input: CreateUrlInput, userId?: string) {
    let slug: string;

    if (input.customSlug) {
      if (!isValidCustomSlug(input.customSlug)) {
        throw Errors.badRequest(
          "Custom slug must be 3-32 chars, alphanumeric or hyphens",
        );
      }

      const existing = await urlRepository.findBySlug(input.customSlug);
      if (existing) {
        throw Errors.conflict(`Slug "${input.customSlug}" is already taken`);
      }
      slug = input.customSlug;
    } else {
      // if same user shortened same URL in last 24h, return existing
      if (userId) {
        const recent = await urlRepository.findRecentByUserAndUrl(
          userId,
          input.url,
        );
        if (recent) {
          return {
            ...recent,
            shortUrl: `${env.BASE_URL}/${recent.slug}`,
            deduplicated: true,
          };
        }
      }
      slug = await this.generateUniqueSlug();
    }

    let passwordHash: string | undefined;
    if (input.password) {
      passwordHash = await hashPassword(input.password);
    }

    const shortUrl = await urlRepository.create({
      slug,
      originalUrl: input.url,
      userId,
      redirectType: parseInt(input.redirectType),
      expiresAt: input.expiresAt,
      passwordHash,
      maxClicks: input.maxClicks,
    });

    await bloomAdd(slug);
    await redis.set(
      `url:${slug}`,
      JSON.stringify({
        originalUrl: shortUrl.originalUrl,
        redirectType: shortUrl.redirectType,
      }),
      "EX",
      CACHE_TTL,
    );

    return {
      ...shortUrl,
      shortUrl: `${env.BASE_URL}/${slug}`,
    };
  }

  async bulkCreate(urls: CreateUrlInput[], userId?: string) {
    const results = await Promise.allSettled(
      urls.map((input) => this.createUrl(input, userId)),
    );

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return { success: true, data: result.value, index };
      }
      return {
        success: false,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Unknown error",
        index,
      };
    });
  }

  async getUrlBySlug(slug: string, userId?: string) {
    const url = await urlRepository.findBySlug(slug);
    if (!url) {
      throw Errors.notFound("Short URL");
    }

    if (url.userId && url.userId !== userId) {
      throw Errors.forbidden("You do not own this URL");
    }

    return { ...url, shortUrl: `${env.BASE_URL}/${url.slug}` };
  }

  async listUrls(userId: string, query: ListUrlsQuery) {
    return urlRepository.findByUserIdPaginated(
      userId,
      query.page,
      query.limit,
      query.search,
    );
  }

  async updateUrl(slug: string, input: UpdateUrlInput, userId: string) {
    const existing = await urlRepository.findBySlug(slug);
    if (!existing) {
      throw Errors.notFound("Short URL");
    }
    if (existing.userId !== userId) {
      throw Errors.forbidden("You do not own this URL");
    }

    const updateData: Record<string, unknown> = {};
    if (input.url !== undefined) updateData.originalUrl = input.url;
    if (input.expiresAt !== undefined) updateData.expiresAt = input.expiresAt;
    if (input.maxClicks !== undefined) updateData.maxClicks = input.maxClicks;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.redirectType !== undefined)
      updateData.redirectType = parseInt(input.redirectType);

    if (input.password !== undefined) {
      updateData.passwordHash = input.password
        ? await hashPassword(input.password)
        : null;
    }

    const updated = await urlRepository.update(slug, updateData);

    await redis.del(`url:${slug}`);

    return { ...updated, shortUrl: `${env.BASE_URL}/${slug}` };
  }

  async deleteUrl(slug: string, userId: string) {
    const existing = await urlRepository.findBySlug(slug);
    if (!existing) {
      throw Errors.notFound("Short URL");
    }
    if (existing.userId !== userId) {
      throw Errors.forbidden("You do not own this URL");
    }

    await urlRepository.softDelete(slug);
    await redis.del(`url:${slug}`);

    return { message: "URL deleted successfully" };
  }

  async generateQrCode(
    slug: string,
    format: "png" | "svg",
    color: string,
    bgColor: string,
  ) {
    const url = await urlRepository.findBySlug(slug);
    if (!url) {
      throw Errors.notFound("Short URL");
    }

    const shortUrl = `${env.BASE_URL}/${url.slug}`;
    const QRCode = await import("qrcode");

    if (format === "svg") {
      return QRCode.toString(shortUrl, {
        type: "svg",
        color: { dark: color, light: bgColor },
        margin: 1,
      });
    }

    return QRCode.toBuffer(shortUrl, {
      type: "png",
      color: { dark: color, light: bgColor },
      margin: 1,
    });
  }
}

export const urlService = new UrlService();
