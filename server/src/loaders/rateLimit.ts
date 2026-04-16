import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const createUrlLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.RATE_LIMIT_CREATE,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    error: "TOO_MANY_REQUESTS",
    message: `Too many URLs created. Limit: ${env.RATE_LIMIT_CREATE} per minute.`,
  },
});

export const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.RATE_LIMIT_REDIRECT,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    error: "TOO_MANY_REQUESTS",
    message: "Too many requests. Please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    error: "TOO_MANY_REQUESTS",
    message: "Too many login attempts. Please try again in 5 minutes.",
  },
});

export const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    error: "TOO_MANY_REQUESTS",
    message: "Global rate limit exceeded. Please try again later.",
  },
});
