import { Router } from "express";
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
  (req, res, next) => urlController.create(req, res, next),
);

router.post(
  "/bulk",
  authenticate,
  createUrlLimiter,
  validate({ body: bulkCreateUrlSchema }),
  (req, res, next) => urlController.bulkCreate(req, res, next),
);

router.get(
  "/",
  authenticate,
  validate({ query: listUrlsQuerySchema }),
  (req, res, next) => urlController.list(req, res, next),
);

router.get(
  "/:slug/qr",
  validate({ params: slugParamSchema }),
  (req, res, next) => urlController.generateQrCode(req, res, next),
);

router.get(
  "/:slug",
  authenticate,
  validate({ params: slugParamSchema }),
  (req, res, next) => urlController.getBySlug(req, res, next),
);

router.patch(
  "/:slug",
  authenticate,
  validate({ params: slugParamSchema, body: updateUrlSchema }),
  (req, res, next) => urlController.update(req, res, next),
);

router.delete(
  "/:slug",
  authenticate,
  validate({ params: slugParamSchema }),
  (req, res, next) => urlController.delete(req, res, next),
);

export default router;
