// Server Bootstrap & Graceful Shutdown
//
// Apa fungsi file ini?
// - Titik awal (entrypoint) untuk menyalakan HTTP server Express pada PORT yang ditentukan.
// - Menangani Graceful Shutdown: Saat server dimatikan (Ctrl+C / stop container),
//   server menyelesaikan request yang sedang berjalan dan menutup koneksi database Prisma
//   dengan aman sebelum proses benar-benar berhenti.

import type { Server } from "node:http";
import app from "@/app.js";
import config from "@/config/index.js";
import prisma from "@/db/index.js";

const PORT = config.app.port;

// Nyalakan server
const server: Server = app.listen(PORT, () => {
  console.log(`Express API running on port ${PORT} | Mode: ${config.app.env}`);
});

let isShuttingDown = false;

// Graceful shutdown saat menerima Ctrl+C atau perintah stop dari OS
const gracefulShutdown = (signal: string): void => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[Shutdown] Menerima sinyal ${signal}. Menutup server...`);

  // Selesaikan request berjalan lalu tutup koneksi database
  server.close((error?: Error) => {
    if (error) {
      console.error("[Shutdown] Gagal menutup HTTP server:", error);
      process.exit(1);
    }

    prisma
      .$disconnect()
      .then(() => {
        console.log("[Shutdown] Koneksi Prisma ditutup dengan aman. Selesai.");
        process.exit(0);
      })
      .catch((disconnectError) => {
        console.error(
          "[Shutdown] Gagal menutup koneksi Prisma:",
          disconnectError,
        );
        process.exit(1);
      });
  });

  // Matikan paksa jika proses shutdown melebihi 10 detik
  setTimeout(() => {
    console.error(
      "[Shutdown] Penutupan melebihi batas waktu (10 detik), mematikan paksa.",
    );
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
