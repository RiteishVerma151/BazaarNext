import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const getTopSellingProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50",
      });
    }

    const products = await Order.aggregate([
      {
        $match: {
          status: { $in: ["paid", "completed"] },
        },
      },
      {
        $group: {
          _id: "$product",
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
        },
      },
      {
        $sort: {
          totalSales: -1,
          totalRevenue: -1,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $match: {
          "product.status": { $ne: "REMOVED" },
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "product.seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: "$product._id",
          title: "$product.title",
          description: "$product.description",
          price: "$product.price",
          category: "$product.category",
          condition: "$product.condition",
          images: "$product.images",
          status: "$product.status",
          seller: {
            _id: "$seller._id",
            name: "$seller.name",
            avgRating: "$seller.avgRating",
            ratingCount: "$seller.ratingCount",
          },
          totalSales: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch top-selling products",
    });
  }
};

const getSellerSalesReport = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);
    const { from, to } = req.query;

    const match = {
      seller: sellerId,
      status: { $in: ["paid", "completed"] },
    };

    if (from || to) {
      match.createdAt = {};

      if (from) {
        const fromDate = new Date(from);

        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid from date",
          });
        }

        match.createdAt.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);

        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid to date",
          });
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(to)) {
          toDate.setUTCHours(23, 59, 59, 999);
        }

        match.createdAt.$lte = toDate;
      }

      if (
        match.createdAt.$gte &&
        match.createdAt.$lte &&
        match.createdAt.$gte > match.createdAt.$lte
      ) {
        return res.status(400).json({
          success: false,
          message: "From date cannot be after to date",
        });
      }
    }

    const [summaryResult, productBreakdown] = await Promise.all([
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalSalesAmount: { $sum: "$price" },
            totalSales: { $sum: 1 },
            completedOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
            paidOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "paid"] }, 1, 0],
              },
            },
          },
        },
      ]),
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$product",
            orders: { $sum: 1 },
            revenue: { $sum: "$price" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            title: { $ifNull: ["$product.title", "Deleted product"] },
            orders: 1,
            revenue: 1,
          },
        },
        { $sort: { revenue: -1 } },
      ]),
    ]);

    const result = summaryResult[0] || {
      totalSalesAmount: 0,
      totalSales: 0,
      completedOrders: 0,
      paidOrders: 0,
    };

    return res.status(200).json({
      success: true,
      filters: {
        from: from || null,
        to: to || null,
      },
      report: {
        totalSalesAmount: result.totalSalesAmount,
        totalSales: result.totalSales,
        completedOrders: result.completedOrders,
        paidOrders: result.paidOrders,
      },
      products: productBreakdown,
    });
  } catch (error) {
    console.error("Seller sales report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate sales report",
    });
  }
};

export { getTopSellingProducts, getSellerSalesReport };
