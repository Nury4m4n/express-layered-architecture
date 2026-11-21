import { Request, Response, NextFunction } from "express";
import { config } from "@/config/index.js";

export interface CustomError extends Error {
  statusCode?: number;
}

// 1. Tangkap jika rute tidak ditemukan (404)
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).json({
    status: "error",
    message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
};

// 2. Tangkap semua error server / controller
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode || 400;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(!config.app.isProd && { stack: err.stack }),
  });
};
