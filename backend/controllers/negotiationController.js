
import mongoose from "mongoose";
import Negotiation from "../models/Negotiation.js";
import Product from "../models/Product.js";

export const createOffer = async (req, res) => {
  try {
    const { productId } = req.params;
    const { offerPrice, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (
      offerPrice === undefined ||
      typeof offerPrice !== "number" ||
      !Number.isFinite(offerPrice) ||
      offerPrice < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Offer price must be a number greater than zero",
      });
    }

    if (
      message !== undefined &&
      (typeof message !== "string" || message.trim().length > 500)
    ) {
      return res.status(400).json({
        success: false,
        message: "Message must be a string of at most 500 characters",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      status: "AVAILABLE",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Available product not found",
      });
    }

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot make an offer on your own product",
      });
    }

    const existingOffer = await Negotiation.findOne({
      product: productId,
      buyer: req.user._id,
      status: "PENDING",
    });

    if (existingOffer) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending offer for this product",
      });
    }

    const offer = await Negotiation.create({
      product: product._id,
      buyer: req.user._id,
      seller: product.seller,
      offerPrice,
      message: message?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Offer submitted successfully",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit offer",
    });
  }
};

export const getMyOffers = async (req, res) => {
  try {
    const offers = await Negotiation.find({
      buyer: req.user._id,
    })
      .populate("product", "title price images status")
      .populate("seller", "name avgRating ratingCount")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your offers",
    });
  }
};

export const getReceivedOffers = async (req, res) => {
  try {
    const offers = await Negotiation.find({
      seller: req.user._id,
    })
      .populate("product", "title price images status")
      .populate("buyer", "name avgRating ratingCount")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch received offers",
    });
  }
};

export const respondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer ID",
      });
    }

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACCEPTED or REJECTED",
      });
    }

    const offer = await Negotiation.findOne({
      _id: offerId,
      seller: req.user._id,
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    if (offer.status !== "PENDING") {
      return res.status(409).json({
        success: false,
        message: "This offer has already been processed",
      });
    }

    if (status === "ACCEPTED") {
      const product = await Product.findOne({
        _id: offer.product,
        seller: req.user._id,
        status: "AVAILABLE",
      });

      if (!product) {
        return res.status(409).json({
          success: false,
          message: "This product is no longer available",
        });
      }
    }

    const updatedOffer = await Negotiation.findOneAndUpdate(
      {
        _id: offerId,
        seller: req.user._id,
        status: "PENDING",
      },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(409).json({
        success: false,
        message: "This offer has already been processed",
      });
    }

    if (status === "ACCEPTED") {
      await Negotiation.updateMany(
        {
          product: offer.product,
          _id: { $ne: offer._id },
          status: "PENDING",
        },
        { $set: { status: "REJECTED" } }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Offer ${status.toLowerCase()} successfully`,
      offer: updatedOffer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process offer",
    });
  }
};

export const cancelOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer ID",
      });
    }

    const offer = await Negotiation.findOneAndUpdate(
      {
        _id: offerId,
        buyer: req.user._id,
        status: "PENDING",
      },
      { $set: { status: "CANCELLED" } },
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Pending offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer cancelled successfully",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel offer",
    });
  }
};
