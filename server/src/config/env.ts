import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),

  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid connection string"),

  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_QUEUE_URL: z.string().default("redis://localhost:6379/1"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  RATE_LIMIT_CREATE: z.coerce.number().default(30),
  RATE_LIMIT_REDIRECT: z.coerce.number().default(200),

  BASE_URL: z.string().url().default("http://localhost:3000"),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  IP_HASH_SALT: z.string().min(8, "IP_HASH_SALT must be at least 8 characters"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2),
  );
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
