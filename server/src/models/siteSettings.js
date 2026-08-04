import mongoose from "mongoose";

// Singleton: the app only ever reads/writes ONE document of this collection.
const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "My Agency" },
    heroHeadline: { type: String, default: "We build delightful digital products" },
    aboutText: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);