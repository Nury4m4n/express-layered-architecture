// Middleware: Request Guard (Content-Type Enforcement)

// Apa fungsi file ini?
// - Memastikan request yang membawa body (POST, PUT, PATCH) wajib memakai header:
//   Content-Type: application/json

// Kenapa ini penting?
// - Standar keamanan API RESTful agar server tidak menerima format payload yang tidak terduga
//   dan memastikan body parser Express bekerja dengan benar.

import { Request, Response, NextFunction } from "express";

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

export const checkJsonContentType = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!METHODS_WITH_BODY.has(req.method)) {
    next();
    return;
  }

  const contentType = req.headers["content-type"];
  const contentLength = req.headers["content-length"];

  const hasBody =
    (contentLength !== undefined && contentLength !== "0") ||
    req.headers["transfer-encoding"] !== undefined;

  if (hasBody && !contentType?.toLowerCase().startsWith("application/json")) {
    res.status(400).json({
      status: "fail",
      message: "Header Content-Type wajib berupa application/json",
    });
    return;
  }

  next();
};
