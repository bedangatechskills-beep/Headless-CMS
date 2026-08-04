import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    blurb: { type: String, default: "" },
    icon: { type: String, default: "" },          // an emoji, e.g. "🎨"
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);