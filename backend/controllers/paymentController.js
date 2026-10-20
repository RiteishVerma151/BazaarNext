import mongoose from "mongoose";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";
import Product from "../models/Product.js";

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can pay for this order",
      });
    }

    if (order.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "This order cannot be paid",
      });
    }

    const existingPayment = await Payment.findOne({
      order: order._id,
    });

    if (existingPayment?.status === "success") {
      return res.status(409).json({
        success: false,
        message: "Payment has already succeeded",
      });
    }

    if (existingPayment?.razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message: "Payment order already exists",
        keyId: process.env.RAZORPAY_KEY_ID,
        payment: existingPayment,
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay API keys are not configured",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = Math.round(order.price * 100);

    if (!Number.isSafeInteger(amount) || amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be at least ₹1",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `bn_${order._id.toString()}`,
    });

    const payment = await Payment.create({
      order: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount,
      status: "created",
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      keyId: process.env.RAZORPAY_KEY_ID,
      payment: {
        id: payment._id,
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "All payment verification fields are required",
      });
    }

    const payment = await Payment.findOne({
      razorpayOrderId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const order = await Order.findById(payment.order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can verify this payment",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpaySignature, "hex");

    const signatureIsValid =
      expectedBuffer.length === receivedBuffer.length &&
      expectedBuffer.length > 0 &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signatureIsValid) {
      if (payment.status !== "success") {
        payment.status = "failed";
        await payment.save();
      }

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    if (payment.status === "success" && order.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    if (payment.status !== "created" || order.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Payment or order cannot be verified in its current state",
      });
    }

    const product = await Product.findById(order.product);

    if (!product || product.status !== "AVAILABLE") {
      return res.status(409).json({
        success: false,
        message: "Product is no longer available",
      });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.status = "success";
    await payment.save();

    order.status = "paid";
    await order.save();

    product.status = "SOLD";
    product.soldCount = (product.soldCount || 0) + 1;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
      payment: {
        id: payment._id,
        razorpayPaymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export { createPaymentOrder, verifyPayment };
