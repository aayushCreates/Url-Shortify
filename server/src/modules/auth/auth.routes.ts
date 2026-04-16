import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { authLimiter } from "../../loaders/rateLimit";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  (req, res, next) => authController.register(req, res, next),
);

router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  (req, res, next) => authController.login(req, res, next),
);

router.post(
  "/refresh",
  validate({ body: refreshSchema }),
  (req, res, next) => authController.refresh(req, res, next),
);

router.post(
  "/logout",
  validate({ body: refreshSchema }),
  (req, res, next) => authController.logout(req, res, next),
);

router.post(
  "/revoke-all",
  authenticate,
  (req, res, next) => authController.revokeAll(req, res, next),
);

export default router;
