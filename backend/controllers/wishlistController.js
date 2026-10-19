
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      match: { status: "AVAILABLE" },
      populate: {
        path: "seller",
        select: "name avgRating ratingCount",
      },
    });

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
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
      return res.status(400).json({
        success: false,
        message: "You cannot wishlist your own product",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: product._id } },
      { new: true }
    ).populate({
      path: "wishlist",
      match: { status: "AVAILABLE" },
      populate: {
        path: "seller",
        select: "name avgRating ratingCount",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!isInWishlist) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your wishlist",
      });
    }

    user.wishlist.pull(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
};

