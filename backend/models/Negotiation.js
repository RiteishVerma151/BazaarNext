
import mongoose from "mongoose";

const negotiationSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    offerPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true }
);

negotiationSchema.index({ product: 1, buyer: 1, status: 1 });

const Negotiation = mongoose.model("Negotiation", negotiationSchema);

export default Negotiation;
