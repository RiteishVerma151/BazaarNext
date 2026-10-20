
import express from "express";
import {
  createOrder,
  getMyOrders,
  getMySales,
  shipOrder,
  confirmDelivery,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/sales", protect, getMySales);
router.patch("/:id/ship", protect, shipOrder);
router.patch("/:id/complete", protect, confirmDelivery);

export default router;
