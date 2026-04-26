import { Prisma } from "@prisma/client";
import { prisma } from "../../loaders/prisma";

export class UrlRepository {
  async findBySlug(slug: string) {
    return prisma.shortUrl.findUnique({
      where: { slug, deletedAt: null },
    });
  }

  async findById(id: string) {
    return prisma.shortUrl.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findBySlugWithVariants(slug: string) {
    return prisma.shortUrl.findUnique({
      where: { slug, deletedAt: null },
      include: { variants: { where: { isActive: true } } },
    });
  }

  async findByUserIdPaginated(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.ShortUrlWhereInput = {
      userId,
      deletedAt: null,
      ...(search && {
        OR: [
          { slug: { contains: search, mode: "insensitive" as const } },
          { originalUrl: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [urls, total] = await Promise.all([
      prisma.shortUrl.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.shortUrl.count({ where }),
    ]);

    return {
      urls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findRecentByUserAndUrl(userId: string, originalUrl: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return prisma.shortUrl.findFirst({
      where: {
        userId,
        originalUrl,
        deletedAt: null,
        createdAt: { gte: twentyFourHoursAgo },
      },
    });
  }

  async create(data: {
    slug: string;
    originalUrl: string;
    userId?: string;
    redirectType?: number;
    expiresAt?: Date;
    passwordHash?: string;
    maxClicks?: number;
    variants?: { url: string; weight: number }[];
  }) {
    return prisma.shortUrl.create({
      data: {
        ...data,
        variants: data.variants
          ? {
              create: data.variants.map((v) => ({
                url: v.url,
                weight: v.weight,
              })),
            }
          : undefined,
      },
    });
  }

  async update(
    slug: string,
    data: Prisma.ShortUrlUpdateInput & {
      variants?: { url: string; weight: number }[];
    },
  ) {
    const { variants, ...updateData } = data;

    return prisma.shortUrl.update({
      where: { slug },
      data: {
        ...updateData,
        ...(variants && {
          variants: {
            deleteMany: {},
            create: variants.map((v: any) => ({
              url: v.url,
              weight: v.weight,
            })),
          },
        }),
      },
    });
  }

  async softDelete(slug: string) {
    return prisma.shortUrl.update({
      where: { slug },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  async incrementClicks(id: string) {
    return prisma.shortUrl.update({
      where: { id },
      data: { totalClicks: { increment: 1 } },
    });
  }

  async getAllSlugs(): Promise<string[]> {
    const urls = await prisma.shortUrl.findMany({
      where: { deletedAt: null },
      select: { slug: true },
    });
    return urls.map((u: any) => u.slug);
  }
}

export const urlRepository = new UrlRepository();
