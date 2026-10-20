import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    if (typeof comment !== "string" || comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be a string of at most 1000 characters",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Reviews are allowed only after order completion",
      });
    }

    const currentUserId = req.user._id.toString();
    const buyerId = order.buyer.toString();
    const sellerId = order.seller.toString();

    let revieweeId;

    if (currentUserId === buyerId) {
      revieweeId = order.seller;
    } else if (currentUserId === sellerId) {
      revieweeId = order.buyer;
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not part of this order",
      });
    }

    const review = await Review.create({
      order: order._id,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment: comment.trim(),
    });

    const ratingStats = await Review.aggregate([
      {
        $match: {
          reviewee: revieweeId,
        },
      },
      {
        $group: {
          _id: "$reviewee",
          avgRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (ratingStats.length > 0) {
      await User.findByIdAndUpdate(revieweeId, {
        avgRating: Math.round(ratingStats[0].avgRating * 100) / 100,
        ratingCount: ratingStats[0].ratingCount,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
      avgRating: ratingStats[0]?.avgRating,
      ratingCount: ratingStats[0]?.ratingCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this order",
      });
    }

    console.error("Create review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId).select(
      "name avgRating ratingCount"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name")
      .populate("order", "product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        avgRating: user.avgRating,
        ratingCount: user.ratingCount,
      },
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

export { createReview, getUserReviews };