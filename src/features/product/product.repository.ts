// Layer: Repository (Data Access Layer)
//
// Apa fungsi file ini?
// - Khusus untuk berkomunikasi langsung dengan database menggunakan Prisma ORM.
//
// Kenapa layer ini dipisah?
// - Supaya urusan database terisolasi dari logika bisnis (Service) dan HTTP (Controller).
// - Supaya apa? Kalau suatu saat mau ganti ORM (misal ke Drizzle, TypeORM, atau Raw SQL),
//   kita cukup mengedit file ini saja tanpa perlu merombak Controller maupun Service.
// - Pemetaan data dilakukan secara eksplisit untuk mencegah celah Mass-Assignment.

import prisma from "@/db/index.js";
import type { Product } from "../../../generated/prisma/client.js";
import type { CreateProductDTO, UpdateProductDTO } from "./product.schema.js";

// Ambil semua produk
export const findProducts = async (): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });
  return products;
};

// Ambil produk berdasarkan ID
export const findProductById = async (id: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
};

// Tambah produk baru
export const insertProduct = async (
  data: CreateProductDTO,
): Promise<Product> => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      image: data.image,
      price: data.price,
    },
  });
  return product;
};

// Edit data produk berdasarkan ID
export const editProduct = async (
  id: string,
  data: UpdateProductDTO,
): Promise<Product> => {
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.price !== undefined && { price: data.price }),
    },
  });
  return product;
};

// Hapus produk
export const deleteProduct = async (id: string): Promise<void> => {
  await prisma.product.delete({
    where: { id },
  });
};
