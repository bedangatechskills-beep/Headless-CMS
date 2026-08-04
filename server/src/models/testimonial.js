import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    authorName: { type: String, required: true },
    authorCompany: { type: String, default: "" },
    avatar: { type: String, default: "" }         // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);