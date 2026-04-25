import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { RegisterInput, UpdateProfileInput } from "./auth.schema";


export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as RegisterInput;
      if (!name || !email || !password) {
        throw new Error("Enter Required fields");
      }

      const result = await authService.register({
        name,
        email,
        password,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("Enter Required fields");
      }
      const result = await authService.login(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        throw new Error("Enter Required fields");
      }
      const result = await authService.refresh(refreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        throw new Error("Enter Required fields");
      }
      const result = await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.getCurrentUser(req.user!.userId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as UpdateProfileInput;
      const result = await authService.updateProfile(req.user!.userId, input);
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
