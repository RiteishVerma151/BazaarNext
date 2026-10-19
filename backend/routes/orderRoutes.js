
import express from "express";
import {
  createOrder,
  getMyOrders,
  getMySales,
  completeOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/sales", getMySales);
router.patch("/:id/complete", completeOrder);

export default router;
