import { Request, Response, NextFunction } from "express";
import { redirectService } from "./redirect.service";
import { enqueueClick } from "../analytics/analytics.queue";
import logger from "../../config/logger";

export class RedirectController {
  async redirect(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const password = req.query.pwd as string | undefined;

      const { url, redirectType, urlId, variantId } =
        await redirectService.resolve(slug, password);

      const ip = req.ip || req.socket.remoteAddress || "0.0.0.0";
      const userAgent = req.headers["user-agent"] || "unknown";
      const referrer = req.headers["referer"] || null;

      enqueueClick({
        shortUrlId: urlId,
        slug,
        ip,
        userAgent,
        referrer,
        variantId,
        timestamp: new Date().toISOString(),
      }).catch((err) => {
        logger.error(`Failed to enqueue click job for ${slug}`, {
          error: err.message,
        });
      });

      res.redirect(redirectType, url);
    } catch (error: any) {
      if (error.errorCode) {
        // It's an AppError, redirect to frontend error page
        const frontendUrl = new URL(`${process.env.BASE_URL || 'http://localhost:5173'}/link/${req.params.slug}`);
        frontendUrl.searchParams.set("error", error.errorCode);
        frontendUrl.searchParams.set("message", error.message);
        return res.redirect(302, frontendUrl.toString());
      }
      next(error);
    }
  }
}

export const redirectController = new RedirectController();
