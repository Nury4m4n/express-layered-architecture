// Database Connection (Prisma Client Singleton)
//
// Apa fungsi file ini?
// - Menginisialisasi koneksi Prisma Client ke PostgreSQL menggunakan adapter PrismaPg (Prisma 7).
//
// Kenapa memakai pola Singleton?
// - Dalam mode development (tsx watch), server sering restart otomatis saat file diedit.
//   Pola globalThis ini mencegah pembuatan koneksi berulang kali yang bisa menyebabkan
//   database kehabisan kuota koneksi (connection pool exhaustion).

import config from "@/config/index.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = config.db.url;

// Inisialisasi adapter driver PostgreSQL untuk Prisma 7
const adapter = new PrismaPg({ connectionString });

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Gunakan koneksi global yang sudah ada atau buat baru (mencegah kebocoran saat hot-reload)
const prisma = globalThis.prisma || new PrismaClient({ adapter });

if (!config.app.isProd) {
  globalThis.prisma = prisma;
}

export default prisma;
