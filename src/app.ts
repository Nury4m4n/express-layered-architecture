// Express Application Setup
//
// Apa fungsi file ini?
// - Merakit aplikasi Express: memasang middleware global (CORS, guard, json parser),
//   mendaftarkan rute fitur, dan memasang error handler di baris paling bawah.

import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "@/config/index.js";
import routes from "@/routes/index.js";
import { checkJsonContentType } from "@/middlewares/requestGuard.js";
import { notFoundHandler, errorHandler } from "@/middlewares/errorHandler.js";

const app: Application = express();

// Sembunyikan identitas server Express
app.disable("x-powered-by");

// Konfigurasi CORS
app.use(cors({ origin: config.cors.origin }));

// Validasi Content-Type: application/json jika ada body
app.use(checkJsonContentType);

// Body parser dengan batas payload 10kb
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Healthcheck route
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Selamat datang di API Product",
  });
});

// Daftarkan rute aplikasi
app.use(routes);

// Error handlers (wajib di paling bawah)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
