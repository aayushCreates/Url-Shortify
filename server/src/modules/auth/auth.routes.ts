import { Router } from "express";
import { Request, Response, NextFunction } from "express";
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

router.get(
  "/me",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    authController.getMe(req, res, next),
);

import { upload } from "../../middleware/upload";

router.patch(
  "/me",
  authenticate,
  upload.single("avatar"),
  (req: Request, res: Response, next: NextFunction) =>
    authController.updateMe(req, res, next),
);

router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

// No body validation — token is read from the httpOnly cookie (req.cookies.refreshToken).
// refreshToken in the body is accepted as a fallback for non-browser clients.
router.post("/refresh", (req: Request, res: Response, next: NextFunction) =>
  authController.refresh(req, res, next),
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) =>
  authController.logout(req, res, next),
);

router.post(
  "/revoke-all",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    authController.revokeAll(req, res, next),
);

export default router;
