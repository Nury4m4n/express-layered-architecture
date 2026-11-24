// Layer: Controller (HTTP Handler Layer)
//
// Apa fungsi file ini?
// - Menerima HTTP Request, memanggil fungsi Service yang sesuai, dan membalas HTTP Response.
//
// Kenapa layer ini dipisah?
// - Supaya Controller murni hanya mengurus input dan output HTTP:
//   1. Mengambil data dari req.params, req.body, atau req.query.
//   2. Memanggil Service untuk memproses data.
//   3. Mengemas respon JSON dengan format yang seragam ({ status, data, message }).
// - Jika terjadi error, Controller cukup menangkapnya dengan try/catch lalu mengoper ke next(error)
//   agar ditangani secara terpusat oleh errorHandler.

import { Request, Response, NextFunction } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
} from "./product.service.js";

// GET all products
export const getProductsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.json({
      status: "success",
      data: products,
      message: "Data produk berhasil diambil",
    });
  } catch (error) {
    next(error);
  }
};

// GET product by ID
export const getProductByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const product = await getProductById(productId);
    res.json({
      status: "success",
      data: product,
      message: "Data produk berhasil diambil",
    });
  } catch (error) {
    next(error);
  }
};

// CREATE product (POST)
export const createProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({
      status: "success",
      data: product,
      message: "Produk berhasil ditambahkan",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE product
export const deleteProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    await deleteProductById(productId);
    res.json({
      status: "success",
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

// EDIT product (PUT / PATCH)
export const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const product = await editProductById(productId, req.body);
    res.json({
      status: "success",
      data: product,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};
