import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { authLimiter } from "../../loaders/rateLimit";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateProfileSchema,
} from "./auth.schema";

const router = Router();

router.get("/me", authenticate, (req, res, next) =>
  authController.getMe(req, res, next),
);

router.patch(
  "/me",
  authenticate,
  validate({ body: updateProfileSchema }),
  (req, res, next) => authController.updateMe(req, res, next),
);

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

// No body validation — token is read from the httpOnly cookie (req.cookies.refreshToken).
// refreshToken in the body is accepted as a fallback for non-browser clients.
router.post("/refresh", (req, res, next) =>
  authController.refresh(req, res, next),
);

router.post("/logout", (req, res, next) =>
  authController.logout(req, res, next),
);

router.post("/revoke-all", authenticate, (req, res, next) =>
  authController.revokeAll(req, res, next),
);

export default router;
