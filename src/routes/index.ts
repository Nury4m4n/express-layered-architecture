// Central Route Aggregator
//
// Apa fungsi file ini?
// - Pintu utama yang mengumpulkan dan memetakan seluruh rute fitur di aplikasi.
// - Rute fitur product di-mount ke prefix path: /products

import { Router } from "express";
import productRouter from "@/features/product/product.route.js";

const router: Router = Router();

// Rute Product di-mount ke /products
router.use("/products", productRouter);

export default router;
