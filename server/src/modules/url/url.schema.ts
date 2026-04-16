import { z } from "zod";

import { isUrlSafe } from "../../lib/urlValidator";

export const createUrlSchema = z.object({
  url: z
    .string()
    .url("Must be a valid URL")
    .max(2048, "URL must be under 2048 characters")
    .refine(isUrlSafe, "URL is forbidden or unsafe (check blocklist or localhost)"),
  customSlug: z
    .string()
    .regex(
      /^[a-zA-Z0-9-]{3,32}$/,
      "Custom slug must be 3-32 chars, alphanumeric or hyphens",
    )
    .optional(),
  expiresAt: z.coerce.date().optional(),
  password: z.string().min(1).optional(),
  maxClicks: z.number().int().positive().optional(),
  redirectType: z.enum(["301", "302"]).default("302"),
  variants: z
    .array(
      z.object({
        url: z.string().url("Must be a valid URL").max(2048).refine(isUrlSafe, "Variant URL is forbidden or unsafe"),
        weight: z.number().int().positive().default(50),
      }),
    )
    .max(5, "Maximum 5 variants allowed")
    .optional(),
});

export const bulkCreateUrlSchema = z.object({
  urls: z
    .array(createUrlSchema)
    .min(1, "At least one URL is required")
    .max(50, "Maximum 50 URLs per request"),
});

export const updateUrlSchema = z.object({
  url: z.string().url().max(2048).refine(isUrlSafe, "URL is forbidden or unsafe (check blocklist or localhost)").optional(),
  expiresAt: z.coerce.date().nullable().optional(),
  password: z.string().min(1).nullable().optional(),
  maxClicks: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
  redirectType: z.enum(["301", "302"]).optional(),
  variants: z
    .array(
      z.object({
        url: z.string().url("Must be a valid URL").max(2048).refine(isUrlSafe, "Variant URL is forbidden or unsafe"),
        weight: z.number().int().positive().default(50),
      }),
    )
    .max(5, "Maximum 5 variants allowed")
    .optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const listUrlsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type BulkCreateUrlInput = z.infer<typeof bulkCreateUrlSchema>;
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;
export type ListUrlsQuery = z.infer<typeof listUrlsQuerySchema>;
