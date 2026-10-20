import express from "express";
import {
  getAllUsers,
  toggleUserBlock,
  getAllProducts,
  removeProduct,
  getAdminStats,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleUserBlock);
router.get("/products", getAllProducts);
router.delete("/products/:id", removeProduct);
router.get("/stats", getAdminStats);

export default router;