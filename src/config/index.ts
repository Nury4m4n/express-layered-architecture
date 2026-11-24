// Configuration Layer

// Apa fungsi file ini?
// - Membaca file .env dan memvalidasi tipe datanya menggunakan Zod saat booting.

// Kenapa menggunakan pola ini?
// 1. Fail-Fast: Jika variabel penting (seperti DATABASE_URL) lupa diisi di .env,
//    server langsung menolak menyala dan memberi tahu yang kurang, bukan crash diam-diam nanti.
// 2. Type-Casting: Mengubah string .env (misal PORT="5000") menjadi tipe number murni (5000).
// 3. Centralized: File lain tinggal mengimpor objek config dengan autocomplete tanpa menyentuh process.env.

import dotenv from "dotenv";
import { z } from "zod";

// Muat isi file .env
dotenv.config();

// Skema validasi variabel .env dengan Zod
const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi di file .env"),
  CORS_ORIGIN: z.string().default("*"),
});

// Cek apakah konfigurasi .env sudah benar saat server mulai
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("FATAL: Konfigurasi environment (.env) tidak valid:");
  for (const issue of parsedEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const env = parsedEnv.data;

// Konfigurasi aplikasi
export const config = {
  app: {
    port: env.PORT,
    env: env.NODE_ENV,
    isProd: env.NODE_ENV === "production",
  },
  db: {
    url: env.DATABASE_URL,
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
};

export default config;
