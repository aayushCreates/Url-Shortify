import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { urlController } from "./url.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { createUrlLimiter } from "../../loaders/rateLimit";
import {
  createUrlSchema,
  bulkCreateUrlSchema,
  updateUrlSchema,
  slugParamSchema,
  listUrlsQuerySchema,
} from "./url.schema";

const router = Router();

router.post(
  "/",
  authenticate,
  createUrlLimiter,
  validate({ body: createUrlSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.create(req, res, next),
);

router.post(
  "/bulk",
  authenticate,
  createUrlLimiter,
  validate({ body: bulkCreateUrlSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.bulkCreate(req, res, next),
);

router.get(
  "/",
  authenticate,
  validate({ query: listUrlsQuerySchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.list(req, res, next),
);

router.get(
  "/:slug/qr",
  validate({ params: slugParamSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.generateQrCode(req, res, next),
);

router.get(
  "/:slug",
  authenticate,
  validate({ params: slugParamSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.getBySlug(req, res, next),
);

router.patch(
  "/:slug",
  authenticate,
  validate({ params: slugParamSchema, body: updateUrlSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.update(req, res, next),
);

router.delete(
  "/:slug",
  authenticate,
  validate({ params: slugParamSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    urlController.delete(req, res, next),
);

export default router;
