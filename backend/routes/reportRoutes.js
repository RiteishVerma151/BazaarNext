import express from "express";
import {
  getTopSellingProducts,
  getSellerSalesReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/top-selling", getTopSellingProducts);
router.get("/sales", protect, getSellerSalesReport);
router.get("/my-sales", protect, getSellerSalesReport);

export default router;