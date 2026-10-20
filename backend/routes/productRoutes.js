import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getTopSellingProducts } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/mine", protect, getMyProducts);
router.get("/:id", getProductById);
router.post("/", protect, upload.array("images", 5), createProduct);
router.put("/:id", protect, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
