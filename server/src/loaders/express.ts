import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "../config/env";
import logger from "../config/logger";

export function loadExpressMiddlewares(app: Express): void {
  app.set("trust proxy", 1); // Trust first proxy (needed for rate limiting behind Nginx/LB)
  app.use(helmet());

  const allowedOrigins = env.CORS_ORIGINS.split(",").map((s) => s.trim());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  const morganStream = {
    write: (message: string) => {
      logger.http(message.trim());
    },
  };

  //'combined' format in production (Apache-style, good for log parsing)
  const morganFormat = env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(morganFormat, { stream: morganStream }));
}
