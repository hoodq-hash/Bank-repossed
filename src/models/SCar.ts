import mongoose from "mongoose";

const SCarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "$",
    },
    location: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["New", "Used", "Certified Pre-Owned"],
      default: "Used",
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual", "Semi-Automatic", "CVT"],
      default: "Automatic",
    },
    year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    make: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    engineSize: {
      type: String,
      trim: true,
    },
    registeredState: {
      type: String,
      trim: true,
    },
    sellingCondition: {
      type: String,
      default: "Registered",
    },
    boughtCondition: {
      type: String,
      default: "Registered",
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid","Gasoline"],
      default: "Petrol",
    },
    mileage: {
      type: Number,
      min: 0,
    },
    images: {
      type: [String],
      default: ["/cars/placeholder-car.jpg"],
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    downPayment: {
      type: Number,
      default: 0,
      min: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SCar || mongoose.model("SCar", SCarSchema);
