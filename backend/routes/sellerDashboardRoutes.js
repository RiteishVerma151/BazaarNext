
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSellerDashboard } from "../controllers/sellerDashboardController.js";

const router = express.Router();

router.get("/", protect, getSellerDashboard);

export default router;
