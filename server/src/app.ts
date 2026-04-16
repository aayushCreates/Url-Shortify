import express from "express";
import { loadExpressMiddlewares } from "./loaders/express";
import { errorHandler } from "./middleware/errorHandler";
import { globalLimiter } from "./loaders/rateLimit";
import authRoutes from "./modules/auth/auth.routes";
import urlRoutes from "./modules/url/url.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import redirectRoutes from "./modules/redirect/redirect.routes";

export function createApp() {
  const app = express();

  loadExpressMiddlewares(app);

  app.use(globalLimiter);

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/urls", urlRoutes);
  app.use("/api/v1/analytics", analyticsRoutes);

  app.use("/", redirectRoutes);

  app.use((_req, res) => {
    res.status(404).json({
      statusCode: 404,
      error: "NOT_FOUND",
      message: "The requested resource was not found",
    });
  });

  app.use(errorHandler);

  return app;
}
