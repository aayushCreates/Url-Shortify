import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { redirectController } from "./redirect.controller";
import { redirectLimiter } from "../../loaders/rateLimit";

const router = Router();

router.get(
  "/:slug",
  redirectLimiter,
  (req: Request, res: Response, next: NextFunction) =>
    redirectController.redirect(req, res, next),
);

export default router;
