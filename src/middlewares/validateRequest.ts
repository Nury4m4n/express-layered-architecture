// Middleware: Validate Request (Zod Universal Validator)

// Apa fungsi file ini?
// - Bertugas sebagai satpam di depan pintu gerbang rute untuk memvalidasi data request.

// Cara kerjanya:
// 1. Menerima skema Zod untuk { body, params, query }.
// 2. Jika data yang dikirim client salah/kurang, request langsung ditolak dengan status 400 Bad Request.
// 3. Jika data valid, request diteruskan ke Controller dengan data yang sudah bersih dan ter-sanitize.

import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodType } from "zod";

export interface RequestValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validateRequest = (
  schemas: RequestValidationSchemas,
): RequestHandler => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(
          req.params,
        )) as Request["params"];
      }
      if (schemas.query) {
        await schemas.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
