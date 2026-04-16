import { Router } from "express";
import { redirectController } from "./redirect.controller";
import { redirectLimiter } from "../../loaders/rateLimit";

const router = Router();

router.get("/:slug", redirectLimiter, (req, res, next) =>
  redirectController.redirect(req, res, next),
);

export default router;
