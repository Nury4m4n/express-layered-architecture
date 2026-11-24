// Layer: Route (Routing & Endpoint Definition)
//
// Apa fungsi file ini?
// - Menentukan pemetaan URL endpoint (misal GET /products, POST /products).
// - Menghubungkan middleware validasi (validateRequest) ke handler Controller yang sesuai.
//
// Kenapa layer ini dipisah?
// - Supaya daftar endpoint terlihat jelas dalam satu pandangan tanpa tercampur kode logic handler.
// - Seluruh rute produk ini bersifat publik (bebas diakses tanpa token/auth).

import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  productIdParamSchema,
  createProductSchema,
  updateProductSchema,
} from "./product.schema.js";
import {
  getProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "./product.controller.js";

const router: Router = Router();

// GET all products
router.get("/", getProductsHandler);

// GET product by ID
router.get(
  "/:id",
  validateRequest({ params: productIdParamSchema }),
  getProductByIdHandler,
);

// POST product (tambah baru)
router.post(
  "/",
  validateRequest({ body: createProductSchema }),
  createProductHandler,
);

// PUT product (full update - semua field wajib ada)
router.put(
  "/:id",
  validateRequest({ params: productIdParamSchema, body: createProductSchema }),
  updateProductHandler,
);

// PATCH product (partial update - field opsional)
router.patch(
  "/:id",
  validateRequest({ params: productIdParamSchema, body: updateProductSchema }),
  updateProductHandler,
);

// DELETE product
router.delete(
  "/:id",
  validateRequest({ params: productIdParamSchema }),
  deleteProductHandler,
);

export default router;
