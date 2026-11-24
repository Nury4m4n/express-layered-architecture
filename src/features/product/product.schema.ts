// Layer: Schema & DTO (Validation Layer)
//
// Apa fungsi file ini?
// - Mendefinisikan skema aturan validasi input data produk menggunakan library Zod.
// - Menghasilkan tipe data TypeScript (DTO) secara otomatis dari skema Zod (z.infer).
//
// Kenapa layer ini dipisah?
// - Sebagai Single Source of Truth: Aturan validasi runtime dan tipe data statis
//   dibuat dari satu sumber yang sama, jadi tidak perlu menulis interface TypeScript dua kali.
// - Menggunakan .trim() agar input spasi kosong ("   ") otomatis tertolak dan bersih.

import { z } from "zod";

// Validasi URL param :id (format string CUID / CUID2 yang valid)
export const productIdParamSchema = z.object({
  id: z.union([z.string().cuid(), z.string().cuid2()], {
    message: "Product ID harus berupa format CUID yang valid",
  }),
});

// Validasi tambah produk (POST) - semua field wajib ada
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama produk wajib diisi")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z.string().trim().min(1, "Deskripsi produk wajib diisi"),
  image: z.string().trim().min(1, "URL atau path gambar produk wajib diisi"),
  price: z.coerce
    .number()
    .int("Harga produk harus berupa bilangan bulat")
    .positive("Harga produk harus berupa angka positif"),
});

// Validasi update produk (PATCH) - semua field opsional
export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama produk wajib diisi")
    .max(100, "Nama produk maksimal 100 karakter")
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi produk wajib diisi")
    .optional(),
  image: z
    .string()
    .trim()
    .min(1, "URL atau path gambar produk wajib diisi")
    .optional(),
  price: z.coerce
    .number()
    .int("Harga produk harus berupa bilangan bulat")
    .positive("Harga produk harus berupa angka positif")
    .optional(),
});

// Tipe data TypeScript otomatis dari Zod
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
