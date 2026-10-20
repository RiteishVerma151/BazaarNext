import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Electronics",
        "Fashion",
        "Books",
        "Furniture",
        "Home Appliances",
        "Sports",
        "Vehicles",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["Like New", "Good", "Fair"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images.length <= 10,
        message: "A product can have at most 10 images",
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "SOLD", "REMOVED"],
      default: "AVAILABLE",
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ location: "2dsphere" });

const Product = mongoose.model("Product", productSchema);

export default Product;
