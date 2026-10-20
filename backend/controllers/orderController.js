import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Negotiation from "../models/Negotiation.js";

const ACTIVE_ORDER_STATUSES = ["pending", "paid", "shipped"];

export const createOrder = async (req, res) => {
  try {
    const { productId, negotiationId } = req.body;

    if (
      (!productId && !negotiationId) ||
      (productId && negotiationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide either productId or negotiationId",
      });
    }

    let product;
    let price;
    let negotiation = null;

    if (negotiationId) {
      if (!mongoose.Types.ObjectId.isValid(negotiationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid negotiation ID",
        });
      }

      negotiation = await Negotiation.findOne({
        _id: negotiationId,
        buyer: req.user._id,
        status: "ACCEPTED",
      });

      if (!negotiation) {
        return res.status(404).json({
          success: false,
          message: "Accepted negotiation not found for this buyer",
        });
      }

      // Reuse an existing order for this accepted negotiation.
      const existingNegotiationOrder = await Order.findOne({
        negotiation: negotiation._id,
      });

      if (existingNegotiationOrder) {
        if (
          existingNegotiationOrder.buyer.toString() ===
            req.user._id.toString() &&
          existingNegotiationOrder.status === "pending"
        ) {
          return res.status(200).json({
            success: true,
            message: "Existing order retrieved successfully",
            order: existingNegotiationOrder,
          });
        }

        return res.status(409).json({
          success: false,
          message:
            "An order already exists for this offer. Check My Orders for its status.",
          order: existingNegotiationOrder,
        });
      }

      product = await Product.findById(negotiation.product);

      if (!product || product.status !== "AVAILABLE") {
        return res.status(409).json({
          success: false,
          message: "Product is no longer available",
        });
      }

      if (
        product.seller.toString() !==
        negotiation.seller.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: "Negotiation seller does not match product seller",
        });
      }

      // Charge the agreed offer price, not the listing price.
      price = negotiation.offerPrice;
    } else {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      product = await Product.findOne({
        _id: productId,
        status: "AVAILABLE",
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Available product not found",
        });
      }

      price = product.price;
    }

    if (
      product.seller.toString() === req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot purchase your own product",
      });
    }

    // A product can have only one active order at a time.
    const existingOrder = await Order.findOne({
      product: product._id,
      status: { $in: ACTIVE_ORDER_STATUSES },
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message:
          "An active order already exists for this product. Check My Orders.",
      });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
      negotiation: negotiation?._id || null,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("createOrder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    })
      .populate("product", "title price images status")
      .populate("seller", "name email username")
      .populate("negotiation", "offerPrice status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
    });
  }
};

export const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({
      seller: req.user._id,
    })
      .populate("product", "title price images status")
      .populate("buyer", "name email username")
      .populate("negotiation", "offerPrice status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMySales error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your sales",
    });
  }
};

// Seller confirms shipment: paid -> shipped.
export const shipOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: id,
        seller: req.user._id,
        status: "paid",
      },
      {
        $set: {
          status: "shipped",
          shippedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      const order = await Order.findOne({
        _id: id,
        seller: req.user._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found for this seller",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "Only paid orders can be marked as shipped",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order marked as shipped successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("shipOrder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark order as shipped",
    });
  }
};

// Buyer confirms delivery: shipped -> completed.
export const confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: id,
        buyer: req.user._id,
        status: "shipped",
      },
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      const order = await Order.findOne({
        _id: id,
        buyer: req.user._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found for this buyer",
        });
      }

      return res.status(409).json({
        success: false,
        message:
          "You can confirm delivery only after the seller marks the order as shipped",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery confirmed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("confirmDelivery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm delivery",
    });
  }
};

export const completeOrder = confirmDelivery;