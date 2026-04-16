import { Request, Response, NextFunction } from "express";
import { urlService } from "./url.service";

export class UrlController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await urlService.createUrl(req.body, req.user?.userId);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async bulkCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await urlService.bulkCreate(
        req.body.urls,
        req.user?.userId,
      );
      res.status(201).json({ data: results });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const result = await urlService.getUrlBySlug(slug, req.user?.userId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await urlService.listUrls(req.user!.userId, {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        search: req.query.search as string | undefined,
      });
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const result = await urlService.updateUrl(
        slug,
        req.body,
        req.user!.userId,
      );
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const result = await urlService.deleteUrl(slug, req.user!.userId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async generateQrCode(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const format = (req.query.format as string) === "svg" ? "svg" : "png";
      const color = (req.query.color as string) || "#000000";
      const bgColor = (req.query.bgcolor as string) || "#ffffff";

      const result = await urlService.generateQrCode(
        slug,
        format,
        color,
        bgColor,
      );

      if (format === "svg") {
        res.setHeader("Content-Type", "image/svg+xml");
      } else {
        res.setHeader("Content-Type", "image/png");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

export const urlController = new UrlController();
