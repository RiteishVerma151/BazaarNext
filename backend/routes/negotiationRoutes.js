
import express from "express";
import {
  createOffer,
  getMyOffers,
  getReceivedOffers,
  respondToOffer,
  cancelOffer,
} from "../controllers/negotiationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyOffers);
router.get("/received", getReceivedOffers);
router.post("/:productId", createOffer);
router.patch("/:offerId/respond", respondToOffer);
router.patch("/:offerId/cancel", cancelOffer);

export default router;
