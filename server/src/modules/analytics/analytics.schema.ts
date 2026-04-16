import { z } from "zod";

export const statsQuerySchema = z.object({
  slug: z.string().min(1),
  period: z.enum(["hour", "day", "week", "month"]).default("day"),
  limit: z.coerce.number().min(1).max(100).default(30),
});

export type StatsQuery = z.infer<typeof statsQuerySchema>;
