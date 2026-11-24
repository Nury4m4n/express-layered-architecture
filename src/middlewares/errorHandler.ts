// Middleware: Global Error Handler

// Apa fungsi file ini?
// - Menjadi muara akhir penanganan seluruh error yang terjadi di aplikasi.

// Kenapa dipusatkan di sini?
// - Controller tidak perlu repot menyusun pesan error dan status code secara manual.
// - Menghandle otomatis:
//   1. ZodError: Error validasi input -> status 400 Bad Request.
//   2. AppError: Error operasional bisnis -> status dinamis (404, 400, 409, dll.).
//   3. Prisma Error: Error database unik P2002 -> 409, data hilang P2025 -> 404.
//   4. 500 Uncaught: Crash tak terduga -> stack trace disembunyikan jika production demi keamanan.

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import config from "@/config/index.js";
import { AppError } from "@/utils/appError.js";
import { Prisma } from "../../generated/prisma/client.js";

// Handler untuk rute yang tidak ditemukan (404)
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).json({
    status: "fail",
    message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
};

// Handler utama penanganan error
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // 1. Error validasi dari Zod (400 Bad Request)
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      status: "fail",
      message: "Validasi data gagal",
      errors: formattedErrors,
    });
    return;
  }

  // 2. Custom error aplikasi (AppError)
  if (err instanceof AppError) {
    const status = err.statusCode >= 500 ? "error" : "fail";
    res.status(err.statusCode).json({
      status,
      message: err.message,
      ...(!config.app.isProd && { stack: err.stack }),
    });
    return;
  }

  // 3. Error database dari Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === "P2002") {
      const metaTarget = err.meta?.target;
      const target = Array.isArray(metaTarget)
        ? metaTarget.join(", ")
        : typeof metaTarget === "string"
          ? metaTarget
          : "data";
      res.status(409).json({
        status: "fail",
        message: `Field '${target}' sudah terdaftar dalam sistem`,
      });
      return;
    }

    // P2025: Record tidak ditemukan saat update / delete
    if (err.code === "P2025") {
      res.status(404).json({
        status: "fail",
        message: "Data yang diminta tidak ditemukan di database",
      });
      return;
    }

    res.status(400).json({
      status: "fail",
      message: `Database error: [${err.code}] ${err.message}`,
    });
    return;
  }

  // 4. Error tidak terduga lainnya (500)
  console.error("[Unhandled Error]:", err);

  res.status(500).json({
    status: "error",
    message: config.app.isProd
      ? "Terjadi kesalahan internal pada server"
      : err.message || "Internal Server Error",
    ...(!config.app.isProd && { stack: err.stack }),
  });
};
