import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";
import { StatsQuery } from "./analytics.schema";

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await analyticsService.getOverview(req.user!.userId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUrlStats(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const query = req.query as unknown as StatsQuery;
      
      const result = await analyticsService.getUrlStats(slug, req.user!.userId, query);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
