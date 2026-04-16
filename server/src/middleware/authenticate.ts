import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errorHandler";

export interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(
      401,
      "UNAUTHORIZED",
      "Missing or invalid Authorization header",
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError(401, "UNAUTHORIZED", "Token not provided");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, "TOKEN_EXPIRED", "Access token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, "INVALID_TOKEN", "Invalid access token");
    }
    next(error);
  }
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required");
  }

  if (req.user.role !== "ADMIN") {
    throw new AppError(403, "FORBIDDEN", "Admin access required");
  }

  next();
}
