import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodTypeAny } from "zod";

interface ValidateSchemas {
  body?: AnyZodObject | ZodTypeAny;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

export function validate(schemas: ValidateSchemas) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.status(400).json({
          statusCode: 400,
          error: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: formattedErrors,
        });
        return;
      }
      next(error);
    }
  };
}
