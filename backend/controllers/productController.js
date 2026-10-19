
import mongoose from "mongoose";
import Product from "../models/Product.js";

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Furniture",
  "Home Appliances",
  "Sports",
  "Vehicles",
  "Other",
];

const conditions = ["Like New", "Good", "Fair"];

const validateProductData = (data, partial = false) => {
  const errors = [];

  if (!partial || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      data.title.trim().length < 3 ||
      data.title.trim().length > 100
    ) {
      errors.push("Title must be between 3 and 100 characters");
    }
  }

  if (!partial || data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      data.description.trim().length < 10 ||
      data.description.trim().length > 3000
    ) {
      errors.push("Description must be between 10 and 3000 characters");
    }
  }

  if (!partial || data.price !== undefined) {
    if (
      typeof data.price !== "number" ||
      !Number.isFinite(data.price) ||
      data.price < 1
    ) {
      errors.push("Price must be a number greater than or equal to 1");
    }
  }

  if (!partial || data.category !== undefined) {
    if (!categories.includes(data.category)) {
      errors.push("Invalid product category");
    }
  }

  if (!partial || data.condition !== undefined) {
    if (!conditions.includes(data.condition)) {
      errors.push("Invalid product condition");
    }
  }

  if (data.images !== undefined) {
    if (
      !Array.isArray(data.images) ||
      data.images.length > 10 ||
      !data.images.every(
        (image) =>
          typeof image === "string" &&
          image.trim().length > 0 &&
          image.length <= 2048
      )
    ) {
      errors.push("Images must be an array of up to 10 non-empty strings");
    }
  }

  if (data.location !== undefined) {
    const coordinates = data.location?.coordinates;

    if (
      data.location?.type !== "Point" ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      !coordinates.every(
        (coordinate) =>
          typeof coordinate === "number" && Number.isFinite(coordinate)
      ) ||
      coordinates[0] < -180 ||
      coordinates[0] > 180 ||
      coordinates[1] < -90 ||
      coordinates[1] > 90
    ) {
      errors.push("Location must contain valid longitude and latitude coordinates");
    }
  }

  return errors;
};

const productResponse = (product) => ({
  id: product._id,
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  condition: product.condition,
  images: product.images,
  seller: product.seller,
  status: product.status,
  location: product.location,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const createProduct = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "price",
      "category",
      "condition",
      "images",
      "location",
    ];

    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unsupported fields: ${unknownFields.join(", ")}`,
      });
    }

    const errors = validateProductData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors,
      });
    }

    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: productResponse(product),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 12);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
    }

    const filter = { status: "AVAILABLE" };

    if (req.query.category !== undefined) {
      if (!categories.includes(req.query.category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product category",
        });
      }

      filter.category = req.query.category;
    }

    if (req.query.condition !== undefined) {
      if (!conditions.includes(req.query.condition)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product condition",
        });
      }

      filter.condition = req.query.condition;
    }

    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      const minPrice = req.query.minPrice === undefined ? 0 : Number(req.query.minPrice);
      const maxPrice = req.query.maxPrice === undefined ? Infinity : Number(req.query.maxPrice);

      if (
        !Number.isFinite(minPrice) ||
        minPrice < 0 ||
        (req.query.maxPrice !== undefined &&
          (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
        minPrice > maxPrice
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid price range",
        });
      }

      filter.price = {
        ...(req.query.minPrice !== undefined && { $gte: minPrice }),
        ...(req.query.maxPrice !== undefined && { $lte: maxPrice }),
      };
    }

    if (req.query.search !== undefined) {
      if (
        typeof req.query.search !== "string" ||
        req.query.search.trim().length < 1 ||
        req.query.search.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Search must be between 1 and 100 characters",
        });
      }

      filter.$text = { $search: req.query.search.trim() };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("seller", "name avgRating ratingCount"),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products: products.map(productResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      status: { $ne: "REMOVED" },
    }).populate("seller", "name avgRating ratingCount");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: productResponse(product),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "price",
      "category",
      "condition",
      "images",
      "location",
    ];

    const fields = Object.keys(req.body);

    if (
      fields.length === 0 ||
      fields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid product fields to update",
      });
    }

    const errors = validateProductData(req.body, true);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        errors,
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
      status: "AVAILABLE",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Available product not found for your account",
      });
    }

    for (const field of fields) {
      product[field] = req.body[field];
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: productResponse(product),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
      status: "AVAILABLE",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Available product not found for your account",
      });
    }

    product.status = "REMOVED";
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};
