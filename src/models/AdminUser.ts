import mongoose from "mongoose";

const ADMIN_USERS_COLLECTION = "admin_users";

const AdminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", AdminUserSchema, ADMIN_USERS_COLLECTION);
