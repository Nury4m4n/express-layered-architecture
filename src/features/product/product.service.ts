// Layer: Service (Business Logic Layer)
//
// Apa fungsi file ini?
// - Menangani aturan bisnis aplikasi (misal cek apakah produk ada, validasi data kosong, dll.).
//
// Kenapa layer ini dipisah?
// - Supaya logika bisnis tidak tercampur dengan urusan teknis HTTP (req/res) di Controller.
// - Supaya apa? Fungsi-fungsi di sini jadi mandiri dan reusable (bisa dipanggil kembali
//   dari mana saja: Controller HTTP, background worker/job, CLI script, maupun WebSocket).
// - Melempar AppError secara spesifik jika ada aturan bisnis yang dilanggar.

import {
  findProducts,
  findProductById,
  insertProduct,
  editProduct,
  deleteProduct,
} from "./product.repository.js";
import type { CreateProductDTO, UpdateProductDTO } from "./product.schema.js";
import type { Product } from "../../../generated/prisma/client.js";
import { AppError } from "@/utils/appError.js";

// GET all products
export const getAllProducts = async (): Promise<Product[]> => {
  const products = await findProducts();
  return products;
};

// GET product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const product = await findProductById(id);

  if (!product) {
    throw AppError.notFound(`Produk dengan ID ${id} tidak ditemukan`);
  }

  return product;
};

// CREATE product
export const createProduct = async (
  newProductData: CreateProductDTO,
): Promise<Product> => {
  const product = await insertProduct(newProductData);
  return product;
};

// DELETE product
export const deleteProductById = async (id: string): Promise<void> => {
  await getProductById(id);
  await deleteProduct(id);
};

// EDIT product
export const editProductById = async (
  id: string,
  productData: UpdateProductDTO,
): Promise<Product> => {
  if (Object.keys(productData).length === 0) {
    throw AppError.badRequest(
      "Setidaknya satu data (nama, harga, deskripsi, atau gambar) harus dikirim untuk pembaruan",
    );
  }

  await getProductById(id);

  const product = await editProduct(id, productData);
  return product;
};
