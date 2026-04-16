import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req.body.refreshToken);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.logout(req.body.refreshToken);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async revokeAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.revokeAllTokens(req.user!.userId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
