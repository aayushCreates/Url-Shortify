import { createApp } from "./app";
import { env } from "./config/env";
import logger from "./config/logger";
import { connectDatabase, disconnectDatabase } from "./loaders/prisma";
import { connectRedis, disconnectRedis } from "./loaders/redis";
import { createClickWorker } from "./modules/analytics/analytics.worker";
import { initGeoIP } from "./lib/geoip";

async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    await initGeoIP();

    const app = createApp();
    const server = app.listen(env.PORT, env.HOST, () => {
      logger.info(
        `🚀 Server running at http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`,
      );
    });

    const clickWorker = createClickWorker();

    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed — no new connections accepted");

        try {
          await clickWorker.close();
          logger.info("Click worker stopped");

          await disconnectRedis();
          await disconnectDatabase();
          logger.info("✅ Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown", { error });
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error("⚠️ Forced shutdown — graceful shutdown timed out");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: unknown) => {
      logger.error("Unhandled Promise Rejection", { reason });
    });

    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
      });
      shutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    logger.error("❌ Failed to start server", { error });
    process.exit(1);
  }
}

startServer();
