
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

const VALID_RANGES = ["7d", "30d", "3m", "6m", "1y"];

const getRangeStart = (range) => {
  const date = new Date();

  if (range === "7d") date.setDate(date.getDate() - 6);
  else if (range === "30d") date.setDate(date.getDate() - 29);
  else if (range === "3m") date.setMonth(date.getMonth() - 3);
  else if (range === "6m") date.setMonth(date.getMonth() - 6);
  else date.setFullYear(date.getFullYear() - 1);

  date.setHours(0, 0, 0, 0);
  return date;
};

const getDateKey = (date, monthly) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  if (monthly) return `${year}-${month}`;

  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const sellerObjectId = new mongoose.Types.ObjectId(
      sellerId.toString()
    );

    const range = VALID_RANGES.includes(req.query.range)
      ? req.query.range
      : "30d";

    const startDate = getRangeStart(range);
    const monthly = ["3m", "6m", "1y"].includes(range);

    const revenueStatuses = ["paid", "shipped", "completed"];

    const [
      allOrders,
      rangeOrders,
      recentOrders,
      reviewStats,
      reviews,
      seller,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { seller: sellerObjectId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            paidOrders: {
              $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] },
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            revenue: {
              $sum: {
                $cond: [
                  { $in: ["$status", revenueStatuses] },
                  "$price",
                  0,
                ],
              },
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            seller: sellerObjectId,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: monthly
              ? {
                  $dateToString: {
                    format: "%Y-%m",
                    date: "$createdAt",
                  },
                }
              : {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
            orders: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $in: ["$status", revenueStatuses] },
                  "$price",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Order.find({ seller: sellerId })
        .populate("product", "title images price status")
        .populate("buyer", "name email")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),

      Review.aggregate([
        { $match: { reviewee: sellerObjectId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),

      Review.find({ reviewee: sellerId })
        .populate("reviewer", "name")
        .populate({
          path: "order",
          select: "product",
          populate: { path: "product", select: "title images" },
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      User.findById(sellerId).select("name avgRating ratingCount").lean(),
    ]);

    const stats = allOrders[0] || {
      totalOrders: 0,
      pendingOrders: 0,
      paidOrders: 0,
      shippedOrders: 0,
      completedOrders: 0,
      revenue: 0,
    };

    // Fill missing dates/months so the chart has a continuous timeline.
    const buckets = new Map(
      rangeOrders.map((item) => [item._id, item])
    );

    const chart = [];
    const cursor = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (cursor <= today) {
      const key = getDateKey(cursor, monthly);
      const bucket = buckets.get(key);

      chart.push({
        date: key,
        revenue: bucket?.revenue || 0,
        orders: bucket?.orders || 0,
      });

      if (monthly) {
        cursor.setMonth(cursor.getMonth() + 1);
        cursor.setDate(1);
      } else {
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    const ratings = reviewStats[0] || {
      averageRating: 0,
      totalReviews: 0,
    };

    return res.status(200).json({
      success: true,
      seller: {
        id: sellerId,
        name: seller?.name || "Seller",
      },
      summary: {
        ...stats,
        revenue: Math.round((stats.revenue || 0) * 100) / 100,
        averageRating: Math.round((ratings.averageRating || 0) * 100) / 100,
        totalReviews: ratings.totalReviews || 0,
      },
      analytics: {
        range,
        chart,
        rangeRevenue: chart.reduce(
          (total, item) => total + item.revenue,
          0
        ),
        rangeOrders: chart.reduce(
          (total, item) => total + item.orders,
          0
        ),
      },
      orders: recentOrders,
      reviews,
    });
  } catch (error) {
    console.error("Seller dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load seller dashboard",
    });
  }
};

export { getSellerDashboard };
