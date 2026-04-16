import { Router } from "express";
import { analyticsController } from "./analytics.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { statsQuerySchema } from "./analytics.schema";

const router = Router();

router.get("/overview", authenticate, (req, res, next) =>
  analyticsController.getOverview(req, res, next),
);

router.get(
  "/:slug",
  authenticate,
  validate({ query: statsQuerySchema }),
  (req, res, next) => analyticsController.getUrlStats(req, res, next),
);

export default router;
