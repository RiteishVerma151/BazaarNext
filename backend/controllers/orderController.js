
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Negotiation from "../models/Negotiation.js";

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

      product = await Product.findOne({
        _id: negotiation.product,
        status: "AVAILABLE",
      });

      if (!product) {
        return res.status(409).json({
          success: false,
          message: "Product is no longer available",
        });
      }

      if (product.seller.toString() !== negotiation.seller.toString()) {
        return res.status(409).json({
          success: false,
          message: "Negotiation seller does not match product seller",
        });
      }

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

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot purchase your own product",
      });
    }

    const existingOrder = await Order.findOne({
      product: product._id,
      status: { $in: ["pending", "paid"] },
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "An active order already exists for this product",
      });
    }

    if (negotiation) {
      const existingNegotiationOrder = await Order.findOne({
        negotiation: negotiation._id,
      });

      if (existingNegotiationOrder) {
        return res.status(409).json({
          success: false,
          message: "An order already exists for this negotiation",
        });
      }
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
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
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
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your sales",
    });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "paid") {
      return res.status(409).json({
        success: false,
        message: "Only paid orders can be completed",
      });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: id,
        seller: req.user._id,
        status: "paid",
      },
      { $set: { status: "completed" } },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({
        success: false,
        message: "Order status has changed; refresh and try again",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order completed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to complete order",
    });
  }
};
