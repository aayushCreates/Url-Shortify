import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    errorCode: string,
    message: string,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const Errors = {
  notFound: (resource: string) =>
    new AppError(404, "NOT_FOUND", `${resource} not found`),
  unauthorized: (message = "Authentication required") =>
    new AppError(401, "UNAUTHORIZED", message),
  forbidden: (message = "Access denied") =>
    new AppError(403, "FORBIDDEN", message),
  badRequest: (message: string) => new AppError(400, "BAD_REQUEST", message),
  conflict: (message: string) => new AppError(409, "CONFLICT", message),
  gone: (message = "This resource is no longer available") =>
    new AppError(410, "GONE", message),
  tooMany: (message = "Too many requests") =>
    new AppError(429, "TOO_MANY_REQUESTS", message),
  internal: (message = "Internal server error") =>
    new AppError(500, "INTERNAL_ERROR", message, false),
};

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.warn(`Operational error: ${err.message}`, {
        statusCode: err.statusCode,
        errorCode: err.errorCode,
      });
    } else {
      logger.error(`Non-operational error: ${err.message}`, {
        stack: err.stack,
      });
    }

    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: err.errorCode,
      message: err.message,
    });
    return;
  }

  logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  res.status(500).json({
    statusCode: 500,
    error: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
  });
}
