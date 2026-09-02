import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { RegisterInput, UpdateProfileInput } from "./auth.schema";
import { Errors } from "../../middleware/errorHandler";


export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as RegisterInput;
      if (!name || !email || !password) {
        throw Errors.badRequest("Enter Required fields");
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
        throw Errors.badRequest("Enter Required fields");
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
        throw Errors.unauthorized("Missing refresh token");
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
        throw Errors.badRequest("Missing refresh token");
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
      let avatarUrl = undefined;
      
      if (req.file) {
        const cloudinary = (await import("../../config/cloudinary")).default;
        
        avatarUrl = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "avatars" },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          
          stream.end(req.file!.buffer);
        });
      }

      // If user sends email it will be ignored since we shouldn't change email easily, but we pass what they send.
      const input = {
        name: req.body.name,
        ...(avatarUrl && { avatarUrl }),
      };

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
