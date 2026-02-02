import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodTypeAny, z } from "zod";

export function validateSchema<T extends ZodTypeAny>(
  schema: T
): RequestHandler<{}, {}, z.infer<T>> {
  return (req: Request<{}, {}, z.infer<T>>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.format(),
      });
    }
    req.body = result.data;
    next();
  };
}
