import mongoose from "mongoose";

export const SITE_SETTINGS_COLLECTION = "site_settings";

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    phoneDisplay: {
      type: String,
      trim: true,
    },
    phoneHref: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model(
    "SiteSettings",
    SiteSettingsSchema,
    SITE_SETTINGS_COLLECTION
  );
